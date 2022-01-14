import { ComponentRef, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RemotePeerComponent } from 'src/app/components/video-chat/remote-peer/remote-peer.component';
import { User } from '../../../../../../libs/models';
import { PeerConnectionClient } from '../peer-connection-client';

export interface UserInCall {
  user: User,
  hasCam: boolean,
  hasMic: boolean,
  volume: number,
  audioMuted: boolean,
  videoMuted: boolean,
  shareScreen: boolean,
  connection: PeerConnectionClient,
  node: ComponentRef<RemotePeerComponent>
}

@Injectable({
  providedIn: 'root'
})
export class CallService {

  // TODO: add option to configure this
  private identifier = 'name';
  public users$ = new BehaviorSubject<UserInCall[]>([]);
  private since: number;
  public startShareScreen = new EventEmitter<void>();
  public stopShareScreen = new EventEmitter<void>();
  private servers: { urls: string | string[]; }[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
    { urls: 'stun:stun.services.mozilla.com' },
  ];

  public started$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  updateSince() {
    this.since = Date.now();
    sessionStorage.setItem('since', '' +this.since);
  }

  getSince() {
    if (!this.since && sessionStorage.getItem('since')) {
      this.since = parseInt(sessionStorage.getItem('since'), 10);
    }
    return this.since;
  }


  public addUser(user: User, connection: PeerConnectionClient, node: ComponentRef<RemotePeerComponent>) {
    const users = this.getUsers();
    users.push({
      user,
      hasCam: false,
      hasMic: false,
      volume: 1,
      audioMuted: false,
      videoMuted: false,
      shareScreen: false,
      connection,
      node
    });
    this.users$.next(users);
  }

  public removeUser(user: User) {
    let users = this.getUsers();
    users = users.filter(e => e.user[this.identifier] !== user[this.identifier]);
    this.users$.next(users);
  }

  public userHasCam(user: User) {
    let users = this.getUsers();
    this.findUser(users, user).hasCam = true;
    this.users$.next(users);
  }

  public userHasMic(user: User) {
    let users = this.getUsers();
    this.findUser(users, user).hasMic = true;
    this.users$.next(users);
  }

  public userAudioMuted(user: User) {
    let users = this.getUsers();
    this.findUser(users, user).audioMuted = true;
    this.users$.next(users);
  }

  public userAudioUnmuted(user: User) {
    let users = this.getUsers();
    this.findUser(users, user).audioMuted = false;
    this.users$.next(users);
  }
  
  public userVideoMuted(user: User) {
    let users = this.getUsers();
    this.findUser(users, user).videoMuted = true;
    this.users$.next(users);
  }

  public userVideoUnmuted(user: User) {
    let users = this.getUsers();
    this.findUser(users, user).videoMuted = false;
    this.users$.next(users);
  }
 
  public userStartShareScreen(user: User) {
    let users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.shareScreen = true;
      currentUser.spotlight = true;
      this.users$.next(users);
    }
  }
  
  public userStopShareScreen(user: User) {
    let users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.shareScreen = false;
      currentUser.spotlight = false;
      this.users$.next(users);
    }
  }
    this.users$.next(users);
  }

  private findUser(users: UserInCall[], user: User): UserInCall {
    return users.find(e => e.user[this.identifier] === user[this.identifier]);
  }
  public getUsers(): UserInCall[] {
    return this.users$.getValue();
  }
  
  public getUser(user: User): UserInCall {
    return this.getUsers().find(e => e.user[this.identifier] === user[this.identifier]);
  }


  public setServers(servers: { urls: string | string[]; }[]): void {
    this.servers = servers;
  }

  public async createPeerClient(): Promise<PeerConnectionClient> {
    
    // using user certificate algorithm result in random fails 
    const cert = await RTCPeerConnection.generateCertificate({
      name: "ECDSA",
      namedCurve: "P-256"
    } as AlgorithmIdentifier);

    const peerConnectionClient = new PeerConnectionClient({
      peerConnectionConfig: {
        iceServers: this.servers,
        certificates: [cert]
      }
    });
    
    
    return peerConnectionClient;
  }

  public start(): void {
    this.started$.next(true);
  }

  public stop(): void {
    this.started$.next(false);
  }

  public getUserIdentifier(): string {
    return this.identifier;
  }

}
