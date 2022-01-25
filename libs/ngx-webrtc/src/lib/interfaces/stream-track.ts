import { StreamType } from '../enums/stream-type';


export interface StreamTrack {
  track: MediaStreamTrack;
  kind: StreamType;
}
