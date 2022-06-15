### Simple Example

> :bulb: Note: 
> Normally you communicate over a connection layer to establish a peer connection between two devices. This is a simple example of when two connection objects can communicate directly with each other.

```html
<button (click)="initConnection()">start</button>

<video id="videoStreamNodePeer1" playsinline #videoStreamNodePeer1></video>
<video id="videoStreamNodePeer2" playsinline #videoStreamNodePeer2></video>
```

```typescript
import { Component, ElementRef, ViewChild } from '@angular/core';
import { CallService, PeerConnectionClientSettings, StreamService } from 'ngx-webrtc';

@Component({
  selector: 'ngx-webrtc-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {

  @ViewChild('videoStreamNodePeer1', { static: false }) videoStreamNodePeer1!: ElementRef;
  @ViewChild('videoStreamNodePeer2', { static: false }) videoStreamNodePeer2!: ElementRef;

  constructor(
    private callService: CallService,
    private streamService: StreamService
  ) {}

  async initConnection() {

    const stream = await this.streamService.tryGetUserMedia();
    const settings: PeerConnectionClientSettings = {
      peerConnectionConfig: {
        iceServers: this.callService.defaultServers,
      }
    };
    const pclient1 = await this.callService.createPeerClient(settings);
    const pclient2 = await this.callService.createPeerClient(settings);

    pclient1.addStream(stream);
    pclient2.addStream(stream);

    pclient1.signalingMessage.subscribe(m => {
      pclient2.receiveSignalingMessage(m);
    });

    pclient2.signalingMessage.subscribe(m => {
      pclient1.receiveSignalingMessage(m);
    });

    pclient1.remoteStreamAdded.subscribe(stream => {
      this.streamService.setStreamInNode(this.videoStreamNodePeer1.nativeElement, stream.track);
    });
    
    pclient2.remoteStreamAdded.subscribe(stream => {
      this.streamService.setStreamInNode(this.videoStreamNodePeer2.nativeElement, stream.track);
    });

    pclient2.startAsCallee();
    pclient1.startAsCaller();

  }
}

```

