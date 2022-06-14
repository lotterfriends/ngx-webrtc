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

