import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged } from 'rxjs/operators';
import { User } from "../../../../../../libs/models/user";
import { SocketService } from 'src/app/services/socket.service';

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
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.init();
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

}
