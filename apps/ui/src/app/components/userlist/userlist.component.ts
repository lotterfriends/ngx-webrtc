import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StreamType } from 'src/app/peer/peer-connection-client';
import { CallService, UserInCall } from 'src/app/peer/services/call.service';
import { StreamService } from 'src/app/peer/services/stream.service';
import { UserStorageService } from 'src/app/services/user-storage.service';
import { ServerUser } from '../../../../../../libs/models';
import { User } from "../../../../../../libs/models/user";

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
    public callService: CallService,
    private cdr: ChangeDetectorRef,
    private userService: UserStorageService,
    private streamService: StreamService,
  ) {
  
  }

  ngOnInit(): void {
    this.init();
  }

  private init(): void {
    this.self = this.userService.getCurrentUser();
    this.callService.started$.pipe(untilDestroyed(this)).subscribe(this.onChatStarted.bind(this));
  }
  
  onChatStarted(isStarted: boolean): void {
    if(isStarted) {
      this.streamService.localStreamStatusChanged.pipe(
        untilDestroyed(this),
      ).subscribe(this.onLocalStreamStatusChanged.bind(this));
    }
  }

  onLocalStreamStatusChanged(stream: MediaStream | MediaStreamTrack): void {
    if (stream){
      if (stream instanceof MediaStreamTrack && stream.kind === StreamType.Audio) {
        this.selfAudioMuted = !stream.enabled;
      }
      if (stream instanceof MediaStream && stream.getAudioTracks().length) {
        const track = this.streamService.getAudioTrackForStream(stream);
        this.selfAudioMuted = !track.enabled;
      }
      if (stream instanceof MediaStreamTrack && stream.kind === StreamType.Video) {
        this.selfVideoMuted = !stream.enabled;
      }
      if (stream instanceof MediaStream && stream.getVideoTracks().length) {
        const track = this.streamService.getVideoTrackForStream(stream);
        this.selfVideoMuted = !track.enabled;
      }
      this.cdr.detectChanges();
    }
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
