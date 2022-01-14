import { ChangeDetectorRef, Component, ComponentFactoryResolver, ComponentRef, ElementRef, HostListener, Injector, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, first, map, tap } from 'rxjs/operators';
import { MessageType } from "../../../../../../libs/models/message-type";
import { User } from "../../../../../../libs/models/user";
import { PeerConnectionClient, PeerConnectionClientSignalMessage, StreamType } from 'src/app/peer/peer-connection-client';
import { StreamService } from 'src/app/peer/services/stream.service';
import { MessagesService } from 'src/app/services/messages.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserStorageService } from 'src/app/services/user-storage.service';
import { RemotePeerComponent } from './remote-peer/remote-peer.component';
import { CallService } from 'src/app/peer/services/call.service';
import { UiService, ViewMode } from 'src/app/services/ui.service';

@UntilDestroy()
@Component({
  selector: 'app-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit {

  @HostListener('window:beforeunload', ['$event'])
  onClose() {
    this.stopCall();
  }

  constructor(
    private userStorageService: UserStorageService,
    private socketService: SocketService,
    private messageService: MessagesService,
    private streamService: StreamService,
    private changeDetectorRef: ChangeDetectorRef,
    private cfr: ComponentFactoryResolver,
    private injector: Injector,
    private callService: CallService,
    private uiService: UiService
  ) {
  }
  ngAfterViewInit(): void {
    this.uiService.isChatVisible$.pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.resize();
    });
    this.uiService.isUserlistVisible$.pipe(
      untilDestroyed(this)
    ).subscribe(() => {
      this.resize();
    });
  }

  @Input('room') room!: string;
  @ViewChild('localStreamNode', { static: false }) localStreamNode: ElementRef;
  @ViewChild('remotePeerHolder',  { read: ViewContainerRef }) remotePeerHolder!: ViewContainerRef;
  @ViewChild('holder', { static: false }) public holder: ElementRef;

  private debug = true;
  public pclients: {user: User, connection: PeerConnectionClient, component: ComponentRef<RemotePeerComponent>}[] = [];
  public viewMode = UiService.DEFAULTS.VIEW_MODE;
  private localStream: MediaStream;
  public localVideoEnabled = false;
  private isInitiator = false;
  private self;
  private users;
  private sizing = {
    margin: 10,
    ratios: ['4:3', '16:9', '1:1', '1:2'],
    selectedRatioIndex: 0,
    ratio: () => {
      const ratio = this.sizing.ratios[this.sizing.selectedRatioIndex].split(":");
      return parseInt(ratio[1]) / parseInt(ratio[0]);
    }
  }

  ngOnInit(): void {
    this.log('init');
    this.self = this.userStorageService.getCurrentUsername();

    this.socketService.onUserLeftRoom().pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(this.onUserLeft.bind(this));

    // signaling in 
    this.socketService.getPrivateMessages().pipe(
      untilDestroyed(this),
      filter(m => m.type === MessageType.Signal)
    ).subscribe(message => {
      for (const client of this.pclients) {
        if (client.user.name === message.author) {
          client.connection.receiveSignalingMessage(message.message);
        }
      }
    });

    this.streamService.localAudioStreamStatusChanged.pipe(
      untilDestroyed(this),
    ).subscribe(localAudioEnabled => {
      this.pclients.forEach(e => {
        localAudioEnabled ? e.connection.audioUnmuted() : e.connection.audioMuted();
      });
    });
    
    this.streamService.localVideoStreamStatusChanged.pipe(
      untilDestroyed(this),
      ).subscribe(localVideoEnabled => {
        this.localVideoEnabled = localVideoEnabled;
        this.pclients.forEach(e => {
          localVideoEnabled ? e.connection.videoUnmuted() : e.connection.videoMuted();
        });
    });

    this.callService.startShareScreen.pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.pclients.forEach(e => {
        e.connection.startShareScreen();
      });
    });
    this.callService.stopShareScreen.pipe(
      untilDestroyed(this),
    ).subscribe(() => {
      this.pclients.forEach(e => {
        e.connection.stopShareScreen();
      });
    });

  }

  public startCall(servers: {urls: string | string[]}[]) {
    this.log('startCall');
    this.callService.setServers(servers);
    this.getMediaAndStart();
  }

  private getMediaAndStart() {
    this.streamService.tryGetUserMedia().then(this.onLocalStream.bind(this), this.onNoStream.bind(this));
  }

  private onLocalStream(stream: MediaStream) {
    this.localVideoEnabled = true;
    this.localStream = stream;
    this.streamService.setLocalStream(stream);
    this.streamService.setStreamInNode(this.localStreamNode.nativeElement, stream);

    this.log('joinedRoom');

    this.socketService.onUsersJoinedRoom().pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(this.onUserJoined.bind(this));

    this.socketService.joinedRoom();
    this.callService.start();
  }

  private onNoStream() {
    this.socketService.onUsersJoinedRoom().pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(this.onUserJoined.bind(this));

    this.socketService.joinedRoom();
    this.callService.start();
  }

  private filterConnectedUsers(user: User) {
    return user.name !== this.self && !this.pclients.map(e => e.user.name).includes(user.name);
  }

  private async onUserJoined(users: User[]) {
    if (this.users === users) {
      return;
    }
    this.users = users;
    this.log('onUserJoined', users);
    if (users.length > 1) {

      if (users.length > 2 && this.pclients.length) {
        this.isInitiator = true;
      }
      
      for(const user of users.filter(this.filterConnectedUsers.bind(this))) {
        this.log('new user', user);
        const component = await this.createRemotePeerComponent();
        const connection = await this.addPeer(user, component);
        this.pclients.push({
          component,
          user,
          connection
        });
        this.callService.addUser(user, connection, component);
        component.instance.setUser(user);
        this.resize();
      }
    } else {
      this.isInitiator = true;
    }
  }

  private async onUserLeft(user: User) {
    this.log('onUserLeft', user);
    if (user.name !== this.self) {
      this.callService.removeUser(user);
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
      this.resize();
    }
  }

  async addPeer(user: User, component: ComponentRef<RemotePeerComponent>): Promise<PeerConnectionClient> {
    this.log('addPeer', user, component)
    const pclient = await this.callService.createPeerClient();
    // add media
    if (this.localStream) {
      pclient.addStream(this.localStream);
    }
    
    // signaling out
    pclient.signalingMessage.subscribe(m => {
      // this.log(m);
      this.socketService.sendSignalMessage(m, user.name);
    });
    
    this.streamService.replaceTrack$.pipe(
      untilDestroyed(this),
      filter(e => e !== null)
    ).subscribe((track) => {
      this.log('replaceTrack', track);
      pclient.replaceTrack(track);
    });

    // change audio output
    this.streamService.audioOutput$.pipe(
      untilDestroyed(this),
      filter(e => e !== null)
    ).subscribe(deviceId => {
      this.pclients.forEach(async client => {
        await client.component?.instance?.audioStreamNode?.nativeElement?.setSinkId(deviceId);
      });
    });

    pclient.remoteStreamAdded.pipe(
      untilDestroyed(this),
    ).subscribe(stream => {
      this.log('remoteStreamAdded', user);
      if (stream.kind === StreamType.Audio) {
        this.streamService.setStreamInNode(component.instance.audioStreamNode.nativeElement, stream.track, false);
        this.callService.userHasMic(user);
      }
      if (stream.kind === StreamType.Video) {
        this.streamService.setStreamInNode(component.instance.videoStreamNode.nativeElement, stream.track);
        this.callService.userHasCam(user);
      }
    });

    if (this.localStream) {
      pclient.negotiationNeededTriggered.pipe(
        untilDestroyed(this)
      ).subscribe(this.startPeerConnection.apply(this, [pclient, user]));
    } else {
      this.startPeerConnection(pclient, user);
    }

    pclient.muteMyAudio.pipe(untilDestroyed(this)).subscribe(() => {
      this.streamService.muteLocalAudioStream();
    });

    pclient.muteMyVideo.pipe(untilDestroyed(this)).subscribe(() => {
      this.streamService.muteLocalVideoStream();
    });

    pclient.userMuteAudio.pipe(untilDestroyed(this)).subscribe(() => {
      this.callService.userAudioMuted(user);
    });

    pclient.userUnmuteAudio.pipe(untilDestroyed(this)).subscribe(() => {
      this.callService.userAudioUnmuted(user);
    });
  
    pclient.userUnmuteVideo.pipe(untilDestroyed(this)).subscribe(() => {
      this.callService.userVideoUnmuted(user);
    });
    
    pclient.userMuteVideo.pipe(untilDestroyed(this)).subscribe(() => {
      this.callService.userVideoMuted(user);
    });


    // pclient.remoteHangUp.pipe(first()).subscribe(() => {
    //   this.streamService.stopStream(component.instance.audioStreamNode);
    //   this.streamService.stopStream(component.instance.videoStreamNode);
    //   pclient.close();
    // });

    return pclient;
  }

  startPeerConnection(pclient: PeerConnectionClient, user: User) {
    if (this.isInitiator) {
      pclient.startAsCaller();
      this.log('start as caller', user);
    } else {
      this.messageService.getPrivateMessages(this.room, MessageType.Signal, user.name, this.callService.getSince()).pipe(
        first(),
        map(m => m.messages.map(e => JSON.parse(e.message) as PeerConnectionClientSignalMessage))
      ).subscribe(messages => {
        this.log('start as callee', user, messages);
        pclient.startAsCallee(messages);
      });
    }
  }


  stopCall() {
    this.callService.users$.next([]);
    this.streamService.stopStreamInNode(this.localStreamNode);
    this.streamService.setLocalStream(null);
    if (this.pclients && this.pclients.length) {
      this.pclients.forEach(client => {
        client.connection.close();
      });
    }
    this.remotePeerHolder.clear();
    this.pclients = [];
    this.callService.updateSince();
    this.callService.stop();
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

  @HostListener('window:resize')
  public onWinResize() {
    this.resize();
  }

  dimensions() {
    return {
      holderWidth: this.holder.nativeElement.offsetWidth - (this.sizing.margin * 2),
      holderHeight: this.holder.nativeElement.offsetHeight - (this.sizing.margin * 2)
    }
  }

  resizer(width) {
    const components = this.pclients.map(e => e.component);
    for (const child of components) {
      const node: HTMLElement = child.instance.elementRef.nativeElement;
      node.style.margin = this.sizing.margin + 'px';
      node.style.width = width + 'px';
      node.style.height = (width * this.sizing.ratio()) + 'px';
      node.setAttribute('data-aspect', this.sizing.ratios[this.sizing.selectedRatioIndex]);
    }
  }

  area(holderWidth, holderHeight, increment) {
    let elementWidth = 0;
    let elementHeight = increment * this.sizing.ratio() + (this.sizing.margin * 2);
    for (let index = 0; index < this.holder.nativeElement.children.length; index++) {
      if ((elementWidth + increment) > holderWidth) {
        elementWidth = 0;
        elementHeight = elementHeight + (increment * this.sizing.ratio()) + (this.sizing.margin * 2);
      }
      elementWidth = elementWidth + increment + (this.sizing.margin * 2);
    }
    return (elementHeight > holderHeight || increment > holderWidth) ? false : increment;
  }

  resize() {
    setTimeout(() => {
      if (this.viewMode === ViewMode.Grid) {
        this.resizeGrid();
      } else {
        this.removeSize();
      }
    });
  }

  resizeGrid() {
    this.log('resizeGrid');
    const {holderWidth, holderHeight} = this.dimensions();
    let max = 0
    let i = 1
    while (i < holderWidth) {
      if (!this.area(holderWidth, holderHeight, i)) {
        max = i - 1;
        break;
      }
      i++;
    }
    max = max - (this.sizing.margin * 2);
    this.resizer(max);
  }

  removeSize() {
    this.log('removeSize');
    const components = this.pclients.map(e => e.component);
    for (const child of components) {
      const node: HTMLElement = child.instance.elementRef.nativeElement;
      node.style.margin =  '';
      node.style.width = '';
      node.style.height = '';
      node.removeAttribute('data-aspect');
    }
  }

  log(...args: any[]): void {
    if (this.debug) {
      console.log(...args);
    }
  }

}
