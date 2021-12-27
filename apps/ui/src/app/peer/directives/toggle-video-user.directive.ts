import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appToggleVideoUser]',
  host: {
    '[class.enabled]': 'isEnabled',
    '[class.disabled]': '!isEnabled',
  }
})
export class ToggleVideoUserDirective {

  public isEnabled = true;

  @Input() appToggleVideoUser;

  constructor() { }

  @HostListener('click', ['$event']) onClick($event){
    if (!this.appToggleVideoUser) {
      console.log('user not set');
      return;
    }
    console.log(this.appToggleVideoUser);
    if (this.appToggleVideoUser?.connection) {
      this.appToggleVideoUser.connection.requestMuteVideo();
      this.isEnabled = !this.isEnabled;
    }
  }

}
