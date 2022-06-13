import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { StreamService, DeviceType, DeviceService, DevicesGroup } from 'ngx-webrtc';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { UiService } from '../../../services/ui.service';

// TODO: display input level
@UntilDestroy()
@Component({
  selector: 'ngx-webrtc-video-chat-settings-dialog',
  templateUrl: './video-chat-settings-dialog.component.html',
  styleUrls: ['./video-chat-settings-dialog.component.css'],
})
export class VideoChatSettingsDialogComponent implements OnInit, OnDestroy {

  private hasStream = false;
  private showVideoSettingsDialogInternal = UiService.DEFAULTS.VIDEO_SETTINGS_DIALOG_VISIBLE;
  public devicesGoups: DevicesGroup[] = [];

  private onDeviceChangeListener: EventListener = () => {
    if (this.hasStream) {
      this.initDeviceList();
    }
  }
  public set showVideoSettingsDialog(value){
    if (this.showVideoSettingsDialogInternal !== value && !value) {
      this.uiService.hideVideoSettingsDialog();
    }
    this.showVideoSettingsDialogInternal = value;
  }

  public get showVideoSettingsDialog(): boolean {
    return this.showVideoSettingsDialogInternal;
  }

  constructor(
    private uiService: UiService,
    private streamService: StreamService,
    private deviceService: DeviceService,
  ) { }

  ngOnInit(): void {

    this.uiService.isVideoSettingsDialogVisible$.pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe((isVisible) => {
      this.showVideoSettingsDialog = isVisible;
    });


    this.streamService.localStream$.pipe(
      filter(e => e !== null),
      tap(stream => this.hasStream = stream !== null),
      untilDestroyed(this),
    ).subscribe(this.initDeviceList.bind(this));

    // not possible with HostListener
    navigator.mediaDevices.addEventListener('devicechange', this.onDeviceChangeListener);
  }

  ngOnDestroy(): void {
    navigator.mediaDevices.removeEventListener('devicechange', this.onDeviceChangeListener);
  }

  initDeviceList(): void {
    this.streamService.getMediaDevices().then(devices => {
      this.devicesGoups = this.deviceService.groupDeviceByKind(devices);
    });
  }

  getLabelForDeviceType(type: DeviceType): string {
    switch (type) {
      case DeviceType.AudioInput:
        return 'Microphone';
      case DeviceType.AudioOutput:
        return 'Audio Output';
      case DeviceType.VideoInput:
        return 'Camera';
    }
  }

  isSelected(device: MediaDeviceInfo, kind: DeviceType): boolean {
    return this.deviceService.isDeviceSelected(device, kind);
  }

  changeSelectedDevice(event: Event, kind: DeviceType): void {
    const deviceId = (event.target as HTMLSelectElement).value;
    this.deviceService.changeSelectedDevice(deviceId, kind);
  }

}
