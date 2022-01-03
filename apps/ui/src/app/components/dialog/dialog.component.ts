import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit {

  constructor() { }
  @Input() show = false;
  @Input() title: string;
  @Output() showChange = new EventEmitter<boolean>();
  ngOnInit(): void {
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    if (this.show && event.key === 'Escape') {
      this.onHide();
    }
  }

  onHide() {
    this.show = !this.show;
    this.showChange.emit(this.show);
  }



}
