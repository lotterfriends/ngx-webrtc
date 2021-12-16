import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, Injector, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { MessageType } from "../../../../../../libs/models/message-type";
import { User } from "../../../../../../libs/models/user";
import { Call } from 'src/app/peer/call';
import { PeerConnectionClient, PeerConnectionClientSignalMessage, StreamType } from 'src/app/peer/peer-connection-client';
import { StreamService } from 'src/app/peer/services/stream.service';
import { MessagesService } from 'src/app/services/messages.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserStorageService } from 'src/app/services/user-storage.service';
import { RemotePeerComponent } from './remote-peer/remote-peer.component';
import { CallService } from 'src/app/peer/services/call.service';

@UntilDestroy()
@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit {

  constructor(
    private userStorageService: UserStorageService,
    private socketService: SocketService,
    private messageService: MessagesService,
    private streamService: StreamService,
    private changeDetectorRef: ChangeDetectorRef,
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
    private callService: CallService,
  ) {
    this.call = new Call();
  }

  @Input('room') room!: string;
  @ViewChild('localStreamNode', { static: false }) localStreamNode: ElementRef;
  @ViewChild('remotePeerHolder',  { read: ViewContainerRef }) remotePeerHolder!: ViewContainerRef;

  private debug = true;
  public pclients: {user: User, connection: PeerConnectionClient, component: ComponentRef<RemotePeerComponent>}[] = [];
  private call: Call;
  private localStream: MediaStream;
  private isInitiator = false;
  private self;

  ngOnInit(): void {
    this.log('init');
    this.self = this.userStorageService.getCurrentUsername();

    this.socketService.onUserLeftRoom().pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(this.onUserLeft.bind(this));
  }

  public startCall(servers: {urls: string | string[]}[]) {
    this.log('startCall');
    this.call.setServers(servers);
    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then((stream) => {
      this.localStream = stream;
      this.streamService.setLocalStream(stream);
      this.streamService.setStreamInNode(this.localStreamNode.nativeElement, stream);

      this.log('joinedRoom');

      this.socketService.onUsersJoinedRoom().pipe(
        untilDestroyed(this),
        distinctUntilChanged()
      ).subscribe(this.onUserJoined.bind(this));
  
      this.socketService.joinedRoom();

    });
  }

  private filterConnectedUsers(user: User) {
    return user.name !== this.self && !this.pclients.map(e => e.user.socketId).includes(user.socketId);
  }

  private async onUserJoined(users: User[]) {
    this.log('onUserJoined', users);
    if (users.length > 1) {

      if (users.length > 2 && this.pclients.length) {
        this.isInitiator = true;
      }
      
      for(const user of users.filter(this.filterConnectedUsers.bind(this))) {
        this.log('new user', user);
        const component = await this.createRemotePeerComponent();
        this.pclients.push({
          component,
          user,
          connection: await this.addPeer(user, component)
        });
        component.instance.setUser(user);
      }
    } else {
      this.isInitiator = true;
    }
  }

  private async onUserLeft(user: User) {
    this.log('onUserLeft', user);
    if (user.name !== this.self) {
      const entry = this.pclients.find(e => e.user.name === user.name);
      if (entry?.component?.instance?.audioStreamNode) {
        this.streamService.stopStreamInNode(entry.component.instance.audioStreamNode);
      }
      if (entry?.component?.instance?.videoStreamNode) {
        this.streamService.stopStreamInNode(entry.component.instance.videoStreamNode);
      }
      if(entry?.connection) {
        entry.connection.close();
      }
      this.log(entry);
      if (entry?.component) {
        entry.component.destroy();
      }
      this.log(this.pclients);
      this.pclients = this.pclients.filter(e => e.user.name !== user.name);
      this.log(this.pclients);

      // everyone else left, now I'm the initiator
      if (!this.pclients.length) {
        this.isInitiator = true;
      }
    }
  }

  async addPeer(user: User, component: ComponentRef<RemotePeerComponent>): Promise<PeerConnectionClient> {
    this.log('addPeer', user, component)
    const pclient = await this.call.createPeerClient();
    // add media
    pclient.addStream(this.localStream);
    
    // signaling out
    pclient.signalingMessage.subscribe(m => {
      // this.log(m);
      this.socketService.sendSignalMessage(m, user.name);
    });
    
    // signaling in 
    this.socketService.getPrivateMessages().pipe(filter(m => m.type === MessageType.Signal && m.author === user.name)).subscribe(message => {
      pclient.receiveSignalingMessage(message.message);
    });

    this.streamService.replaceTrack$.pipe(filter(e => e !== null)).subscribe((track) => {
      this.log('replaceTrack', track);
      pclient.replaceTrack(track);
    });

    pclient.remoteStreamAdded.subscribe(stream => {
      if (stream.kind === StreamType.Audio) {
        this.streamService.setStreamInNode(component.instance.audioStreamNode.nativeElement, stream.track, false);
      }
      if (stream.kind === StreamType.Video) {
        this.log('remoteStreamAdded', user);
        this.streamService.setStreamInNode(component.instance.videoStreamNode.nativeElement, stream.track);
      }
    });

    if (this.isInitiator) {
      pclient.startAsCaller();
      this.log('start as caller', user);
    } else {
      this.messageService.getPrivateMessages(this.room, MessageType.Signal, this.callService.getSince()).pipe(
        first(),
        map(m => m.messages.map(e => JSON.parse(e.message) as PeerConnectionClientSignalMessage))
        ).subscribe(messages => {
        this.log('start as callee', user, messages);
        pclient.startAsCallee(messages);
      });
    }

    // pclient.remoteHangUp.pipe(first()).subscribe(() => {
    //   this.streamService.stopStream(component.instance.audioStreamNode);
    //   this.streamService.stopStream(component.instance.videoStreamNode);
    //   pclient.close();
    // });

    return pclient;
  }


  stopCall() {
    this.streamService.stopStreamInNode(this.localStreamNode);
    if (this.pclients && this.pclients.length) {
      this.pclients.forEach(client => {
        client.connection.close();
      });
    }
    this.remotePeerHolder.clear();
    this.pclients = [];
    this.callService.updateSince();
  }

  async getRemotePeerFactory() {
    const { RemotePeerComponent } = await import('./remote-peer/remote-peer.component');
    return this.cfr.resolveComponentFactory(RemotePeerComponent);
  }

  async createRemotePeerComponent(): Promise<ComponentRef<RemotePeerComponent>> {
    const factory = await this.getRemotePeerFactory();
    const component = this.remotePeerHolder.createComponent(factory, null, this.injector);
    this.changeDetectorRef.detectChanges();
    return component;
  }

  log(...args: any[]): void {
    if (this.debug) {
      console.log(...args);
    }
  }

}
