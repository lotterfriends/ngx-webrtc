import { Component, OnInit, ChangeDetectionStrategy, HostListener, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, first, tap } from 'rxjs/operators';
import { StreamService } from '../../../peer/services/stream.service';
import { UiService } from '../../../services/ui.service';

// TODO: display input level

enum DeviceType {
  AudioInput = 'audioinput',
  AudioOutput = 'audiooutput',
  VideoInput = 'videoinput'
}

@UntilDestroy()
@Component({
  selector: 'ngx-webrtc-video-chat-settings-dialog',
  templateUrl: './video-chat-settings-dialog.component.html',
  styleUrls: ['./video-chat-settings-dialog.component.css'],
})
export class VideoChatSettingsDialogComponent implements OnInit, OnDestroy {

  private hasStream = false;
  private showVideoSettingsDialogInternal = UiService.DEFAULTS.VIDEO_SETTINGS_DIALOG_VISIBLE;
  private onDeviceChangeListener;
  public set showVideoSettingsDialog(value){
    if (this.showVideoSettingsDialogInternal !== value && !value) {
      this.uiService.hideVideoSettingsDialog();
    }
    this.showVideoSettingsDialogInternal = value;
  }

  public get showVideoSettingsDialog(): boolean {
    return this.showVideoSettingsDialogInternal;
  }
  devicesGoups: {kind: DeviceType, devices: MediaDeviceInfo[]}[] = [];

  constructor(
    private uiService: UiService,
    private streamService: StreamService
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
    this.onDeviceChangeListener = navigator.mediaDevices.addEventListener('devicechange', () => {
      if (this.hasStream) {
        this.initDeviceList();
      }
    });
  }

  ngOnDestroy(): void {
    navigator.mediaDevices.removeEventListener('devicechange', this.onDeviceChangeListener);
  }

  initDeviceList(): void {
    this.streamService.getMediaDevices().then(devices => {
      // console.log(devices);
      const audioInput = devices.filter(d => d.kind === DeviceType.AudioInput);
      const audioOutput = devices.filter(d => d.kind === DeviceType.AudioOutput);
      const videoinput = devices.filter(d => d.kind === DeviceType.VideoInput);
      if (audioInput.length) {
        this.devicesGoups.push({
          kind: DeviceType.AudioInput,
          devices: audioInput
        });
      }
      if (audioOutput.length) {
        this.devicesGoups.push({
          kind: DeviceType.AudioOutput,
          devices: audioOutput
        });
      }
      if (videoinput.length) {
        this.devicesGoups.push({
          kind: DeviceType.VideoInput,
          devices: videoinput
        });
      }
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
    const stream = this.streamService.getLocalStream();
    if (stream) {
      if (kind === DeviceType.VideoInput && this.streamService.hasVideo) {
        return this.streamService.getVideoTrackForStream(this.streamService.getLocalStream()).getSettings().deviceId === device.deviceId;
      }
      if (kind === DeviceType.AudioInput && this.streamService.hasAudio) {
        return this.streamService.getAudioTrackForStream(this.streamService.getLocalStream()).getSettings().deviceId === device.deviceId;
      }
    }
    return false;
  }

  changeSelectedDevice(event: Event, kind: DeviceType): void {
    const deviceId = (event.target as HTMLSelectElement).value;
    if (kind === DeviceType.VideoInput) {
      navigator.mediaDevices.getUserMedia({ video: {
        deviceId
      }}).then((stream) => {
        const track = this.streamService.getVideoTrackForStream(stream);
        this.streamService.replaceTrack(track);
        this.streamService.replaceTrackInStream(this.streamService.getLocalStream(), track);
      }, console.error);
    }
    if (kind === DeviceType.AudioInput) {
      navigator.mediaDevices.getUserMedia({ audio: {
        deviceId
      }}).then((stream) => {
        const track = this.streamService.getAudioTrackForStream(stream);
        this.streamService.replaceTrack(track);
        this.streamService.replaceTrackInStream(this.streamService.getLocalStream(), track);
      }, console.error);
    }
    if (kind === DeviceType.AudioOutput) {
      this.streamService.setAudioOutput(deviceId);
    }
  }

}
