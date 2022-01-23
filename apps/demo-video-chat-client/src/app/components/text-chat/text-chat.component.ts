import { Component, OnInit, ViewChild, ElementRef, Input, AfterViewInit, AfterViewChecked } from '@angular/core';
import { SocketService } from '../../services/socket.service';
import { MessagesService } from '../../services/messages.service';
import { first } from 'rxjs/operators';
import { Message, MessageType, ServerMessage } from '@ngx-webrtc/demo-video-chat-models';

@Component({
  selector: 'ngx-webrtc-text-chat',
  templateUrl: './text-chat.component.html',
  styleUrls: ['./text-chat.component.css'],
})
export class TextChatComponent implements OnInit, AfterViewChecked {
  constructor(
    private socketService: SocketService,
    private messagesService: MessagesService
  ) {}

  messages: Message[] = [];
  users: string[] = [];
  msg = '';
  @ViewChild('scrollMe', { static: true })
  private myScrollContainer!: ElementRef;

  @ViewChild('messageField', { static: true })
  private messageFieldRef!: ElementRef;

  @Input() room!: string;

  private get messageField(): HTMLInputElement {
    return this.messageFieldRef.nativeElement;
  }

  public ngOnInit(): void {
    this.fetchMessagesHistory();
    this.scrollToBottom();
    this.initSockets();
  }

  public ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  public focusOnInput(user: string): void {
    this.messageField.value = '@' + user + ' ' + this.messageField.value;
    this.messageField.focus();
  }

  public sendMessage(message: string): boolean {
    this.socketService.sendMessage(message);
    return true;
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
      });
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  private initSockets(): void {
    this.socketService.getMessages().subscribe((message: ServerMessage) => {
      if (message.type === MessageType.Text) {
        this.messages.push(message);
      }
    });

    this.socketService.getUsers().subscribe((users) => {
      this.users = users;
    });

    this.socketService.onLogout().subscribe((username) => {
      this.users = this.users.filter((e) => e !== username);
    });
  }
}
