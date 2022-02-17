import { ComponentRef } from '@angular/core';
import { User } from './user';
import { RemotePeerComponentInterface } from './remote-peer-component-interface';
import { PeerConnectionClient } from '../peer-connection-client';

// TODO abtract user interface

export interface UserInCall {
  user: User;
  hasCam: boolean;
  hasMic: boolean;
  volume: number;
  audioMuted: boolean;
  videoMuted: boolean;
  shareScreen: boolean;
  connection: PeerConnectionClient;
  node?: ComponentRef<RemotePeerComponentInterface>;
}
