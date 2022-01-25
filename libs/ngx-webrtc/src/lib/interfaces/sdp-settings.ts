
export interface SdpSettings {
  audioSendCodec?: string;
  videoSendCodec?: string;
  videoRecvCodec?: string;
  audioRecvCodec?: string;
  videoFec?: boolean;
  opusStereo?: boolean;
  opusFec?: boolean;
  opusDtx?: boolean;
  opusMaxPbr?: string | number;
  audioSendBitrate?: string | number;
  videoSendInitialBitrate?: string | number;
  videoSendBitrate?: string | number;
  audioRecvBitrate?: string | number;
  videoRecvBitrate?: string | number;
}
