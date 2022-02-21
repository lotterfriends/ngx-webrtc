import { ComponentRef, EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';
import { RemotePeerComponentInterface } from '../interfaces/remote-peer-component-interface';
import { PeerConnectionClient } from '../peer-connection-client';
import { PeerConnectionClientSettings } from "../interfaces/peer-connection-client-settings";
import { UserInCall } from '../interfaces/user-in-call';
import { NgxWebrtConfiguration } from '../ngx-webrtc-configuration';
import { IceServer } from '../interfaces/ice-server';

/**
 * The CallService holds the state of the peer connection. It provides methods to update the state
 * and methods to create a `PeerConnectionClient`.
 */
@Injectable({
  providedIn: 'root'
})
export class CallService {

  constructor(
    private readonly config: NgxWebrtConfiguration
  ){}


  private readonly storage_key_since = 'ngx-webrtc-since';
  private since = 0;

  // TODO: add option to configure this
  private identifier: (keyof User) = this.config.userIdentifier as (keyof User);
  
  /**
   * users in call state, add user via `CallService.addUser(User,...)` and remove user via `CallService.removeUser(User)`.
   * get all User via `CallService.getUsers()`, get one user via `CallService.getUser()`.
   */
  public users$ = new BehaviorSubject<UserInCall[]>([]);



  /**
   * Emited by `ShareScreenDirective` when current User starts sharing his screen. 
   */
  public startShareScreen = new EventEmitter<void>();
  
  
  /**
   * Emited by `ShareScreenDirective` when current User stops sharing his screen. 
   */
  public stopShareScreen = new EventEmitter<void>();
  
  /**
   * default public and free IceServers list
   * ```json
   * [
   *  { urls: 'stun:stun.l.google.com:19302' },
   *  { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
   *  { urls: 'stun:stun.services.mozilla.com' },
   * ]
   *
   * ```
   */
  public defaultServers: IceServer[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
    { urls: 'stun:stun.services.mozilla.com' },
  ];

  /**
   * chat status state
   */
  public started$ = new BehaviorSubject<boolean>(false);

  /**
   * update since timestamp with current time
   */
  public updateSince(): void {
    this.since = Date.now();
    // TODO: make storage customizable via provider
    sessionStorage.setItem(this.storage_key_since, `${this.since}`);
  }

  /**
   * get current since timestamp set by `CallService.updateSince()`
   * @returns Timestamp
   */
  public getSince(): number {
    const sessionStorageSince: string | null = sessionStorage.getItem(this.storage_key_since);
    if (!this.since && sessionStorageSince && sessionStorageSince !== null) {
      this.since = parseInt(sessionStorageSince, 10);
    }
    return this.since;
  }

  /**
   * The `CallService` hold the users state with all users, with this methode you can add a user to the state.
   * @param user User object that contains userIdentifier
   * @param connection created connection for the user 
   * @param node component that is used to display the users webcam, etc.
   */
  public addUser(user: User, connection: PeerConnectionClient, node?: ComponentRef<RemotePeerComponentInterface>): void {
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

  /**
   * remove a user object from state
   * @param user User object to remove
   */
  public removeUser(user: User): void {
    let users = this.getUsers();
    users = users.filter(e => e.user[this.identifier] !== user[this.identifier]);
    this.users$.next(users);
  }

  /**
   * Use this method if the passed user has a camera to update the state.
   * @param user User to update
   */
  public userHasCam(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.hasCam = true;
      this.users$.next(users);
    }
  }

  /**
   * Use this method if the passed user has a microphone to update the state.
   * @param user 
   */
  public userHasMic(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.hasMic = true;
      this.users$.next(users);
    }
  }

  /**
   * Use this method when the passed user deactivates his microphone to update the state.
   * @param user 
   */
  public userAudioMuted(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.audioMuted = true;
      this.users$.next(users);
    }
  }

  /**
   * Use this method when the passed user activates his microphone to update the state.
   * @param user 
   */
  public userAudioUnmuted(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.audioMuted = false;
      this.users$.next(users);
    }
  }

  /**
   * Use this method when the passed user deactivates his camera to update the state.
   * @param user 
   */
  public userVideoMuted(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.videoMuted = true;
      this.users$.next(users);
    }
  }

  /**
   * Use this method when the passed user activates his camera to update the state.
   * @param user 
   */
  public userVideoUnmuted(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.videoMuted = false;
      this.users$.next(users);
    }
  }

  /**
   * Use this method when the passed user starts to share his screen to update the state.
   * @param user 
   */
  public userStartShareScreen(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.shareScreen = true;
      this.users$.next(users);
    }
  }

  /**
   * Use this method when the passed user stops sharing his screen to update the state.
   * @param user 
   */
  public userStopShareScreen(user: User): void {
    const users = this.getUsers();
    const currentUser = this.findUser(users, user);
    if (currentUser) {
      currentUser.shareScreen = false;
      this.users$.next(users);
    }
    this.users$.next(users);
  }

  /**
   * Give all users who are currently in the state.
   * @returns All users currently in state
   */
  public getUsers(): UserInCall[] {
    return this.users$.getValue();
  }

  /**
   * 
   * @param user User with `userIdentifier`
   * @returns User in state
   */
  public getUser(user: User): UserInCall | null {
    return this.getUsers().find(e => e.user[this.identifier] === user[this.identifier]) || null;
  }

  /**
   * Create a new `PeerConnectionClient` with the given settings
   * @param settings Settings for creating the `PeerConnectionClient`
   * @returns `PeerConnectionClient` object
   */
  public async createPeerClient(settings: PeerConnectionClientSettings): Promise<PeerConnectionClient> {
    return new PeerConnectionClient(settings);
  }

  /**
   * With this methode you can create a RTCCertificate to secure a connection. 
   * @link https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/generateCertificate
   * @param algorithm Certificate options used by `RTCPeerConnection.generateCertificate()` Default algorithm `ECDSA` with curve `P-256`
   * @returns Promise resolve to `RTCCertificate`
   */
  public async createCertifcate(algorithm: unknown = {
    name: 'ECDSA',
    namedCurve: 'P-256'
  }): Promise<RTCCertificate> {
    return RTCPeerConnection.generateCertificate(algorithm as AlgorithmIdentifier);
  }

  /**
   * set call state started to `true`, you can subscribe to `CallService.started$` for updates.
   */
  public start(): void {
    this.started$.next(true);
  }

  /**
   * set call state started to `false`, you can subscribe to `CallService.started$` for updates.
   */
  public stop(): void {
    this.started$.next(false);
  }

  /**
   * Configured user identifier.
   * @returns identifier to select a User
   */
  public getUserIdentifier(): (keyof User) {
    return this.identifier;
  }

  private findUser(users: UserInCall[], user: User): UserInCall | null {
    return users.find(e => e.user[this.identifier] === user[this.identifier]) || null;
  }

}
