import { ElementRef } from '@angular/core';
import { User } from './user';
import { UserInCall } from "./user-in-call";

export interface RemotePeerComponentInterface {

  user: UserInCall | null;
  videoStreamNode?: ElementRef;
  audioStreamNode?: ElementRef;
  setUser(user: User): void;

}
