import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

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

  onHide() {
    this.show = !this.show;
    this.showChange.emit(this.show);
  }



}
