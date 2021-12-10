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

  @Output() leave = new EventEmitter()
  @Output() fullscreen = new EventEmitter()

  constructor(
    private uiService: UiService
  ) { }

  ngOnInit(): void {

    // this.uiService.isUserlistVisible.subscribe(isVisible => {
    //   this.showUserlist = isVisible;
    // });
  }

  toggleUserlist() {
    this.uiService.toggleShowUserlist();
  }
  
  toggleChat() {
    this.uiService.toggleShowChat();
  }

  toggleFullscreen() {
    this.fullscreen.emit();
  }

  doLeave() {
    this.leave.emit();
  }

}
