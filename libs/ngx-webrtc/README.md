# ngx-webrtc

 > :fire: **Important**   
 > This package is currently under development and the api is unstable.


Full featured example client with group video chats, screen sharing and more: https://github.com/lotterfriends/ngx-webrtc/tree/main/apps/demo-video-chat-client

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

# Procedure

You need a link layer so that remote devices can communicate with each other. The communication takes place via events such as See Candidates, Send Connection Data, etc. The communication can be done e.g. via WebSockets, SSE, Polling, or similar. If you want to connect more than two candidates you have to make sure that the events for one candidate only arrive at this candidate, you can realize this with server and client side filters or private channels.

It must be ensured that old, already processed messages are not processed a 2nd time. 

The library provides a CallService in which the status of the connected users is noted. The status contains, for example, whether a user has a camera and this is currently active. To determine a user, a user identifier is passed to the library. 


# Api 
### Enumerations

- [DeviceType](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/enums/DeviceType.md)
- [PeerConnectionClientSignalMessageType](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/enums/PeerConnectionClientSignalMessageType.md)
- [StreamType](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/enums/StreamType.md)

### Classes

- [CallService](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/CallService.md)
- [DeviceService](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/DeviceService.md)
- [NgxWebrtConfiguration](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/NgxWebrtConfiguration.md)
- [NgxWebrtcModule](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/NgxWebrtcModule.md)
- [PeerConnectionClient](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md)
- [SdpUtils](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md)
- [ShareScreenDirective](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ShareScreenDirective.md)
- [StreamService](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md)
- [ToggleAudioSelfDirective](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md)
- [ToggleAudioUserDirective](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioUserDirective.md)
- [ToggleVideoSelfDirective](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md)
- [ToggleVideoUserDirective](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoUserDirective.md)
- [UtilityService](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/UtilityService.md)

### Interfaces

- [DevicesGroup](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/DevicesGroup.md)
- [FormatObject](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/FormatObject.md)
- [FormatParams](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/FormatParams.md)
- [IceServer](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/IceServer.md)
- [PeerConnectionClientSettings](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSettings.md)
- [PeerConnectionClientSignalMessage](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSignalMessage.md)
- [RemotePeerComponentInterface](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/RemotePeerComponentInterface.md)
- [SdpSettings](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md)
- [StreamTrack](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/StreamTrack.md)
- [User](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/User.md)
- [UserInCall](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/UserInCall.md)
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
- [Perfect negotiation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation)
- ...


## Running unit tests

Run `nx test ngx-webrtc` to execute the unit tests.
