import { Directive, HostBinding, HostListener, Input } from '@angular/core';
import { UserInCall } from '../services/call.service';

@Directive({
  selector: '[appToggleAudioUser]',
})
export class ToggleAudioUserDirective {

  @Input() appToggleAudioUser: UserInCall;
  @HostBinding('class.disabled') public isDisabled = true;
  @HostBinding('class.enabled') public isEnabled = false;
  @HostListener('click', ['$event']) onClick(): void{
    this.toggleUserAudio();
  }

  toggleUserAudio(): void {
    if (!this.appToggleAudioUser) {
      console.warn('user not set');
      return;
    }
    if (this.appToggleAudioUser?.connection) {
      this.appToggleAudioUser.connection.requestMuteAudio();
      this.isEnabled = !this.isEnabled;
      this.isDisabled = !this.isDisabled;
    }
  }

}
