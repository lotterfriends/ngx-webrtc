import {
  AfterViewInit, Component, ComponentRef,
  ElementRef, HostListener, Input, OnInit, ViewChild, ViewContainerRef
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ConferenceGridHolderComponent } from '@ngx-webrtc/demo-ui-components';
import { MessageType, User } from '@ngx-webrtc/demo-video-chat-models';
import {
  CallService, DeviceService, IceServer, PeerConnectionClient, PeerConnectionClientSignalMessage, StreamService, StreamType
} from 'ngx-webrtc';
import { distinctUntilChanged, filter, first, map } from 'rxjs/operators';
import { MessagesService } from '../../services/messages.service';
import { SocketService } from '../../services/socket.service';
import { UiService, ViewMode } from '../../services/ui.service';
import { UserStorageService } from '../../services/user-storage.service';
import { RemotePeerComponent } from './remote-peer/remote-peer.component';

/**
 * This is an example implementation of an video chat
 */
@UntilDestroy()
@Component({
  selector: 'ngx-webrtc-video-chat',
  templateUrl: './video-chat.component.html',
  styleUrls: ['./video-chat.component.css']
})
export class VideoChatComponent implements OnInit, AfterViewInit {

  private debug = true;
  public pclients: {user: User, connection: PeerConnectionClient, component: ComponentRef<RemotePeerComponent>}[] = [];
  public viewMode = UiService.DEFAULTS.VIEW_MODE;
  private localStream: MediaStream | null = null;
  public localVideoEnabled = false;
  private isInitiator = false;
  private self: string | null = null;
  private users: User[] = [];
  private identifier: (keyof User) = this.callService.getUserIdentifier();
  private servers: IceServer[] = [];

  @Input() room!: string;
  @ViewChild('localStreamNode', { static: false }) localStreamNode!: ElementRef;
  @ViewChild('remotePeerHolder',  { read: ViewContainerRef }) remotePeerHolder!: ViewContainerRef;
  @ViewChild('holder', { static: false }) public holder!: ConferenceGridHolderComponent;
  @HostListener('window:resize') public onWinResize(): void {
    this.resize();
  }
  @HostListener('window:beforeunload') onClose(): void {
    this.stopCall();
  }

  constructor(
    private userStorageService: UserStorageService,
    private socketService: SocketService,
    private messageService: MessagesService,
    private streamService: StreamService,
    private callService: CallService,
    private uiService: UiService,
    private deviceService: DeviceService
  ) {}


  ngAfterViewInit(): void {
    // update grid size when ui changed
    this.uiService.isChatVisible$.pipe(untilDestroyed(this)).subscribe(this.resize.bind(this));
    this.uiService.isUserlistVisible$.pipe(untilDestroyed(this)).subscribe(this.resize.bind(this));
  }

