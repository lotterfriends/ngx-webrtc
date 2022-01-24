import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { UserInCall } from '../services/call.service';

@Directive({
  selector: '[ngxWebRTCToggleVideoUser]',
})
export class ToggleVideoUserDirective {

  @Input() ngxWebRTCToggleVideoUser: UserInCall | null = null;
  @HostBinding('class.disabled') public isDisabled = true;
  @HostBinding('class.enabled') public isEnabled = false;
  @HostListener('click', ['$event']) onClick(): void{
    this.toggleUserVideo();
  }

  toggleUserVideo(): void {
    if (!this.ngxWebRTCToggleVideoUser) {
      console.log('user not set');
      return;
    }
    if (this.ngxWebRTCToggleVideoUser?.connection) {
      this.ngxWebRTCToggleVideoUser.connection.requestMuteVideo();
      this.isEnabled = !this.isEnabled;
      this.isDisabled = !this.isDisabled;
    }
  }

}
