import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { BehaviorSubject, Observable } from "rxjs";
import { PeerConnectionClientSignalMessage } from "../peer/peer-connection-client";
import { UserStorageService } from "./user-storage.service";
import { Message } from "../../../../../libs/models/message";
import { MessageType } from "../../../../../libs/models/message-type";
import { ServerMessage } from "../../../../../libs/models/server-message";
import { ServerUser } from "../../../../../libs/models/server-user";
import { User } from "../../../../../libs/models/user";


@Injectable({
  providedIn: "root",
})
export class SocketService {
  constructor(
    private socket: Socket,
    private userStorageService: UserStorageService
  ) {
    this.socket.on('connect', () => {
      setTimeout(() => {
        console.log('socket connected', this.socket);
        this.isConnected.next(true);
      }, 500);
    });

    this.socket.on('disconnect', () => {
      console.log('socket disconnected', this.socket);
      this.isConnected.next(false);
    });
  }

  public isConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  joinRoom(room: string) {
    this.socket.emit('join', { room });
  }

  joinedRoom() {
    this.socket.emit('joined');
  }

  leaveRoom() {
    this.socket.emit('leave');
  }


  sendMessage(message: string): void {
    this.socket.emit("message", {
      message,
      type: MessageType.Text
    } as Message);
  }

  sendSignalMessage(message: PeerConnectionClientSignalMessage, username: string) {
    this.sendPrivateMessage(JSON.stringify(message), username, MessageType.Signal);
  }
  
  sendPrivateMessage(message: string, username: string, type?: MessageType) {
    this.socket.emit('message', {
      type: type ? type : MessageType.Text,
      for: username,
      message: message
    });
  }

  getMessages(): Observable<ServerMessage> {
    return new Observable((observer) => {
      this.socket.on("message", (data: ServerMessage) => {
        observer.next(data);
      });
    });
  }

  getPrivateMessages(): Observable<ServerMessage> {
    return new Observable((observer) => {
      this.socket.on("private-message", (data: ServerMessage) => {
        observer.next(data);
      });
    });
  }

  register() {
    const username = this.userStorageService.getCurrentUsername();
    if (username) {
      this.socket.emit("register", username);
    }
  }

  refresh(user: ServerUser) {
    this.socket.emit("refresh", user);
  }

  getUsers() {
    return new Observable<string[]>((observer) => {
      this.socket.on("users", (data: string[]) => {
        observer.next(data);
      });
    });
  }
  
  onRefreshError() {
    return new Observable<string[]>((observer) => {
      this.socket.on("refresh-error", (data: string[]) => {
        observer.next(data);
      });
    });
  }

  getUsersInRoom() {
    return new Observable<User[]>((observer) => {
      this.socket.on("userlist", (data: User[]) => {
        observer.next(data);
      });
    });
  }

  onUserLeftRoom() {
    return new Observable<User>((observer) => {
      this.socket.on("userLeftRoom", (data: User) => {
        observer.next(data);
      });
    });
  }

  onMe() {
    return new Observable<ServerUser>((observer) => {
      this.socket.on("me", (data: ServerUser) => {
        observer.next(data);
      });
    });
  }

  onLogout() {
    return new Observable<string>((observer) => {
      this.socket.on("logout", (username: string) => {
        observer.next(username);
      });
    });
  }

  // disconnect() {
  //   this.socket.disconnect();
  // }


}
