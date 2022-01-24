import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { UserInCall } from '../services/call.service';

@Directive({
  selector: '[ngxWebRTCToggleAudioUser]',
})
export class ToggleAudioUserDirective {

  @Input() ngxWebRTCToggleAudioUser: UserInCall | null = null;
  @HostBinding('class.disabled') public isDisabled = true;
  @HostBinding('class.enabled') public isEnabled = false;
  @HostListener('click', ['$event']) onClick(): void{
    this.toggleUserAudio();
  }

  toggleUserAudio(): void {
    if (!this.ngxWebRTCToggleAudioUser) {
      console.warn('user not set');
      return;
    }
    if (this.ngxWebRTCToggleAudioUser?.connection) {
      this.ngxWebRTCToggleAudioUser.connection.requestMuteAudio();
      this.isEnabled = !this.isEnabled;
      this.isDisabled = !this.isDisabled;
    }
  }

}
