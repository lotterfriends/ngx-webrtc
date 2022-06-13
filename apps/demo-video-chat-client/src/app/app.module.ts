import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgxWebrtcModule } from 'ngx-webrtc';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth-interceptor';
import { TextChatContainerComponent } from './components/text-chat-container/text-chat-container.component';
import { UserlistContainerComponent } from './components/userlist-container/userlist.-containercomponent';
import { ControlsComponent } from './components/video-chat/controls/controls.component';
import { RemotePeerComponent } from './components/video-chat/remote-peer/remote-peer.component';
import { VideoChatSettingsDialogComponent } from './components/video-chat/video-chat-settings-dialog/video-chat-settings-dialog.component';
import { VideoChatComponent } from './components/video-chat/video-chat.component';
import { DemoUiComponentsModule } from '@ngx-webrtc/demo-ui-components';
import { environment } from '../environments/environment';
import { JoinChatDialogComponent } from './components/join-chat-dialog/join-chat-dialog.component';


const config: SocketIoConfig = { 
  url: environment.wsPath,
  options: {}
};

@NgModule({
  declarations: [
    AppComponent,
    TextChatContainerComponent,
    VideoChatComponent,
    RemotePeerComponent,
    UserlistContainerComponent,
    ControlsComponent,
    VideoChatSettingsDialogComponent,
    JoinChatDialogComponent,
  ],
  imports: [
    DemoUiComponentsModule,
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
  ]
})
export class AppModule { }
