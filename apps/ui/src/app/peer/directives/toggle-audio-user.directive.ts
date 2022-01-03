import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appToggleAudioUser]',
  host: {
    '[class.enabled]': 'isEnabled',
    '[class.disabled]': '!isEnabled',
  }
})
export class ToggleAudioUserDirective {

  public isEnabled = true;

  @Input() appToggleAudioUser;

  constructor() { }

  @HostListener('click', ['$event']) onClick($event){
    if (!this.appToggleAudioUser) {
      console.log('user not set');
      return;
    }
    if (this.appToggleAudioUser?.connection) {
      this.appToggleAudioUser.connection.requestMuteAudio();
      this.isEnabled = !this.isEnabled;
    }
  }

}
