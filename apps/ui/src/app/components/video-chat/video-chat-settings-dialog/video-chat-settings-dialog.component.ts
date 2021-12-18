import { Component, OnInit, ChangeDetectionStrategy, HostListener, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { distinctUntilChanged, filter, first, tap } from 'rxjs/operators';
import { StreamService } from 'src/app/peer/services/stream.service';
import { UiService } from 'src/app/services/ui.service';

// TODO: display input level

enum DeviceType {
  AudioInput = 'audioinput',
  AudioOutput = 'audiooutput',
  VideoInput = 'videoinput'
}

@UntilDestroy()
@Component({
  selector: 'app-video-chat-settings-dialog',
  templateUrl: './video-chat-settings-dialog.component.html',
  styleUrls: ['./video-chat-settings-dialog.component.css'],
})
export class VideoChatSettingsDialogComponent implements OnInit, OnDestroy {

  private hasStream = false;
  private _showVideoSettingsDialog = UiService.DEFAULTS.VIDEO_SETTINGS_DIALOG_VISIBLE;
  private onDeviceChangeListener;
  public set showVideoSettingsDialog(value){
    if (this._showVideoSettingsDialog !== value && !value) {
      this.uiService.hideVideoSettingsDialog();
    }
    this._showVideoSettingsDialog = value;
  }

  public get showVideoSettingsDialog(): boolean {
    return this._showVideoSettingsDialog;
  }
  devicesGoups:{kind: DeviceType, devices: MediaDeviceInfo[]}[] = [];

  constructor(
    private uiService: UiService,
    private streamService: StreamService
  ) { }

  ngOnInit(): void {

    this.uiService.isVideoSettingsDialogVisible$.pipe(
      untilDestroyed(this),
      distinctUntilChanged()
    ).subscribe((isVisible) => {
      this.showVideoSettingsDialog = isVisible
    });


    this.streamService.localStream$.pipe(
      filter(e => e !== null),
      tap(stream => this.hasStream = stream !== null),
      untilDestroyed(this),
    ).subscribe(this.initDeviceList.bind(this));

    // not possible with HostListener 
    this.onDeviceChangeListener = navigator.mediaDevices.addEventListener('devicechange', _event => {
      if (this.hasStream) {
        this.initDeviceList(null);
      }
    });
  }

  ngOnDestroy(): void {
    navigator.mediaDevices.removeEventListener('devicechange', this.onDeviceChangeListener);
  }

  initDeviceList(_stream) {
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

  getLabelForDeviceType(type: DeviceType) {
    switch (type) {
      case DeviceType.AudioInput:
        return 'Microphone'
      case DeviceType.AudioOutput:
        return 'Audio Output'
      case DeviceType.VideoInput:
        return 'Camera'
    }
  }

  isSelected(device: MediaDeviceInfo, kind: DeviceType): boolean {
    if(kind === DeviceType.VideoInput) {
      return this.streamService.getVideoTrackForStream(this.streamService.getLocalStream()).getSettings().deviceId === device.deviceId;
    }
    if(kind === DeviceType.AudioInput) {
      return this.streamService.getAudioTrackForStream(this.streamService.getLocalStream()).getSettings().deviceId === device.deviceId;
    }
    return false;
  }

  changeSelectedDevice(event: Event, kind: DeviceType): void {
    const deviceId = (event.target as HTMLSelectElement).value;
    if (kind === DeviceType.VideoInput) {
      navigator.mediaDevices.getUserMedia({ video: {
        deviceId: deviceId
      }}).then((stream) => {
        const track = this.streamService.getVideoTrackForStream(stream);
        this.streamService.replaceTrack(track);
        this.streamService.replaceTrackInStream(this.streamService.getLocalStream(), track);
      }, console.error);
    }
    if (kind === DeviceType.AudioInput) {
      navigator.mediaDevices.getUserMedia({ audio: {
        deviceId: deviceId
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
