
export enum PeerConnectionClientSignalMessageType {
  Candidate = 'candidate',
  Answer = 'answer',
  Offer = 'offer',
  Bye = 'bye',
  RequestMuteAudio = 'request-mute-audio',
  RequestMuteVideo = 'request-mute-video',
  AudioMuted = 'audio-muted',
  AudioUnmuted = 'audio-unmuted',
  VideoMuted = 'video-muted',
  VideoUnmuted = 'video-unmuted',
  StartShareScreen = 'start-share-screen',
  StopShareScreen = 'stop-share-screen'
}
