import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { User } from "../../../../../../libs/models/user";
import { SocketService } from 'src/app/services/socket.service';
import { CallService, UserInCall } from 'src/app/peer/services/call.service';

@UntilDestroy()
@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserlistComponent implements OnInit {

  public users;
  constructor(
    private socketService: SocketService,
    public callService: CallService,
    private cdr: ChangeDetectorRef
  ) {
  
  }

  ngOnInit(): void {
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
