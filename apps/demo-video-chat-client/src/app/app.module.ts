import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWebrtcModule } from 'ngx-webrtc';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth-interceptor';
import { AvatarComponent } from './components/avatar/avatar.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { TextChatComponent } from './components/text-chat/text-chat.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { ControlsComponent } from './components/video-chat/controls/controls.component';
import { RemotePeerComponent } from './components/video-chat/remote-peer/remote-peer.component';
import { VideoChatSettingsDialogComponent } from './components/video-chat/video-chat-settings-dialog/video-chat-settings-dialog.component';
import { VideoChatComponent } from './components/video-chat/video-chat.component';


const config: SocketIoConfig = { url: 'http://localhost:3333', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    TextChatComponent,
    VideoChatComponent,
    RemotePeerComponent,
    UserlistComponent,
    ControlsComponent,
    DialogComponent,
    VideoChatSettingsDialogComponent,
    AvatarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    NgxWebrtcModule.forRoot({
      debug: true,
      userIdentifier: 'name'
    })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  exports: [
    AvatarComponent
  ]
})
export class AppModule { }
