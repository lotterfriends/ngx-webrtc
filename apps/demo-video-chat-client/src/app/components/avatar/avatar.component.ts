import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-webrtc-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.css'],
})
export class AvatarComponent implements OnInit {

  @Input() name: string = '';
  constructor() { }

  ngOnInit(): void {
  }

  generateColorForText(text: string): string {
    const sl: string[] = [', 100%, 40%', ', 100%, 41%'];
    let hash = 0;
    if (text.length === 0) {
      return '#fff';
    }
    for (let i = 0, len = text.length; i < len; i++) {
      const chr = text.charCodeAt(i);
      /* tslint:disable:no-bitwise */
      hash = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
      /* tslint:enable:no-bitwise */
    }
    return 'hsl(' + ((hash % 360) * 15) + sl[Math.abs(parseInt(`${hash / 360}`, 10) % sl.length)] + ')';
  }

}
