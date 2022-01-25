import { PeerConnectionClientSignalMessageType } from "../enums/peer-connection-client-signal-message-type";


export interface PeerConnectionClientSignalMessage {
  type: RTCSdpType | PeerConnectionClientSignalMessageType;
  sdp?: string;
  label?: number | RTCIceCandidate['sdpMLineIndex'];
  id?: string | RTCIceCandidate['sdpMid'];
  candidate?: string | RTCIceCandidate['candidate'];
}