  ngOnInit(): void {
    this.log('init');
    // get own user from store
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

    // send stream events to peers

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

    // change audio output
    this.streamService.audioOutput$.pipe(
    untilDestroyed(this),
      filter(e => e !== null)
    ).subscribe(deviceId => {
      this.pclients.forEach(async client => {
        await client.component?.instance?.audioStreamNode?.nativeElement?.setSinkId(deviceId);
      });
    });

    this.streamService.replaceTrack$.pipe(
      untilDestroyed(this),
      filter(e => e !== null)
    ).subscribe((track) => {
      this.log('replaceTrack', track);
      if (track) {
        this.pclients.forEach(async client => {
          client.connection.replaceTrack(track);
        });
      } else {
        this.log('WARNING: track is null');
      }
    });

    // send call events to peers

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

  public startCall(servers: IceServer[]): void {
    this.log('startCall');
    this.servers = servers;
    this.getMediaAndStart();
  }

  private getMediaAndStart(): void {
    const preferredVideoInputDevice = this.deviceService.preferredVideoInputDevice$.getValue();
    const preferredAudioInputDevice = this.deviceService.preferredAudioInputDevice$.getValue();
    const preferredAudioInputDeviceVolume = this.deviceService.preferredAudioInputDeviceVolume$.getValue();
    let audioConstraint: boolean | { deviceId?: string, volume?: number }  = true;
    if (preferredAudioInputDevice || preferredAudioInputDeviceVolume !== null) {
      if (preferredAudioInputDevice && preferredAudioInputDeviceVolume !== null) {
        audioConstraint = {
          deviceId: preferredAudioInputDevice,
          volume: preferredAudioInputDeviceVolume
        }
      } else if (preferredAudioInputDevice) {
        audioConstraint = {
          deviceId: preferredAudioInputDevice
        }
      } else if (preferredAudioInputDeviceVolume) {
        audioConstraint = {
          volume: preferredAudioInputDeviceVolume
        }
      }
    }
    this.streamService.tryGetUserMedia({
      video: preferredVideoInputDevice ? { deviceId: preferredVideoInputDevice } : true,
      audio: audioConstraint
    }).then(this.onLocalStream.bind(this), this.onNoStream.bind(this));
  }

  private onLocalStream(stream: MediaStream): void {
    this.localVideoEnabled = true;
    this.localStream = stream;
    this.streamService.setLocalStream(stream);
    this.streamService.setStreamInNode(this.localStreamNode.nativeElement, stream, true, true);

    this.log('joinedRoom');

    this.socketService.onUsersJoinedRoom().pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(this.onUserJoined.bind(this));

    this.socketService.joinedRoom();
    this.callService.start();
  }

  private onNoStream(): void {
    this.socketService.onUsersJoinedRoom().pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(this.onUserJoined.bind(this));

    this.socketService.joinedRoom();
    this.callService.start();
  }

  private filterConnectedUsers(user: User): boolean {
    return user[this.identifier] !== this.self &&
      !this.pclients.map(e => e.user[this.identifier]).includes(user[this.identifier]);
  }

  private async onUserJoined(users: User[]): Promise<void> {
    if (this.users === users) {
      return;
    }
    this.users = users;
    this.log('onUserJoined', users);
    if (users.length > 1) {

      if (users.length > 2 && this.pclients.length) {
        this.isInitiator = true;
      }

      for (const [i, user] of users.filter(this.filterConnectedUsers.bind(this)).entries()) {
        this.log('new user', user);
        const component = this.remotePeerHolder.createComponent(RemotePeerComponent);
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

  private async onUserLeft(user: User): Promise<void> {
    this.log('onUserLeft', user);
    if (user.name !== this.self) {
      this.callService.removeUser(user);
      const entry = this.pclients.find(e => e.user[this.identifier] === user[this.identifier]);
      if (entry?.component?.instance?.audioStreamNode) {
        this.streamService.stopStreamInNode(entry.component.instance.audioStreamNode);
      }
      if (entry?.component?.instance?.videoStreamNode) {
        this.streamService.stopStreamInNode(entry.component.instance.videoStreamNode);
      }
      if (entry?.connection) {
        entry.connection.close();
      }
      if (entry?.component) {
        entry.component.destroy();
      }
      this.pclients = this.pclients.filter(e => e.user[this.identifier] !== user[this.identifier]);

      // everyone else left, now I'm the initiator
      if (!this.pclients.length) {
        this.isInitiator = true;
      }
      this.resize();
    }
  }

  private async addPeer(user: User, component: ComponentRef<RemotePeerComponent>): Promise<PeerConnectionClient> {
    this.log('addPeer', user, component);

    const cert = await this.callService.createCertifcate();
    const pclient = await this.callService.createPeerClient({
      peerConnectionConfig: {
        iceServers: this.servers,
        certificates: [cert],
      }
    });

    // add media
    if (this.localStream) {
      pclient.addStream(this.localStream);
    }

    // signaling out
    pclient.signalingMessage.subscribe(m => {
      // this.log(m);
      this.socketService.sendSignalMessage(m, user.name);
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
      ).subscribe(() => {
        this.startPeerConnection(pclient, user);
      });
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

  private startPeerConnection(pclient: PeerConnectionClient, user: User): void {
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

  public stopCall(): void {
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

  private resize(): void {
    setTimeout(() => {
      if (this.viewMode === ViewMode.Grid) {
        this.holder.resizeGrid();
      } else {
        this.holder.removeSize();
      }
    });
  }

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  private log(...args: any[]): void {
    if (this.debug) {
      console.log(...args);
    }
  }

}
