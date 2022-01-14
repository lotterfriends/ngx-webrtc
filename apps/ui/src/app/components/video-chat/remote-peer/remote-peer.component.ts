import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef, HostBinding } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged } from 'rxjs/operators';
import { CallService, UserInCall } from 'src/app/peer/services/call.service';
import { StreamService } from 'src/app/peer/services/stream.service';
import { UiService, ViewMode } from 'src/app/services/ui.service';
import { User } from '../../../../../../../libs/models';

@UntilDestroy()
@Component({
  selector: 'app-remote-peer',
  templateUrl: './remote-peer.component.html',
  styleUrls: ['./remote-peer.component.css'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class RemotePeerComponent implements OnInit {
  public user: UserInCall;
  public fit = true;

  @ViewChild('videoStreamNode', { static: false }) public videoStreamNode: ElementRef;
  @ViewChild('audioStreamNode', { static: false }) public audioStreamNode: ElementRef;
  constructor(
    private cdr: ChangeDetectorRef,
    private callService: CallService,
    public elementRef: ElementRef,
    private uiService: UiService
  ) {
  }
  
  ngOnInit(): void {
    this.callService.users$.pipe(distinctUntilChanged(), untilDestroyed(this)).subscribe(users => {
      if (this.user) {
        this.user = this.callService.getUser(this.user.user);
        this.cdr.detectChanges();
      }
    });
  }
  
  setUser(user: User): void {
    this.user = this.callService.getUser(user);
    this.cdr.detectChanges();
  }

  setSize(event: Event) {
    const node = event.target as HTMLVideoElement;
    node.dataset.ratio = StreamService.getAspectRatio(node.videoWidth, node.videoHeight);
    if (node.videoWidth > node.videoHeight) {
      node.classList.add('landscape');
      node.classList.remove('portrait');
    } else {
      node.classList.add('portrait');
      node.classList.remove('landscape');
    }
  }

  setSpotlight() {
    if (!this.user.videoMuted && this.uiService.viewMode$.getValue() !== ViewMode.Grid) {
      this.callService.setUserSpotlight(this.user.user, true);
    }
  }

}
