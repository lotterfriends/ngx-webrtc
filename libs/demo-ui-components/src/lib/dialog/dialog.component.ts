import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';

@Component({
  selector: 'ngx-webrtc-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent {

  @Input() title = '';
  @Output() showChange = new EventEmitter<boolean>();
  
  @Input()
  @HostBinding('class.show')
  public show = false;

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
