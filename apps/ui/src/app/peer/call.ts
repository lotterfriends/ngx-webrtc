import { BehaviorSubject } from "rxjs";
import { PeerConnectionClient } from "./peer-connection-client";

export class Call {


  public started$ = new BehaviorSubject<boolean>(false);

  constructor() {
  }
  
  
  public createPeerClient(): PeerConnectionClient {
    
    const peerConnectionClient = new PeerConnectionClient({
      peerConnectionConfig: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
          { urls: 'stun:stun.services.mozilla.com' },
        ]
      }
    });
    
    
    return peerConnectionClient;
  }

  public start(): void {
    this.started$.next(true);
  }

  public stop(): void {
    this.started$.next(false);
  }


}