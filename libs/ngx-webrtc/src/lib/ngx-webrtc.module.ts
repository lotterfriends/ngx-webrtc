import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { ShareScreenDirective, ToggleAudioSelfDirective, ToggleAudioUserDirective, ToggleVideoSelfDirective, ToggleVideoUserDirective } from './directives';
import { NgxWebrtConfiguration } from './ngx-webrtc-configuration';

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
export class NgxWebrtcModule {
  static forRoot(
    libConfiguration: NgxWebrtConfiguration
  ): ModuleWithProviders<NgxWebrtcModule> {
    return {
      ngModule: NgxWebrtcModule,
      providers: [
        {
          provide: NgxWebrtConfiguration,
          useValue: libConfiguration,
        },
      ],
    };
  }
}
