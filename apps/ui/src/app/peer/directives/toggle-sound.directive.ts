import { Directive, ElementRef, HostListener, ViewChild } from '@angular/core';
import { StreamService } from '../services/stream.service';

@Directive({
  selector: '[appToggleSound]',
  host: {
    '[class.enabled]': 'isEnabled',
    '[class.disabled]': '!isEnabled',
  }
})
export class ToggleSoundDirective {

  public isEnabled = true;

  constructor(
    private streamService: StreamService
  ) { }

  @HostListener('click', ['$event']) onClick($event){
    this.streamService.toggleMuteLocalAudioStream();
    this.isEnabled = !this.isEnabled;
  }

}
