import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Message } from '@ngx-webrtc/demo-video-chat-models';

@Component({
  selector: 'ngx-webrtc-text-chat',
  templateUrl: './text-chat.component.html',
  styleUrls: ['./text-chat.component.css'],
})
export class TextChatComponent implements OnInit, AfterViewChecked {

  msg = '';
  @ViewChild('scrollMe', { static: true })
  private myScrollContainer!: ElementRef;

  @ViewChild('messageField', { static: true })
  private messageFieldRef!: ElementRef;

  @Input() messages: Message[] = [];
  @Output() sendMessage = new EventEmitter();
  private get messageField(): HTMLInputElement {
    return this.messageFieldRef.nativeElement;
  }

  public ngOnInit(): void {
    this.scrollToBottom();
  }

  public ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  public focusOnInput(user: string): void {
    this.messageField.value = '@' + user + ' ' + this.messageField.value;
    this.messageField.focus();
  }

  public doSendMessage(message: string): boolean {
    this.sendMessage.emit(message);
    return true;
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {
      // nothing to do
    }
  }

}
