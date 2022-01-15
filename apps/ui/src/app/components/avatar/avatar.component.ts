import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnInit {

  @Input() name: string;
  constructor() { }

  ngOnInit(): void {
  }

  generateColorForText(text: string): string {
    let sl: string[] = [', 100%, 40%', ', 100%, 41%'];
    let hash: number = 0;
    if (text.length == 0) {
      return '#fff';
    }
    for (let i = 0, len = text.length; i < len; i++) {
      let chr = text.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return 'hsl(' + ((hash % 360) * 15) + sl[Math.abs(parseInt(`${hash / 360}`, 10) % sl.length)] + ')';
  };

}
