import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RemotePeerComponentInterface } from 'src/app/peer/interfaces/remote-peer-component-interface';
import { CallService, UserInCall } from 'src/app/peer/services/call.service';
import { StreamService } from 'src/app/peer/services/stream.service';
import { User } from '../../../../../../../libs/models';

@Component({
  selector: 'app-remote-peer',
  templateUrl: './remote-peer.component.html',
  styleUrls: ['./remote-peer.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemotePeerComponent implements RemotePeerComponentInterface, OnInit {
  public user: UserInCall;
  public fit = true;

  @ViewChild('videoStreamNode', { static: false }) public videoStreamNode: ElementRef;
  @ViewChild('audioStreamNode', { static: false }) public audioStreamNode: ElementRef;
  constructor(
    private cdr: ChangeDetectorRef,
    private callService: CallService,
    public elementRef: ElementRef
  ) {
  }

  ngOnInit(): void {
  }

  setUser(user: User): void {
    this.user = this.callService.getUser(user);
    this.cdr.detectChanges();
  }

  setSize(event: Event): void {
    const node: HTMLVideoElement = event.target as HTMLVideoElement;
    node.dataset.ratio = StreamService.getAspectRatio(node.videoWidth, node.videoHeight);
    if (node.videoWidth > node.videoHeight) {
      node.classList.add('landscape');
      node.classList.remove('portrait');
    } else {
      node.classList.add('portrait');
      node.classList.remove('landscape');
    }
  }



}
