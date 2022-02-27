import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { ServerUser } from '@ngx-webrtc/demo-video-chat-models';
import { UserStorageService } from '../../services/user-storage.service';

@UntilDestroy()
@Component({
  selector: 'ngx-webrtc-userlist-container',
  templateUrl: './userlist-container.component.html',
  styleUrls: ['./userlist-container.component.css'],
})
export class UserlistContainerComponent implements OnInit {

  public self: ServerUser | null = null;

  constructor(
    private userService: UserStorageService,
  ) {}

  ngOnInit(): void {
    this.self = this.userService.getCurrentUser();
  }


}
