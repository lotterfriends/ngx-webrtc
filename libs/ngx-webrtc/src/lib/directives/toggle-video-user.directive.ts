import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { UserInCall } from "../interfaces/user-in-call";

/**
 * Send a toggle video request to a specific peer connection.
 */
@Directive({
  selector: '[ngxWebrtcToggleVideoUser]',
})
export class ToggleVideoUserDirective {

  @Input() ngxWebrtcToggleVideoUser: UserInCall | null = null;
  @HostBinding('class.disabled') public isDisabled = true;
  @HostBinding('class.enabled') public isEnabled = false;
  @HostListener('click', ['$event']) onClick(): void{
    this.toggleUserVideo();
  }

  toggleUserVideo(): void {
    if (!this.ngxWebrtcToggleVideoUser) {
      console.log('user not set');
      return;
    }
    if (this.ngxWebrtcToggleVideoUser?.connection) {
      this.ngxWebrtcToggleVideoUser.connection.requestMuteVideo();
      this.isEnabled = !this.isEnabled;
      this.isDisabled = !this.isDisabled;
    }
  }

}
