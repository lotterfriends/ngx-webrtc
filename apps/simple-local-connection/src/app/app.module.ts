import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWebrtcModule } from 'ngx-webrtc';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgxWebrtcModule.forRoot({
      debug: true,
      userIdentifier: 'id'
    })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
