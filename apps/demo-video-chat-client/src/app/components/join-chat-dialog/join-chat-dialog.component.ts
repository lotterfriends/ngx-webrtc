import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DeviceService, DevicesGroup, DeviceType, StreamService } from 'ngx-webrtc';
import { UiService } from '../../services/ui.service';

@UntilDestroy()
@Component({
  selector: 'ngx-webrtc-join-chat-dialog',
  templateUrl: './join-chat-dialog.component.html',
  styleUrls: ['./join-chat-dialog.component.css']
})
export class JoinChatDialogComponent implements OnInit, OnDestroy {

  private stream: MediaStream | null = null;
  @ViewChild('videoStreamNode', { static: false }) public videoStreamNode!: ElementRef;
  @Input() public show = false;
  @Input() public room = '';
  @Output() dialogClose = new EventEmitter();
  @Output() yes = new EventEmitter();
  @Output() no = new EventEmitter();
  public getLabelForDeviceTypeFkt = this.uiService.getLabelForDeviceType;
  public devicesGoups: DevicesGroup[] = [];
  public showSettings = false;

  constructor(
    private readonly uiService: UiService,
    private readonly streamService: StreamService,
    private readonly deviceService: DeviceService,
  ) { }

  ngOnDestroy(): void {
    this.streamService.stopStreamInNode(this.videoStreamNode.nativeElement);
  }

  ngOnInit(): void {
    this.initDeviceList();

    this.streamService.tryGetUserMedia().then(stream => {
      this.stream = stream;
      this.streamService.setStreamInNode(this.videoStreamNode.nativeElement, this.stream, false);
    })
  }


  initDeviceList(): void {
    this.streamService.getMediaDevices().then(devices => {
      this.devicesGoups = this.deviceService.groupDeviceByKind(devices, [DeviceType.AudioOutput]);
    });
  }

  isSelected(device: MediaDeviceInfo, kind: DeviceType): boolean {
    return this.deviceService.isDeviceSelected(device, kind);
  }

  changeSelectedDevice(event: Event, kind: DeviceType): void {
    const deviceId = (event.target as HTMLSelectElement).value;
    if (kind === DeviceType.VideoInput) {
      this.deviceService.preferredVideoInputDevice$.next(deviceId);
      navigator.mediaDevices.getUserMedia({ video: {
        deviceId
      }}).then((stream) => {
        const track = this.streamService.getVideoTrackForStream(stream);
        if (this.stream && track) {
          this.streamService.replaceTrackInStream(this.stream, track);
        }
      });
    }
    if (kind === DeviceType.AudioInput) {
      this.deviceService.preferredAudioInputDevice$.next(deviceId);
      navigator.mediaDevices.getUserMedia({ audio: {
        deviceId
      }}).then((stream) => {
        const track = this.streamService.getAudioTrackForStream(stream);
        if (this.stream && track) {
          this.streamService.replaceTrackInStream(this.stream, track);
        }
      });
    }
  }

  changeVolume($event: Event): void {
    const volume = parseInt(($event.target as HTMLInputElement).value, 10) / 100;
    (this.videoStreamNode.nativeElement as HTMLVideoElement).volume = volume;
    this.deviceService.preferredAudioInputDeviceVolume$.next(volume);
  }

  joinYes() {
    this.yes.emit();
  }

  joinNo() {
    this.no.emit();
  }

  onShowChange(show: boolean) {
    if (!show) {
      this.dialogClose.emit();
    }
  }

}
