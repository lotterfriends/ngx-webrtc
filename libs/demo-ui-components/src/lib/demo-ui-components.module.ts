import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxWebrtcModule } from 'ngx-webrtc';
import { AvatarComponent } from './avatar/avatar.component';
import { ConferenceGridHolderComponent } from './conference-grid/conference-grid-holder.component';
import { DialogComponent } from './dialog/dialog.component';
import { TextChatComponent } from './text-chat/text-chat.component';
import { UserlistComponent } from './userlist/userlist.component';

@NgModule({
  declarations: [
    AvatarComponent,
    TextChatComponent,
    DialogComponent,
    UserlistComponent,
    ConferenceGridHolderComponent,
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
    ConferenceGridHolderComponent,
  ]
})
export class DemoUiComponentsModule {}
