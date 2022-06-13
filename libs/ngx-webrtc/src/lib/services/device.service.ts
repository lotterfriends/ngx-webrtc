import { Injectable } from '@angular/core';
import { DeviceType } from '../enums';
import { DevicesGroup } from '../interfaces';
import { NgxWebrtConfiguration } from '../ngx-webrtc-configuration';
import { StreamService } from './stream.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  constructor(
    private readonly config: NgxWebrtConfiguration,
    private streamService: StreamService,
  ){}

  /**
   * Change selected device wit a deviceId and a device type.
   * @param deviceId id of selected device
   * @param kind type of selected device `VideDevice` or `AudioDevice`
   */
  changeSelectedDevice(deviceId: string, kind: DeviceType): void {
    if (kind === DeviceType.VideoInput) {
      navigator.mediaDevices.getUserMedia({ video: {
        deviceId
      }}).then((stream) => {
        const track = this.streamService.getVideoTrackForStream(stream);
        if (track) {
          this.streamService.replaceTrack(track);
        }
        const currentStream = this.streamService.getLocalStream();
        if (currentStream && track) {
          this.streamService.replaceTrackInStream(currentStream, track);
        }
      }, console.error);
    }
    if (kind === DeviceType.AudioInput) {
      navigator.mediaDevices.getUserMedia({ audio: {
        deviceId
      }}).then((stream) => {
        const track = this.streamService.getAudioTrackForStream(stream);
        if(track) {
          this.streamService.replaceTrack(track);
        }
        const currentStream = this.streamService.getLocalStream();
        if (currentStream && track) {
          this.streamService.replaceTrackInStream(currentStream, track);
        }
      }, console.error);
    }
    if (kind === DeviceType.AudioOutput) {
      this.streamService.setAudioOutput(deviceId);
    }
  }

  /**
   * Check the given device, if it's selected.
   * @param device device to check if it's selected
   * @param kind the kind of the device to check
   * @returns `true` if the devie is selected, outerwise `false`
   */
  isDeviceSelected(device: MediaDeviceInfo, kind: DeviceType): boolean {
    const stream = this.streamService.getLocalStream();
    if (stream) {
      if (kind === DeviceType.VideoInput && this.streamService.hasVideo) {
        const track = this.streamService.getVideoTrackForStream(stream);
        if (track) {
          return track.getSettings().deviceId === device.deviceId;
        }
      }
      if (kind === DeviceType.AudioInput && this.streamService.hasAudio) {
        const track = this.streamService.getAudioTrackForStream(stream);
        if (track) {
          return track.getSettings().deviceId === device.deviceId;
        } 
      }
    }
    return false;
  }

  /**
   * group a list of devices you get by calling `StreamService.getMediaDevices()` by type.
   * @param devices list of devices you get by calling `StreamService.getMediaDevices()`
   * @returns a list of devices grouped by `DeviceType`
   */
  groupDeviceByKind(devices: MediaDeviceInfo[]): DevicesGroup[] {
    const devicesGoups: DevicesGroup[] = [];
    const audioInput = devices.filter(d => d.kind === DeviceType.AudioInput);
    const audioOutput = devices.filter(d => d.kind === DeviceType.AudioOutput);
    const videoinput = devices.filter(d => d.kind === DeviceType.VideoInput);
    if (audioInput.length) {
      devicesGoups.push({
        kind: DeviceType.AudioInput,
        devices: audioInput
      });
    }
    if (audioOutput.length) {
      devicesGoups.push({
        kind: DeviceType.AudioOutput,
        devices: audioOutput
      });
    }
    if (videoinput.length) {
      devicesGoups.push({
        kind: DeviceType.VideoInput,
        devices: videoinput
      });
    }
    return devicesGoups;
  }

}
