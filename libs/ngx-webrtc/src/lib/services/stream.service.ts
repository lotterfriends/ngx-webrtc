import { ElementRef, EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DeviceType } from '../enums';
import { StreamType } from "../enums/stream-type";
import { NgxWebrtConfiguration } from '../ngx-webrtc-configuration';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  /**
   * You can subscribe to localSteam changes
   */
  public localStream$ = new BehaviorSubject<MediaStream | null>(null);
  /**
   * You can subscribe to screen share changes
   */
  public localShareScreenStream$ = new BehaviorSubject<MediaStream | null>(null);

  /**
   * Emitted with new Track when `StreamService.replaceTrack` is called 
   */
  public replaceTrack$ = new BehaviorSubject<MediaStreamTrack | null>(null);

  /**
   * Emitted when `StreamService.setAudioOutput` is called with new device (Call it when the switch the audio device).
   */
  public audioOutput$ = new BehaviorSubject<string | null>(null);

  /**
   * Emitted when the status of the local stream changed e.g. audio or video disabled or enabled.
   */
  public localStreamStatusChanged = new EventEmitter<MediaStream | MediaStreamTrack>();

  /**
   * Emitted when the status of the local audio stream changed e.g. audio disabled or enabled.
   */
  public localAudioStreamStatusChanged = new EventEmitter<boolean>();

  /**
   * Emitted when the status of the local video stream changed e.g. video disabled or enabled.
   */
  public localVideoStreamStatusChanged = new EventEmitter<boolean>();

  /**
   * Set to `true` when the StreamService.tryGetUserMedia is succefull for video (camera).
   */
  public hasVideo = false;

  /**
   * Set to `true` when the StreamService.tryGetUserMedia is succefull for audio (microphone).
   */
  public hasAudio = false;

  constructor(
    private readonly config: NgxWebrtConfiguration
  ){}


  /**
   * Get aspect ratio for given width and height.
   * @param width width in pixel
   * @param height height in pixel
   * @returns aspect ratio for the given width and height
   */
  public static getAspectRatio(width: number, height: number): string {

    function gcd(a: number, b: number): number {
      return b ? gcd(b, a % b) : a;
    }

    const divisor: number = gcd(width, height);
    return `${width / divisor}x${height / divisor}`;
  }

  /**
   * 
   * @param node `HTMLVideoElement` or `HTMLAudioElement` that should play the stream.
   * @param stream stream to set in node 
   * @param muted mute audio
   * @param local if set to `true` `localStreamStatusChanged` is emitted on play
   */
  public setStreamInNode(node: HTMLVideoElement | HTMLAudioElement, stream: MediaStream | MediaStreamTrack, muted = true, local = false): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
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

  /**
   * stop stream playing in node
   * @param node node with nativeElement type `HTMLVideoElement` or  `HTMLAudioElement`
   */
  public stopStreamInNode(node: ElementRef): void {
    node?.nativeElement?.pause();
    node?.nativeElement?.srcObject?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    if (node?.nativeElement?.srcObject) {
      node.nativeElement.srcObject = new MediaStream();
    }
  }

  /**
   * set stream or track mute state or toggle mute
   * @param stream stream or track
   * @param type stream or track type
   * @param value enforce `true` or `false`
   */
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

  /**
   * Mute stream in node.
   * @param stream stram or track
   * @param type stream or track type
   */
  public muteStream(stream: MediaStream | MediaStreamTrack, type: StreamType): void {
    this.toggleMuteStream(stream, type, false);
  }

  /**
   * Unmute stream in node.
   * @param stream stram or track
   * @param type stream or track type
   */
  public unmuteStream(stream: MediaStream | MediaStreamTrack, type: StreamType): void {
    this.toggleMuteStream(stream, type, true);
  }

  /**
   * replace a track in stream
   * @param stream stream with thre track to replace
   * @param track new track
   */
  public replaceTrackInStream(stream: MediaStream, track: MediaStreamTrack): void {
    if (track.kind === StreamType.Video) {
      stream?.getVideoTracks().forEach(e => stream.removeTrack(e));
    }
    if (track.kind === StreamType.Audio) {
      stream?.getAudioTracks().forEach(e => stream.removeTrack(e));
    }
    stream?.addTrack(track);
  }

  /**
   * set local stream in service state
   * @param stream stream to set
   */
  public setLocalStream(stream: MediaStream | null): void {
    this.localStream$.next(stream);
  }

  /**
   * get current state value of local stream
   * @returns current local stream
   */
  public getLocalStream(): MediaStream | null {
    return this.localStream$.getValue();
  }

  /**
   * set replace track service state. You can subscribe to `StreamService.replaceTrack$` to update the track somewhere.
   * @param track new track
   */
  public replaceTrack(track: MediaStreamTrack): void {
    this.replaceTrack$.next(track);
  }

  /**
   * toggle mute audio of local stream
   */
  public toggleMuteLocalAudioStream(): void {
    const stream = this.localStream$.getValue();
    if (stream) {
      this.toggleMuteStream(stream, StreamType.Audio);
    }
  }

  /**
   * mute local audio stream
   */
  public muteLocalAudioStream(): void {
    const stream = this.localStream$.getValue();
    if (stream) {
      this.toggleMuteStream(stream, StreamType.Audio, false);
    }
  }

  /**
   * unmute local audio stream
   */
  public unmuteLocalAudioStream(): void {
    const stream = this.localStream$.getValue();
    if (stream) {
      this.toggleMuteStream(stream, StreamType.Audio, true);
    }
  }

  /**
   * toggle mute local video stream
   */
  public toggleMuteLocalVideoStream(): void {
    const stream = this.localStream$.getValue();
    if (stream) {
      this.toggleMuteStream(stream, StreamType.Video);
    }
  }

  /**
   * mute local video stream
   */
  public muteLocalVideoStream(): void {
    const stream = this.localStream$.getValue();
    if (stream) {
      this.toggleMuteStream(stream, StreamType.Video, false);
    }
  }

  /**
   * unmute local video stream
   */
  public unmuteLocalVideoStream(): void {
    const value = this.localStream$.getValue();
    if (value) {
      this.toggleMuteStream(value, StreamType.Video, true);
    }
  }

  /**
   * get screen or window as stream
   * @returns MediaStram of desktop or display
   */
  public async getScreenCapture(): Promise<MediaStream | null> {
    let stream: MediaStream | null = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  /**
   * get first/single video track of the given stream
   * @param stream stream with video treack
   * @returns first video track of stream
   */
  public getVideoTrackForStream(stream?: MediaStream): MediaStreamTrack | null {
    if (!stream && this.getLocalStream()) {
      stream = this.getLocalStream() as MediaStream;
    }
    return stream?.getVideoTracks()[0] || null;
  }

  /**
   * get first/single audio track of the given stream
   * @param stream stream with audio treack
   * @returns first audio track of stream
   */
  public getAudioTrackForStream(stream?: MediaStream): MediaStreamTrack | null {
    if (!stream && this.getLocalStream()) {
      stream = this.getLocalStream() as MediaStream;
    }
    return stream?.getAudioTracks()[0] || null;
  }

  /**
   * get media devices, Attention you need getMedia permissions for this call
   * @returns Promise that resolves to media Devices as array 
   */
  public getMediaDevices(): Promise<MediaDeviceInfo[]> {
    return navigator.mediaDevices.enumerateDevices();
  }

  /**
   * set current audio device in service state. You can subscribe to `StreamService.audioOutput$` to get changes.
   * @param deviceId 
   */
  public setAudioOutput(deviceId: string): void {
    this.audioOutput$.next(deviceId);
  }

  // TODO: refactor
  /**
   * An simple wrapper for `navigator.mediaDevices.getUserMedia`, with basis error handling.
   * @todo refactor
   * @param mediaConstraints a MediaStreamConstraints e.g. with specific deviceId, resolution or just audio. Default is:
   *                          ```json
   *                         {
   *                             audio: true,
   *                             video: true
   *                         }
   *                         ```
   * @returns Promise that resilve to a stream matching the constraint
   */
  public tryGetUserMedia(mediaConstraints?: MediaStreamConstraints): Promise<MediaStream> {
    // reset state
    this.hasAudio = false;
    this.hasVideo = false;

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
