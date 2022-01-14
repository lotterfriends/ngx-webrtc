import { ChangeDetectorRef, Directive, HostListener } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fromEvent, merge } from 'rxjs';
import { take } from 'rxjs/operators';
import { CallService } from '../services/call.service';
import { StreamService } from '../services/stream.service';

@UntilDestroy()
@Directive({
  selector: '[appShareScreen]',
  host: {
    '[class.enabled]': 'isEnabled',
    '[class.disabled]': '!isEnabled',
  }
})
export class ShareScreenDirective {

  private desktopStream: MediaStream;
  private isEnabled = false;
  constructor(
    private streamService: StreamService,
    private callService: CallService,
    private cdr: ChangeDetectorRef
  ) { }


  @HostListener('click', ['$event']) async onClick($event){
    if (!this.isEnabled) {
      await this.startShareScreen();
    } else {
      this.stopShareScreen();
    }
  }

  private async startShareScreen() {
    this.desktopStream = await this.streamService.getScreenCapture();
    
    if (this.desktopStream) {
      this.streamService.localShareScreenStream$.next(this.desktopStream);
      this.streamService.replaceTrack(this.streamService.getVideoTrackForStream(this.desktopStream));
      const streamInactive$ = fromEvent(this.desktopStream, 'inactive').pipe(take(1));
      const sharingStopped$ = fromEvent(this.desktopStream.getVideoTracks()[0], 'ended').pipe(take(1));
  
      merge(streamInactive$, sharingStopped$)
        .pipe(
          untilDestroyed(this),
          take(1)
        )
        .subscribe(() => {
          if (this.isEnabled) {
            this.stopShareScreen();
          }
        });

      this.isEnabled = !this.isEnabled;
      this.callService.startShareScreen.emit();
      this.cdr.detectChanges();
    }
  }

  private stopShareScreen() {
    this.streamService.localShareScreenStream$.next(null);
    this.streamService.replaceTrack(this.streamService.getVideoTrackForStream(this.streamService.getLocalStream()));
    if (this.desktopStream) {
      this.desktopStream.getTracks().forEach(track => {
        track.stop();
      });
    }
    this.callService.stopShareScreen.emit();
    this.isEnabled = !this.isEnabled;
    this.cdr.detectChanges();
  }

}
