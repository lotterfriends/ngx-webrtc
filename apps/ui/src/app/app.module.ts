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
import { ControlsComponent } from './components/controls/controls.component';

const config: SocketIoConfig = { url: "http://localhost:3333", options: {} };

@NgModule({
  declarations: [
    AppComponent,
    TextChatComponent,
    VideoChatComponent,
    RemotePeerComponent,
    UserlistComponent,
    ControlsComponent
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
  bootstrap: [AppComponent]
})
export class AppModule { }
