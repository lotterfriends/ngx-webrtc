import { BehaviorSubject } from "rxjs";
import { PeerConnectionClient } from "./peer-connection-client";

export class Call {
  
  private servers: { urls: string | string[]; }[] = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
    { urls: 'stun:stun.services.mozilla.com' },
  ];

  public started$ = new BehaviorSubject<boolean>(false);

  constructor() {
  }
  
  
  public setServers(servers: { urls: string | string[]; }[]): void {
    this.servers = servers;
  }

  public async createPeerClient(): Promise<PeerConnectionClient> {
    
    const cert = await RTCPeerConnection.generateCertificate({
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256"
    } as AlgorithmIdentifier);

    const peerConnectionClient = new PeerConnectionClient({
      peerConnectionConfig: {
        iceServers: this.servers,
        certificates: [cert]
      },
      videoSendCodec: 'VP9'
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