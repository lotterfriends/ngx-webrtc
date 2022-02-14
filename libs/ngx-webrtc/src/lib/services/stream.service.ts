import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { StreamType } from "../enums/stream-type";
import { NgxWebrtConfiguration } from '../ngx-webrtc-configuration';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  public localStream$ = new BehaviorSubject<MediaStream | null>(null);
  public localShareScreenStream$ = new BehaviorSubject<MediaStream | null>(null);
  public replaceTrack$ = new BehaviorSubject<MediaStreamTrack | null>(null);
  public audioOutput$ = new BehaviorSubject<string | null>(null);
  public localStreamStatusChanged = new EventEmitter<MediaStream | MediaStreamTrack>();
  public localAudioStreamStatusChanged = new EventEmitter<boolean>();
  public localVideoStreamStatusChanged = new EventEmitter<boolean>();
  public hasVideo = false;
  public hasAudio = false;

  constructor(
    private readonly config: NgxWebrtConfiguration
  ){}


  public static getAspectRatio(width: number, height: number): string {

    function gcd(a: number, b: number): number {
      return b ? gcd(b, a % b) : a;
    }

    const divisor: number = gcd(width, height);
    return `${width / divisor}x${height / divisor}`;
  }
  public setStreamInNode(node: HTMLVideoElement | HTMLAudioElement, stream: MediaStream | MediaStreamTrack, muted = true, local = false): void {
    const self = this;
    if (node) {

      // play when ready
      node.addEventListener('canplay', function onCanPlay(event) {
        // it doesn't matter if we use audio or video element here
        const eventTargetNode: HTMLVideoElement = event.target as HTMLVideoElement;
        if (eventTargetNode) {
          eventTargetNode.removeEventListener('canplay', onCanPlay);
          eventTargetNode.play();
        }
        if (local) {
          self.localStreamStatusChanged.emit(stream);
        }
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

  public stopStreamInNode(node: ElementRef): void {
    node?.nativeElement?.pause();
    node?.nativeElement?.srcObject?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    if (node?.nativeElement?.srcObject) {
      node.nativeElement.srcObject = new MediaStream();
    }
  }

  public toggleMuteStream(stream: MediaStream | MediaStreamTrack, type: StreamType, value?: boolean): void {
    if (this.config.debug) {
      console.log('toggleMuteStream()', stream, type, value);
    }
    if (stream) {
      if (stream instanceof MediaStreamTrack) {
        const targetValue = typeof value !== 'undefined' ? value : !stream.enabled;
        stream.enabled = targetValue;
      } else {
        if (type === StreamType.Audio) {
          stream.getAudioTracks().forEach(track => {
            const targetValue = typeof value !== 'undefined' ? value : !track.enabled;
            track.enabled = targetValue;
            this.localAudioStreamStatusChanged.emit(targetValue);
          });
        }
        if (type === StreamType.Video) {
          stream.getVideoTracks().forEach(track => {
            const targetValue = typeof value !== 'undefined' ? value : !track.enabled;
            track.enabled = targetValue;
            this.localVideoStreamStatusChanged.emit(targetValue);
          });
        }
      }
    }
    this.localStreamStatusChanged.emit(stream);
  }

  public muteStream(stream: MediaStream | MediaStreamTrack, type: StreamType): void {
    this.toggleMuteStream(stream, type, false);
  }

  public unmuteStream(stream: MediaStream | MediaStreamTrack, type: StreamType): void {
    this.toggleMuteStream(stream, type, true);
  }

  public replaceTrackInStream(stream: MediaStream, track: MediaStreamTrack): void {
    if (track.kind === StreamType.Video) {
      stream?.getVideoTracks().forEach(e => stream.removeTrack(e));
    }
    if (track.kind === StreamType.Audio) {
      stream?.getAudioTracks().forEach(e => stream.removeTrack(e));
    }
    stream?.addTrack(track);
  }

  public setLocalStream(stream: MediaStream | null): void {
    this.localStream$.next(stream);
  }

  public getLocalStream(): MediaStream | null {
    return this.localStream$.getValue();
  }

  public replaceTrack(track: MediaStreamTrack): void {
    this.replaceTrack$.next(track);
  }

  public toggleMuteLocalAudioStream(): void {
    const stream = this.localStream$.getValue();
    if (stream) {
      this.toggleMuteStream(stream, StreamType.Audio);
    }
  }

  public muteLocalAudioStream(): void {
    const stream = this.localStream$.getValue();
    if (stream) {
      this.toggleMuteStream(stream, StreamType.Audio, false);
    }
  }

  public unmuteLocalAudioStream(): void {
    const stream = this.localStream$.getValue();
    if (stream) {
      this.toggleMuteStream(stream, StreamType.Audio, true);
    }
  }

  public toggleMuteLocalVideoStream(): void {
    const stream = this.localStream$.getValue();
    if (stream) {
      this.toggleMuteStream(stream, StreamType.Video);
    }
  }

  public muteLocalVideoStream(): void {
    const stream = this.localStream$.getValue();
    if (stream) {
      this.toggleMuteStream(stream, StreamType.Video, false);
    }
  }

  public unmuteLocalVideoStream(): void {
    const value = this.localStream$.getValue();
    if (value) {
      this.toggleMuteStream(value, StreamType.Video, true);
    }
  }

  async getScreenCapture(): Promise<MediaStream | null> {
    let stream: MediaStream | null = null;
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
      if (this.config.debug) {
        console.log(`MdoVideoCallComponent.getScreenCapture() -> no permissions`);
      }
    }
    return stream;
  }

  public getVideoTrackForStream(stream?: MediaStream): MediaStreamTrack | null {
    if (!stream && this.getLocalStream()) {
      stream = this.getLocalStream() as MediaStream;
    }
    return stream?.getVideoTracks()[0] || null;
  }

  public getAudioTrackForStream(stream?: MediaStream): MediaStreamTrack | null {
    if (!stream && this.getLocalStream()) {
      stream = this.getLocalStream() as MediaStream;
    }
    return stream?.getAudioTracks()[0] || null;
  }

  public getMediaDevices(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices();
  }

  public setAudioOutput(deviceId: string): void {
    this.audioOutput$.next(deviceId);
  }

  // TODO: refactor
  public tryGetUserMedia(mediaConstraints?: MediaStreamConstraints): Promise<MediaStream> {
    if (!mediaConstraints) {
      mediaConstraints = {
        audio: true,
        video: true
      }
    };

    return new Promise((resolve, reject) => {

      navigator.mediaDevices.getUserMedia(mediaConstraints).then(a => {
        this.hasAudio = true;
        this.hasVideo = true;
        resolve(a);
      }, b => {
        let cam = true, mic = true;
        if (b.message.indexOf('Starting videoinput failed') > -1) {
          if(this.config.debug) {
            console.log('videoinput used by another software');
          }
          cam = false;
        }
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          cam = cam && devices.find((device) => {
            return device.kind === 'videoinput';
          }) !== null;
          mic = devices.find((device) => {
            return device.kind === 'audioinput';
          }) !== null;
          const constraints = {
            video: cam && mediaConstraints?.video,
            audio: mic && mediaConstraints?.audio
          };
          navigator.mediaDevices.getUserMedia(constraints).then(a => {
            this.hasAudio = true;
            resolve(a);
          }, reject);
        }, (f) => {
          reject(f);
        });
      }).catch(e => {
        reject(e);
      });
    });
  }
}
