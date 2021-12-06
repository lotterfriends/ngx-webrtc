import { Component, HostListener, ViewChild } from '@angular/core';
import { VideoChatComponent } from './components/video-chat/video-chat.component';
import { SocketService } from './services/socket.service';
import { UserStorageService } from './services/user-storage.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'video-chat-ui';
  public showJoin = true;
  public showChat= false;
  public roomName = this.genRoom();


  @ViewChild('videoChat')
  private videoChatComponent!: VideoChatComponent;

  @HostListener('window:popstate', ['$event']) popsate(event) {
    console.log(event);
    if (location.pathname && location.pathname.length > 6) {
      this.roomName = location.pathname.substring(1);
      this.join();
    } else {
      this.leave();
    }
  }

  constructor(
    private userStorageService: UserStorageService,
    private socketService: SocketService,
  ) {

    // ask for username if not set yet
    if (!this.userStorageService.getCurrentUser()) {
      this.userStorageService.setCurrentUsername(prompt('enter username') || 'Anon' + this.getRandom(6));
    }

    // get me when register/refresh is ready
    this.socketService.onMe().subscribe(me => {
      this.userStorageService.setCurrentUser(me);
      this.shouldJoin();
    });

    // on error start with a fresh register
    this.socketService.onRefreshError().subscribe(x => {
      this.socketService.register();
    });

    // start when connected
    this.socketService.isConnected.subscribe((connected: boolean) => {
      if (connected) {
        let user = this.userStorageService.getCurrentUser();
        if (user) {
          this.socketService.refresh(user);
        } else {
          this.socketService.register();
        }
      }
    });

  }

  private shouldJoin() {
    if (location.pathname && location.pathname.length > 6) {
      this.roomName = location.pathname.substring(1);
      this.join();
    }
  }

  private getRandom(size: number): string {
    return `${Math.round(Math.random() * parseInt(`1${(1e15 + 0 + '').slice(-size)}`, 10))}`;
  }

  private genRoom(): string {
    return this.getRandom(10);
  }

  public newRoom(): void {
    this.roomName = this.genRoom();
  }

  

  public join(): void {
    // update ui
    this.showChat = true;
    this.showJoin = false;

    // join room
    this.socketService.joinRoom(this.roomName);
    setTimeout(() => {
      this.videoChatComponent.startCall();
    });


    // update url
    history.pushState({room: this.roomName}, `room ${this.roomName}`, `${this.roomName}`);

  }

  public leave(): void {
    this.videoChatComponent.stopCall();
    this.socketService.leaveRoom();
    history.pushState({}, this.title, location.origin);
    this.showChat = false;
    this.showJoin = true;
    this.newRoom();
  }

}
