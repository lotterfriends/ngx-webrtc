import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';

import { AppComponent } from './app.component';
import { TextChatComponent } from './components/text-chat/text-chat.component';
import { VideoChatComponent } from './components/video-chat/video-chat.component';
import { RemotePeerComponent } from './components/video-chat/remote-peer/remote-peer.component';
import { UserlistComponent } from './components/userlist/userlist.component';
import { AuthInterceptor } from './auth-interceptor';
import { ControlsComponent } from './components/video-chat/controls/controls.component';
import { ToggleAudioSelfDirective } from './peer/directives/toggle-audio-self.directive';
import { ToggleVideoSelfDirective } from './peer/directives/toggle-video-self.directive';
import { ShareScreenDirective } from './peer/directives/share-screen.directive';
import { DialogComponent } from './components/dialog/dialog.component';
import { VideoChatSettingsDialogComponent } from './components/video-chat/video-chat-settings-dialog/video-chat-settings-dialog.component';
import { ToggleAudioUserDirective } from './peer/directives/toggle-audio-user.directive';
import { ToggleVideoUserDirective } from './peer/directives/toggle-video-user.directive';
import { AvatarComponent } from './components/avatar/avatar.component';

const config: SocketIoConfig = { url: "http://localhost:3333", options: {} };

@NgModule({
  declarations: [
    AppComponent,
    TextChatComponent,
    VideoChatComponent,
    RemotePeerComponent,
    UserlistComponent,
    ControlsComponent,
    ToggleAudioSelfDirective,
    ToggleVideoSelfDirective,
    ToggleAudioUserDirective,
    ToggleVideoUserDirective,
    ShareScreenDirective,
    DialogComponent,
    VideoChatSettingsDialogComponent,
    AvatarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
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
