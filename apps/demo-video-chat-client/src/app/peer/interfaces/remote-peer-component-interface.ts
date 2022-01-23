import { ElementRef } from '@angular/core';
import { User } from '@ngx-webrtc/demo-video-chat-models';
import { UserInCall } from '../services/call.service';

export interface RemotePeerComponentInterface {

  user: UserInCall | null;
  videoStreamNode: ElementRef;
  audioStreamNode: ElementRef;
  setUser(user: User): void;

}
