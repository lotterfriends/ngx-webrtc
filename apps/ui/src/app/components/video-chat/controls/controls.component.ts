import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ControlsComponent implements OnInit {
  public showUserlist = true;
  public inFullscreen = false;
  public userlistVisisble = UiService.DEFAULTS.USERLIST_VISIBLE;
  public chatVisisble = UiService.DEFAULTS.CHAT_VISIBLE;
  @Output() leave = new EventEmitter()
  @Output() fullscreen = new EventEmitter()

  constructor(
    private uiService: UiService
  ) { }

  ngOnInit(): void {
  }

  toggleUserlist() {
    this.uiService.toggleShowUserlist();
    this.userlistVisisble = !this.userlistVisisble;
  }
  
  toggleChat() {
    this.uiService.toggleShowChat();
    this.chatVisisble = !this.chatVisisble;
  }
  
  toggleVideoSettingsDialog() {
    this.uiService.toggleShowVideoSettingsDialog();
  }

  toggleFullscreen() {
    this.fullscreen.emit();
    this.inFullscreen = !this.inFullscreen;
  }

  doLeave() {
    this.leave.emit();
  }

}
