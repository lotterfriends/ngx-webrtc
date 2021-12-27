import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appToggleSoundUser]',
  host: {
    '[class.enabled]': 'isEnabled',
    '[class.disabled]': '!isEnabled',
  }
})
export class ToggleSoundUserDirective {

  public isEnabled = true;

  @Input() appToggleSoundUser;

  constructor() { }

  @HostListener('click', ['$event']) onClick($event){
    if (!this.appToggleSoundUser) {
      console.log('user not set');
      return;
    }
    if (this.appToggleSoundUser?.connection) {
      this.appToggleSoundUser.connection.requestMuteSound();
      this.isEnabled = !this.isEnabled;
    }
  }

}
