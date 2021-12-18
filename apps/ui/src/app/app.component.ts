import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { VideoChatComponent } from './components/video-chat/video-chat.component';
import { ChannelHistoryService } from './services/channel-history.service';
import { ServerService } from './services/server.service';
import { SocketService } from './services/socket.service';
import { UiService } from './services/ui.service';
import { UserStorageService } from './services/user-storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public showJoin = true;
  public showChat= false;
  public roomName = this.genRoom();
  public uiShowUserlist = UiService.DEFAULTS.USERLIST_VISIBLE;
  public uiShowChat = UiService.DEFAULTS.CHAT_VISIBLE;
  private servers: {urls: string | string[]}[];

  @ViewChild('videoChat') private videoChatComponent!: VideoChatComponent;
  @ViewChild('room', { static: false }) room: ElementRef;

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
    private serverService: ServerService,
    private uiService: UiService,
    public channelHistoryService: ChannelHistoryService
  ) {

    this.uiService.isUserlistVisible$.subscribe(isVisible => {
      this.uiShowUserlist = isVisible;
    });
    this.uiService.isChatVisible$.subscribe(isVisible => {
      this.uiShowChat = isVisible;
    });

    // ask for username if not set yet
    if (!this.userStorageService.getCurrentUser()) {
      this.userStorageService.setCurrentUsername(prompt('enter username') || 'Anon' + this.getRandom(6));
    }

    // get me when register/refresh is ready
    this.socketService.onMe().subscribe(async (me) => {
      this.userStorageService.setCurrentUser(me);
      this.servers = await this.serverService.getServers().toPromise();
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

  public join(roomName?: string): void {
    const room = roomName ? roomName : this.roomName;
    this.channelHistoryService.addChannelToHistory(room);
    // update ui
    this.showChat = true;
    this.showJoin = false;

    // join room
    this.socketService.joinRoom(room);
    setTimeout(() => {
      this.videoChatComponent.startCall(this.servers);
    });


    // update url
    history.pushState({room: room}, `room ${room}`, `${room}`);

  }

  public leave(): void {
    this.videoChatComponent.stopCall();
    this.socketService.leaveRoom();
    history.pushState({}, null, location.origin);
    this.showChat = false;
    this.showJoin = true;
    this.newRoom();
  }

  toggleFullscreen() {
    if (this.room.nativeElement) {
      if (window.innerHeight !== screen.height) {
        this.room.nativeElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  }

}
