import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StreamType } from '../peer-connection-client';

@Injectable({
  providedIn: 'root'
})
export class StreamService {


  public localStream$ = new BehaviorSubject<MediaStream>(null);
  public replaceTrack$ = new BehaviorSubject<MediaStreamTrack>(null);
  public audioOutput$ = new BehaviorSubject<string>(null);
  public localStreamStatusChanged = new EventEmitter<MediaStream | MediaStreamTrack>();

  constructor() { }

  public setStreamInNode(node: HTMLVideoElement, stream: MediaStream | MediaStreamTrack, muted = true) {
    const _self = this;
    if (node) {

      // play when ready
      node.addEventListener('canplay', function onCanPlay(event) {
        const video: HTMLVideoElement = event.target as HTMLVideoElement;
        if (video) {
          video.removeEventListener('canplay', onCanPlay);
          video.play();
        }
        _self.localStreamStatusChanged.emit(stream);
      });

      let tmpStream;
      if (stream instanceof MediaStreamTrack) {
        tmpStream = new MediaStream();
        tmpStream.addTrack(stream);
      } else {
        tmpStream = stream;
      }
      node.srcObject = tmpStream;
      node.muted = muted;
    }
  }
  
  public stopStreamInNode(node: ElementRef) {
    node?.nativeElement?.pause();
    node?.nativeElement?.srcObject?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    if (node?.nativeElement?.srcObject) {
      node.nativeElement.srcObject = new MediaStream()
    } 
  }

  public toggleMuteStream(stream: MediaStream | MediaStreamTrack, type: StreamType, value?: boolean) {
    console.log('toggleMuteStream()', stream, type, value);
    if(stream) {
      if (stream instanceof MediaStreamTrack) {
        stream.enabled = typeof value !== 'undefined' ? value : !stream.enabled;
      } else {
        if (type === StreamType.Audio) {
          stream.getAudioTracks().forEach(track => {
            track.enabled = typeof value !== 'undefined' ? value : !track.enabled;
          });
        }
        if (type === StreamType.Video) {
          stream.getVideoTracks().forEach(track => {
            track.enabled = typeof value !== 'undefined' ? value : !track.enabled;
          });
        }
      }
    }
    this.localStreamStatusChanged.emit(stream);
  }
  
  public muteStream(stream: MediaStream | MediaStreamTrack, type: StreamType) {
    this.toggleMuteStream(stream, type, false);
  }
  
  public unmuteStream(stream: MediaStream | MediaStreamTrack, type: StreamType) {
    this.toggleMuteStream(stream, type, true);
  }

  public replaceTrackInStream(stream: MediaStream, track: MediaStreamTrack) {
    if (track.kind === StreamType.Video) {
      stream?.getVideoTracks().forEach(e => stream.removeTrack(e));
    }
    if (track.kind === StreamType.Audio) {
      stream?.getAudioTracks().forEach(e => stream.removeTrack(e));
    }
    stream?.addTrack(track);
  }

  public setLocalStream(stream: MediaStream) {
    this.localStream$.next(stream);
  }

  public getLocalStream(): MediaStream {
    return this.localStream$.getValue();
  }

  public replaceTrack(track: MediaStreamTrack): void {
    this.replaceTrack$.next(track);
  }

  public toggleMuteLocalAudioStream() {
    this.toggleMuteStream(this.localStream$.getValue(), StreamType.Audio);
  }
  
  public muteLocalAudioStream() {
    this.toggleMuteStream(this.localStream$.getValue(), StreamType.Audio, false);
  }
  
  public unmuteLocalAudioStream() {
    this.toggleMuteStream(this.localStream$.getValue(), StreamType.Audio, true);
  }
  
  public toggleMuteLocalVideoStream() {
    this.toggleMuteStream(this.localStream$.getValue(), StreamType.Video);
  }
  
  public muteLocalVideoStream() {
    this.toggleMuteStream(this.localStream$.getValue(), StreamType.Video, false);
  }
  
  public unmuteLocalVideoStream() {
    this.toggleMuteStream(this.localStream$.getValue(), StreamType.Video, true);
  }

  async getScreenCapture(): Promise<MediaStream | null> {
    let stream: MediaStream = null;
    try {
      const n: any = navigator;
      if (n.getDisplayMedia) {
        stream = await n.getDisplayMedia({ video: true });
      } else if (n.mediaDevices.getDisplayMedia) {
        stream = await n.mediaDevices.getDisplayMedia({ video: true });
      } else {
        stream = await n.mediaDevices.getUserMedia({ video: { mediaSource: 'screen' } });
      }
    } catch (e) {
      console.log(`MdoVideoCallComponent.getScreenCapture() -> no permissions`);
    }
    return stream;
  }

  public getVideoTrackForStream(stream: MediaStream): MediaStreamTrack {
    return stream?.getVideoTracks()[0];
  }

  public getAudioTrackForStream(stream: MediaStream): MediaStreamTrack {
    return stream?.getAudioTracks()[0];
  }

  public static getAspectRatio(width: number, height: number) {

    function gcd(a, b) {
      return b ? gcd(b, a % b) : a;
    }

    const divisor = gcd(width, height);
    return `${width / divisor}x${height / divisor}`;
  };

  public getMediaDevices(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices()
    // .then(function(devices) {
    //   var cam = devices.find(function(device) {
    //     return device.kind === 'videoinput';
    //   });
    //   var mic = devices.find(function(device) {
    //     return device.kind === 'audioinput';
    //   });
    //   var constraints = {
    //     video: cam && mediaConstraints.video,
    //     audio: mic && mediaConstraints.audio
    //   };
    //   return navigator.mediaDevices.getUserMedia(constraints);
    // });
  }

  public setAudioOutput(deviceId: string) {
    this.audioOutput$.next(deviceId);
  }
}
