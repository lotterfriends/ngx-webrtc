import { ElementRef, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StreamService {

  constructor() { }

  public setStream(node: HTMLVideoElement, stream: MediaStream | MediaStreamTrack, muted = true) {
    if (node) {

      // play when ready
      node.addEventListener('canplay', function onCanPlay(event) {
        const video: HTMLVideoElement = event.target as HTMLVideoElement;
        if (video) {
          video.removeEventListener('canplay', onCanPlay);
          video.play();
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

  public stopStream(node: ElementRef) {
    node?.nativeElement?.pause();
    node?.nativeElement?.srcObject?.getTracks().forEach((t: MediaStreamTrack) => t.stop());
    if (node?.nativeElement?.srcObject) {
      node.nativeElement.srcObject = new MediaStream()
    } 
  }
}
