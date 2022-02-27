import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarComponent } from './avatar/avatar.component';
import { FormsModule } from '@angular/forms';
import { TextChatComponent } from './text-chat/text-chat.component';
import { DialogComponent } from './dialog/dialog.component';
import { UserlistComponent } from './userlist/userlist.component';
import { NgxWebrtcModule } from 'ngx-webrtc';

@NgModule({
  declarations: [
    AvatarComponent,
    TextChatComponent,
    DialogComponent,
    UserlistComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxWebrtcModule
  ],
  exports: [
    AvatarComponent,
    TextChatComponent,
    DialogComponent,
    UserlistComponent,
  ]
})
export class DemoUiComponentsModule {}
