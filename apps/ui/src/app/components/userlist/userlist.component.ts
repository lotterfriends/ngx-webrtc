import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { User } from "../../../../../../libs/models/user";
import { SocketService } from 'src/app/services/socket.service';
import { CallService, UserInCall } from 'src/app/peer/services/call.service';
import { UserStorageService } from 'src/app/services/user-storage.service';
import { ServerUser } from '../../../../../../libs/models';
import { StreamService } from 'src/app/peer/services/stream.service';
import { StreamType } from 'src/app/peer/peer-connection-client';

@UntilDestroy()
@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserlistComponent implements OnInit {

  public users;
  public selfAudioMuted = false;
  public selfVideoMuted = false;
  public self: ServerUser;

  constructor(
    private socketService: SocketService,
    public callService: CallService,
    private cdr: ChangeDetectorRef,
    private userService: UserStorageService,
    private streamService: StreamService,
  ) {
  
  }

  ngOnInit(): void {
    this.self = this.userService.getCurrentUser();

    this.callService.started$.pipe(untilDestroyed(this)).subscribe(isStarted => {
      if(isStarted) {
        this.streamService.localStreamStatusChanged.pipe(
          untilDestroyed(this),
        ).subscribe(stream => {
          if (stream){
            if (stream instanceof MediaStreamTrack && stream.kind === StreamType.Audio) {
              this.selfAudioMuted = !stream.enabled;
            }
            if (stream instanceof MediaStream && stream.getAudioTracks().length) {
              const track = stream.getAudioTracks()[0];
              this.selfAudioMuted = !track.enabled;
            }
            if (stream instanceof MediaStreamTrack && stream.kind === StreamType.Video) {
              this.selfVideoMuted = !stream.enabled;
            }
            if (stream instanceof MediaStream && stream.getVideoTracks().length) {
              const track = stream.getVideoTracks()[0];
              this.selfVideoMuted = !track.enabled;
            }
            this.cdr.detectChanges();
          }
          
        });
      }
    });
  }
  

  init() {
    this.socketService.getUsersInRoom();
    this.socketService.onUserlistChanged().pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe(this.onUserJoined.bind(this));
  }

  onUserJoined(users: User) {
    this.users = users;
    this.cdr.detectChanges();
  }

  changeVolume($event, user: UserInCall) {
    user.volume=$event.target.value;
    (user.node.instance.audioStreamNode.nativeElement as HTMLAudioElement).volume = $event.target.value;
  }

  unmute(user: UserInCall) {
    user.volume = 1;
    (user.node.instance.audioStreamNode.nativeElement as HTMLAudioElement).volume = 1;
  }
  
  mute(user: UserInCall) {
    user.volume = 0;
    (user.node.instance.audioStreamNode.nativeElement as HTMLAudioElement).volume = 0;
  }

}
