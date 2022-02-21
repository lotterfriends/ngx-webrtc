import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { UserInCall } from "../interfaces/user-in-call";

/**
 * Send a toggle audio request to a specific peer connection.
 */
@Directive({
  selector: '[ngxWebrtcToggleAudioUser]',
})
export class ToggleAudioUserDirective {

  @Input() ngxWebrtcToggleAudioUser: UserInCall | null = null;
  @HostBinding('class.disabled') public isDisabled = true;
  @HostBinding('class.enabled') public isEnabled = false;
  @HostListener('click', ['$event']) onClick(): void{
    this.toggleUserAudio();
  }

  toggleUserAudio(): void {
    if (!this.ngxWebrtcToggleAudioUser) {
      console.warn('user not set');
      return;
    }
    if (this.ngxWebrtcToggleAudioUser?.connection) {
      this.ngxWebrtcToggleAudioUser.connection.requestMuteAudio();
      this.isEnabled = !this.isEnabled;
      this.isDisabled = !this.isDisabled;
    }
  }

}
