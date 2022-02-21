import { ChangeDetectorRef, Directive, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { StreamType } from "../enums/stream-type";
import { CallService } from '../services/call.service';
import { StreamService } from '../services/stream.service';

/**
 * Toggle disabled/enable video track to mute/unmute local video.
 */
@Directive({
  selector: '[ngxWebrtcToggleVideoSelf]',
})
export class ToggleVideoSelfDirective implements OnDestroy {

  private callStartedSubscription$: Subscription | null = null;
  private localStreamStatusChangedSubscription$: Subscription | null = null;
  @HostBinding('class.disabled') public isDisabled = true;
  @HostBinding('class.enabled') public isEnabled = false;
  @HostListener('click', ['$event']) onClick(): void{
    this.toggleMute();
  }

  constructor(
    private streamService: StreamService,
    private callService: CallService,
    private cdr: ChangeDetectorRef
  ) {
    this.init();
  }

  ngOnDestroy(): void {
    this.callStartedSubscription$?.unsubscribe();
    this.localStreamStatusChangedSubscription$?.unsubscribe();
  }

  init(): void {
    this.callStartedSubscription$ = this.callService.started$.subscribe(this.onStart.bind(this));
  }

  onStart(isStarted: boolean): void {
    if (isStarted) {
      this.localStreamStatusChangedSubscription$ = this.streamService.localStreamStatusChanged.subscribe(
        this.onLocalStreamStatusChanged.bind(this));
    }
  }

  onLocalStreamStatusChanged(stream: MediaStream | MediaStreamTrack): void {
    if (stream){
      if (stream instanceof MediaStreamTrack && stream.kind === StreamType.Video) {
        this.updateStatusWithTrack(stream);
      }
      if (stream instanceof MediaStream && stream.getVideoTracks().length) {
        const track = this.streamService.getVideoTrackForStream(stream);
        if (track) {
          this.updateStatusWithTrack(track);
        }
      }
    }
  }

  toggleMute(): void {
    this.streamService.toggleMuteLocalVideoStream();
  }

  private updateStatusWithTrack(track: MediaStreamTrack): void {
    this.isEnabled = track.enabled;
    this.isDisabled = !track.enabled;
    this.cdr.detectChanges();
  }
}
