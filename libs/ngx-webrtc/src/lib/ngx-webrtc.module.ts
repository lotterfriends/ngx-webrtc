import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ShareScreenDirective, ToggleAudioSelfDirective, ToggleAudioUserDirective, ToggleVideoSelfDirective, ToggleVideoUserDirective } from './directives';

@NgModule({
  declarations: [
    ToggleAudioSelfDirective,
    ToggleVideoSelfDirective,
    ToggleAudioUserDirective,
    ToggleVideoUserDirective,
    ShareScreenDirective,
  ],
  exports: [
    ToggleAudioSelfDirective,
    ToggleVideoSelfDirective,
    ToggleAudioUserDirective,
    ToggleVideoUserDirective,
    ShareScreenDirective,
  ],
  imports: [CommonModule],
  providers: []
})
export class NgxWebrtcModule {}
