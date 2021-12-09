import { Directive, HostListener } from '@angular/core';
import { StreamService } from '../services/stream.service';

@Directive({
  selector: '[appToggleVideo]',
  host: {
    '[class.enabled]': 'isEnabled',
    '[class.disabled]': '!isEnabled',
  }
})
export class ToggleVideoDirective {

  public isEnabled = true;
  constructor(
    private streamService: StreamService
  ) { }

  @HostListener('click', ['$event']) onClick($event){
    this.streamService.toggleMuteLocalVideoStream();
    this.isEnabled = !this.isEnabled;
  }

}
