import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { User } from '../../../../../../../libs/models';

@Component({
  selector: 'app-remote-peer',
  templateUrl: './remote-peer.component.html',
  styleUrls: ['./remote-peer.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemotePeerComponent implements OnInit {
  public user: User;
  
  @ViewChild('videoStreamNode', { static: false }) public videoStreamNode: ElementRef;
  @ViewChild('audioStreamNode', { static: false }) public audioStreamNode: ElementRef;
  
  constructor(
    private cdr: ChangeDetectorRef
  ) { }
  
  ngOnInit(): void {
  }
  
  setUser(user: User): void {
    this.user = user;
    this.cdr.detectChanges();
  }

}
