import { ElementRef } from '@angular/core';
import { User } from './user';
import { UserInCall } from '../services/call.service';

export interface RemotePeerComponentInterface {

  user: UserInCall | null;
  videoStreamNode?: ElementRef;
  audioStreamNode?: ElementRef;
  setUser(user: User): void;

}
