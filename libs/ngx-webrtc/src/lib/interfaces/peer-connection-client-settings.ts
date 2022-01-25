import { IceServer } from './ice-server';
import { SdpSettings } from './sdp-settings';


export interface PeerConnectionClientSettings extends SdpSettings {
  debug?: boolean;
  peerConnectionConfig: {
    iceTransports?: 'relay' | string;
    iceServers: IceServer[];
    certificates?: RTCCertificate[];
  };
}
