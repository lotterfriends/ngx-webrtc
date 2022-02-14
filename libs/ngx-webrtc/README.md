# ngx-webrtc

 > :fire: **Important**   
 > This package is currently under development and the api is unstable.


example client integration: https://github.com/lotterfriends/ngx-webrtc/tree/main/apps/demo-video-chat-client

## Installation


To install this library, run:

```bash
$ npm install ngx-webrtc --save
```

Add library to your Angular `AppModule`:


```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { NgxWebrtcModule } from 'ngx-webrtc';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
     NgxWebrtcModule.forRoot({
       userIdentifier: 'id'
     })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Simple Example

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


### Directives
the directive add there attached node the class enabled/disabled dependent on there state.
This directives are available:
- **ngxWebrtcShareScreen** - trigger get capture screen permissions and send screen to CallService. You can listen to the change and call replaceTrack of peer connection to send the screen capture to that connection
- **ngxWebrtcToggleAudioSelf** - toggle disabled/enable audio track to mute/unmute local audio 
- **ngxWebrtcToggleAudioUser** - send a toggle audio request to a specific peer connection 
- **ngxWebrtcToggleVideoSelf**  -toggle disabled/enable video track to mute/unmute local video
- **ngxWebrtcToggleVideoUser** - send a toggle video request to a specific peer connection 


Usage in templates 
```html
<button ngxWebrtcToggleAudioSelf class="toggle-audio">
  <span class="on-enabled">Mute Audio</span>
  <span class="on-disabled">Unmute Audio</span>
</button>

<button ngxWebrtcToggleVideoSelf class="toggle-video">
  <span class="on-enabled">Mute Video</span>
  <span class="on-disabled">Unmute Video</span>
</button>
<button ngxWebrtcShareScreen>
  <span class="on-enabled">Stop Share Screen</span>
  <span class="on-disabled">Share Screen</span>
</button>

<ul>
  <li *ngFor="let user of callService.users$ | async">
    <span *ngIf="user.hasMic || user.hasCam">
      <button *ngIf="user.hasMic" [ngxWebrtcToggleAudioUser]="user">mute for all</button>
      <button *ngIf="user.hasCam" [ngxWebrtcToggleVideoUser]="user">disable video for all</button>
    </span>
  </li>
</ul>
```


# Api 
tbd

# TODO
- blur / replace background
- talking detection 
- example [muliparty server](https://hpbn.co/webrtc/#multiparty-architectures)
- customize camera quality
- error handling
  - camera blocked
  - chrome on IOS
  - no audio device
  - ...
- different conference views
  - presenting 
  - talking


## Resources and Sources
- [High Performance Browser Networking](https://hpbn.co/webrtc)
- [apprtc](https://github.com/webrtc/apprtc)
- [jitsi-meet](https://github.com/jitsi/jitsi-meet)
- [WebRTC samples](https://webrtc.github.io/samples/)
- [Blog1](https://bloggeek.me/how-many-users-webrtc-call/)
- [Blog2](https://bloggeek.me/media-server-for-webrtc-broadcast/)
- [Media Server](https://ourcodeworld.com/articles/read/1212/top-5-best-open-source-webrtc-media-server-projects)
- ...


## Running unit tests

Run `nx test ngx-webrtc` to execute the unit tests.
