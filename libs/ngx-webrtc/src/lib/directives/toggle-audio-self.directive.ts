import { ChangeDetectorRef, Directive, HostBinding, HostListener } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StreamType } from "../enums/stream-type";
import { CallService } from '../services/call.service';
import { StreamService } from '../services/stream.service';

@UntilDestroy()
@Directive({
  selector: '[ngxWebrtcToggleAudioSelf]',
})
export class ToggleAudioSelfDirective {

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

  init(): void {
    this.callService.started$.pipe(
      untilDestroyed(this)
    ).subscribe(this.onStart.bind(this));
  }

  onStart(isStarted: boolean): void {
    if (isStarted) {
      this.streamService.localStreamStatusChanged.pipe(
        untilDestroyed(this),
      ).subscribe(this.onLocalStreamStatusChanged.bind(this));
    }
  }

  onLocalStreamStatusChanged(stream: MediaStream | MediaStreamTrack): void {
    if (stream){
      if (stream instanceof MediaStreamTrack && stream.kind === StreamType.Audio) {
        this.updateStatusWithTrack(stream);
      }
      if (stream instanceof MediaStream && stream.getAudioTracks().length) {
        const track = this.streamService.getAudioTrackForStream(stream);
        if (track) {
          this.updateStatusWithTrack(track);
        }
      }
    }
  }

  toggleMute(): void {
    this.streamService.toggleMuteLocalAudioStream();
  }

  private updateStatusWithTrack(track: MediaStreamTrack): void {
    this.isEnabled = track.enabled;
    this.isDisabled = !track.enabled;
    this.cdr.detectChanges();
  }

}
