import { ChangeDetectorRef, Directive, HostListener } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged } from 'rxjs/operators';
import { StreamType } from '../peer-connection-client';
import { CallService } from '../services/call.service';
import { StreamService } from '../services/stream.service';

@UntilDestroy()
@Directive({
  selector: '[appToggleVideoSelf]',
  host: {
    '[class.enabled]': 'isEnabled',
    '[class.disabled]': '!isEnabled',
  }
})
export class ToggleVideoSelfDirective {

  public isEnabled = true;
  constructor(
    private streamService: StreamService,
    private callService: CallService,
    private cdr: ChangeDetectorRef
  ) {
    this.callService.started$.pipe(untilDestroyed(this)).subscribe(isStarted => {
      if(isStarted) {
        this.streamService.localStreamStatusChanged.pipe(
          untilDestroyed(this),
        ).subscribe(stream => {
          if (stream){
            if (stream instanceof MediaStreamTrack && stream.kind === StreamType.Video) {
              this.updateStatusWithTrack(stream);
            }
            if (stream instanceof MediaStream && stream.getVideoTracks().length) {
              const track = stream.getVideoTracks()[0];
              this.updateStatusWithTrack(track);
            }
          }
          
        });
      }
    });
  }

  @HostListener('click', ['$event']) onClick($event){
    this.toggleMute();
  }

  toggleMute() {
    this.streamService.toggleMuteLocalVideoStream();
  }

  private updateStatusWithTrack(track: MediaStreamTrack): void {
    this.isEnabled = track.enabled;
    this.cdr.detectChanges();
  }
}
