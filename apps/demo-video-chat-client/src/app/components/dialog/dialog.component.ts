import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'ngx-webrtc-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {

  @Input() show = false;
  @Input() title = '';
  @Output() showChange = new EventEmitter<boolean>();

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.show && event.key === 'Escape') {
      this.onHide();
    }
  }

  onHide(): void {
    this.show = !this.show;
    this.showChange.emit(this.show);
  }



}
