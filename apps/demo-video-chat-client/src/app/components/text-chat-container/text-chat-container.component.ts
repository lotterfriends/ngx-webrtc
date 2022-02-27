import { Component, Input, OnInit } from '@angular/core';
import { Message, MessageType, ServerMessage } from '@ngx-webrtc/demo-video-chat-models';
import { first } from 'rxjs/operators';
import { MessagesService } from '../../services/messages.service';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'ngx-webrtc-text-chat-container',
  templateUrl: './text-chat-container.component.html',
  styleUrls: ['./text-chat-container.component.css'],
})
export class TextChatContainerComponent implements OnInit {
  constructor(
    private socketService: SocketService,
    private messagesService: MessagesService
  ) {}

  messages: Message[] = [];
  @Input() room!: string;


  public ngOnInit(): void {
    this.fetchMessagesHistory();
    this.initSockets();
  }

  public sendMessage(message: string) {
    this.socketService.sendMessage(message);
  }

  private fetchMessagesHistory(): void {
    this.messagesService
      .getMessagesHistory(this.room, MessageType.Text)
      .pipe(first())
      .subscribe((data) => {
        this.messages = [
          ...data.messages.filter(m => m.type === MessageType.Text),
          ...this.messages
        ];
        console.log(this.messages);
      });
  }

  private initSockets(): void {
    this.socketService.getMessages().subscribe((message: ServerMessage) => {
      if (message.type === MessageType.Text) {
        this.messages.push(message);
      }
    });
    
  }
}
