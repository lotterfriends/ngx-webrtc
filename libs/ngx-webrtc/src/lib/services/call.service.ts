import { ComponentRef, EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';
import { RemotePeerComponentInterface } from '../interfaces/remote-peer-component-interface';
import { PeerConnectionClient } from '../peer-connection-client';

// TODO abtract user interface
export interface UserInCall {
  user: User;
  hasCam: boolean;
  hasMic: boolean;
  volume: number;
  audioMuted: boolean;
  videoMuted: boolean;
  shareScreen: boolean;
  connection: PeerConnectionClient;
  node: ComponentRef<RemotePeerComponentInterface>;
}

@Injectable({
  providedIn: 'root'
})
export class CallService {

  // TODO: add option to configure this
  private identifier: (keyof User) = 'name';
  public users$ = new BehaviorSubject<UserInCall[]>([]);
  private since: number = 0;
  public startShareScreen = new EventEmitter<void>();
  public stopShareScreen = new EventEmitter<void>();
  private servers: { urls: string | string[]; }[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
    { urls: 'stun:stun.services.mozilla.com' },
  ];

  public started$ = new BehaviorSubject<boolean>(false);

  constructor() { }

  updateSince(): void {
    this.since = Date.now();
    sessionStorage.setItem('since', `${this.since}`);
  }

  getSince(): number {
    const sessionStorageSince: string | null = sessionStorage.getItem('since');
    if (!this.since && sessionStorageSince && sessionStorageSince !== null) {
      this.since = parseInt(sessionStorageSince, 10);
    }
    return this.since;
  }


  public addUser(user: User, connection: PeerConnectionClient, node: ComponentRef<RemotePeerComponentInterface>): void {
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

  public removeUser(user: User): void {
    let users = this.getUsers();
    users = users.filter(e => e.user[this.identifier] !== user[this.identifier]);
    this.users$.next(users);
  }

  public userHasCam(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.hasCam = true;
      this.users$.next(users);
    }
  }

  public userHasMic(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.hasMic = true;
      this.users$.next(users);
    }
  }

  public userAudioMuted(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.audioMuted = true;
      this.users$.next(users);
    }
  }

  public userAudioUnmuted(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.audioMuted = false;
      this.users$.next(users);
    }
  }

  public userVideoMuted(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.videoMuted = true;
      this.users$.next(users);
    }
  }

  public userVideoUnmuted(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.videoMuted = false;
      this.users$.next(users);
    }
  }

  public userStartShareScreen(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.shareScreen = true;
      this.users$.next(users);
    }
  }

  public userStopShareScreen(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.shareScreen = false;
      this.users$.next(users);
    }
    this.users$.next(users);
  }

  private findUser(users: UserInCall[], user: User): UserInCall | null {
    return users.find(e => e.user[this.identifier] === user[this.identifier]) || null;
  }
  public getUsers(): UserInCall[] {
    return this.users$.getValue();
  }

  public getUser(user: User): UserInCall | null {
    return this.getUsers().find(e => e.user[this.identifier] === user[this.identifier]) || null;
  }


  public setServers(servers: { urls: string | string[]; }[]): void {
    this.servers = servers;
  }

  public async createPeerClient(): Promise<PeerConnectionClient> {

    // using user certificate algorithm result in random fails
    const cert = await RTCPeerConnection.generateCertificate({
      name: 'ECDSA',
      namedCurve: 'P-256'
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

  public getUserIdentifier(): (keyof User) {
    return this.identifier;
  }

}
