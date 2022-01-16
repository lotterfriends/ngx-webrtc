import { ElementRef } from '@angular/core';
import { User } from '../../../../../../libs/models';
import { UserInCall } from '../services/call.service';

export interface RemotePeerComponentInterface {

  user: UserInCall;
  videoStreamNode: ElementRef;
  audioStreamNode: ElementRef;
  setUser(user: User): void;

}
