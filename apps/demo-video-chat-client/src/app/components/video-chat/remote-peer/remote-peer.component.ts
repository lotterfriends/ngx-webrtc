import { ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';
import { RemotePeerComponentInterface, CallService, UserInCall, StreamService } from 'ngx-webrtc';
import { User } from '@ngx-webrtc/demo-video-chat-models';

@Component({
  selector: 'ngx-webrtc-remote-peer',
  templateUrl: './remote-peer.component.html',
  styleUrls: ['./remote-peer.component.css'],
})
export class RemotePeerComponent implements RemotePeerComponentInterface {
  public user: UserInCall | null = null;
  public fit = true;

  @ViewChild('videoStreamNode', { static: false }) public videoStreamNode!: ElementRef;
  @ViewChild('audioStreamNode', { static: false }) public audioStreamNode!: ElementRef;
  constructor(
    private cdr: ChangeDetectorRef,
    private callService: CallService,
    public elementRef: ElementRef
  ) {
  }

  setUser(user: User): void {
    this.user = this.callService.getUser(user);
    this.cdr.detectChanges();
  }

  setSize(event: Event): void {
    const node: HTMLVideoElement = event.target as HTMLVideoElement;
    node.dataset['ratio'] = StreamService.getAspectRatio(node.videoWidth, node.videoHeight);
    if (node.videoWidth > node.videoHeight) {
      node.classList.add('landscape');
      node.classList.remove('portrait');
    } else {
      node.classList.add('portrait');
      node.classList.remove('landscape');
    }
  }



}
