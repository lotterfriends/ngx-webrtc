import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { UserInCall } from '../services/call.service';

@Directive({
  selector: '[appToggleVideoUser]',
})
export class ToggleVideoUserDirective {

  @Input() appToggleVideoUser: UserInCall;
  @HostBinding('class.disabled') public isDisabled = true;
  @HostBinding('class.enabled') public isEnabled = false;
  @HostListener('click', ['$event']) onClick(): void{
    this.toggleUserVideo();
  }

  toggleUserVideo(): void {
    if (!this.appToggleVideoUser) {
      console.log('user not set');
      return;
    }
    if (this.appToggleVideoUser?.connection) {
      this.appToggleVideoUser.connection.requestMuteVideo();
      this.isEnabled = !this.isEnabled;
      this.isDisabled = !this.isDisabled;
    }
  }

}
