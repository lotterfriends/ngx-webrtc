import { Component, OnInit, ChangeDetectionStrategy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UiService, ViewMode } from 'src/app/services/ui.service';

@UntilDestroy()
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
  public viewMode = UiService.DEFAULTS.VIEW_MODE;
  public viewModes = ViewMode;
  public viewModesList = Object.values(ViewMode);
  @Output() leave = new EventEmitter()
  @Output() fullscreen = new EventEmitter()

  constructor(
    private uiService: UiService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {

    this.uiService.viewMode$.pipe(
      untilDestroyed(this)
    ).subscribe(mode => {
      this.viewMode = mode;
      this.cdr.detectChanges();
    });

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

  setViewMode(mode: ViewMode) {
    this.uiService.setViewMode(mode);
  }

}
