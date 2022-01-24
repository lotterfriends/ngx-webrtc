import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { PeerConnectionClientSignalMessage } from 'ngx-webrtc';
import { UserStorageService } from './user-storage.service';
import { Message, MessageType, ServerMessage, ServerUser, User } from '@ngx-webrtc/demo-video-chat-models';


@Injectable({
  providedIn: 'root',
})
export class SocketService {

  debug = false;

  constructor(
    private socket: Socket,
    private userStorageService: UserStorageService
  ) {
    this.socket.on('connect', () => {
      setTimeout(() => {
        this.log('socket connected', this.socket);
        this.isConnected.next(true);
      }, 500);
    });

    this.socket.on('disconnect', () => {
      this.log('socket disconnected', this.socket);
      this.isConnected.next(false);
    });
  }

  public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  log(...args: any[]): void {
    if (this.debug) {
      console.log(...args);
    }
  }

  joinRoom(room: string): void {
    this.socket.emit('join', { room });
  }

  joinedRoom(): void {
    this.socket.emit('joined');
  }

  leaveRoom(): void {
    this.socket.emit('leave');
  }


  sendMessage(message: string): void {
    this.socket.emit('message', {
      message,
      type: MessageType.Text
    } as Message);
  }

  sendSignalMessage(message: PeerConnectionClientSignalMessage, username: string): void {
    this.sendPrivateMessage(JSON.stringify(message), username, MessageType.Signal);
  }

  sendPrivateMessage(message: string, username: string, type?: MessageType): void {
    this.socket.emit('message', {
      type: type ? type : MessageType.Text,
      for: username,
      message
    });
  }

  getMessages(): Observable<ServerMessage> {
    return new Observable((observer) => {
      this.socket.on('message', (data: ServerMessage) => {
        observer.next(data);
      });
    });
  }

  getPrivateMessages(): Observable<ServerMessage> {
    return new Observable((observer) => {
      this.socket.on('private-message', (data: ServerMessage) => {
        observer.next(data);
      });
    });
  }

  register(): void {
    const username = this.userStorageService.getCurrentUsername();
    if (username) {
      this.socket.emit('register', username);
    }
  }

  refresh(user: ServerUser): void {
    this.socket.emit('refresh', user);
  }

  getUsers(): Observable<string[]> {
    return new Observable<string[]>((observer) => {
      this.socket.on('users', (data: string[]) => {
        observer.next(data);
      });
    });
  }

  onRegisterError(): Observable<{code?: string, message?: string}> {
    return new Observable<{code?: string, message?: string}>((observer) => {
      this.socket.on('register-error', (error: {code?: string, message?: string}) => {
        observer.next(error);
      });
    });
  }

  getUsersInRoom(): void {
    this.socket.emit('request-userlist');
  }

  onUserlistChanged(): Observable<User[]> {
    return new Observable<User[]>((observer) => {
      this.socket.on('userlist', (data: User[]) => {
        observer.next(data);
      });
    });
  }

  onUsersJoinedRoom(): Observable<User[]> {
    return new Observable<User[]>((observer) => {
      this.socket.on('userJoinedRoom', (data: User[]) => {
        observer.next(data);
      });
    });
  }

  onUserLeftRoom(): Observable<User> {
    return new Observable<User>((observer) => {
      this.socket.on('userLeftRoom', (data: User) => {
        observer.next(data);
      });
    });
  }

  onMe(): Observable<ServerUser> {
    return new Observable<ServerUser>((observer) => {
      this.socket.on('me', (data: ServerUser) => {
        observer.next(data);
      });
    });
  }

  onLogout(): Observable<string> {
    return new Observable<string>((observer) => {
      this.socket.on('logout', (username: string) => {
        observer.next(username);
      });
    });
  }

  // disconnect() {
  //   this.socket.disconnect();
  // }


}
