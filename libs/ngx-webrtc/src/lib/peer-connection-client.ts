import { EventEmitter } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PeerConnectionClientSettings } from './interfaces/peer-connection-client-settings';
import { PeerConnectionClientSignalMessage } from './interfaces/peer-connection-client-signal-message';
import { PeerConnectionClientSignalMessageType } from './enums/peer-connection-client-signal-message-type';
import { SdpUtils } from './sdp-utils';
import { StreamTrack } from './interfaces/stream-track';
import { StreamType } from './enums/stream-type';

export class PeerConnectionClient {

  private startTime: number;
  private started = false;
  private isInitiator = false;
  private hasRemoteSdp = false;
  private messageQueue: PeerConnectionClientSignalMessage[] = [];
  private connection: RTCPeerConnection | null;
  private settings: PeerConnectionClientSettings;
  private isNegotiating = false;
  private id = this.getRandom(6);
  private readonly DEFAULT_SDP_OFFER_OPTIONS: RTCOfferOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: true,
  };
  /**
   * messages send by the peer connection
   */
  public signalingMessage = new EventEmitter<PeerConnectionClientSignalMessage>();
  /**
   * triggered when new candidate is available initial value is `null`
   */
  public seeNewCandidate$ = new BehaviorSubject<{location: string, candidate: string} | null>(null);
  /**
   * triggered when a remote stream is added
   */
  public remoteStreamAdded = new EventEmitter<StreamTrack>();
  /**
   * triggered when the `RTCSignalingState` is changed inital value is `null`
   */
  public signalState$ = new BehaviorSubject<RTCSignalingState | null>(null);
  /**
   * triggered if an error occure inital value is `null`
   */
  public error$ = new BehaviorSubject<{source: string, error?: Error} | null>(null);
  /**
   * triggered when the connected user toggle share screen, inital value is `false`
   */
  public useShareScreen$ = new BehaviorSubject<boolean>(false);
  /**
   * triggered when remote description is set, inital value is `null`
   */
  public remotesDescriptionSet = new BehaviorSubject<MediaStreamTrack | null>(null);
  /**
   * triggered when connected user close connection
   */
  public remoteHangUp = new EventEmitter<void>();
  /**
   * triggered when the connected user asks for mute user audio
   */
  public muteMyAudio = new EventEmitter<void>();
  /**
   * triggered when the connected user asks for mute user video
   */
  public muteMyVideo = new EventEmitter<void>();
  /**
   * triggered when the connected user mutes his video
   */
  public userMuteVideo = new EventEmitter<void>();
  /**
   * triggered when the connected user unmutes his video
   */
  public userUnmuteVideo = new EventEmitter<void>();
  /**
   * triggered when the connected user mutes his audio
   */
  public userMuteAudio = new EventEmitter<void>();
  /**
   * triggered when the connected user unmutes his audio
   */
  public userUnmuteAudio = new EventEmitter<void>();
  /**
   * triggerd on need negotiation
   */
  public negotiationNeededTriggered = new Subject<boolean>();
  /**
   * triggered on I see connection state changed, inital value is `null`
   */
  public iceConnectionState$ = new BehaviorSubject<RTCIceConnectionState| null>(null);

  constructor(settings: PeerConnectionClientSettings) {
    this.startTime = performance.now();
    this.settings = settings;
    this.log(this.settings.peerConnectionConfig);
    this.connection = new RTCPeerConnection(this.settings.peerConnectionConfig);
    this.connection.onicecandidate = this.onIceCandidate.bind(this);
    this.connection.ontrack = this.onRemoteStreamAdded.bind(this);
    this.connection.onsignalingstatechange = this.onSignalingStateChange.bind(this);
    this.connection.oniceconnectionstatechange = this.onIceConnectionStateChange.bind(this);
    this.connection.onnegotiationneeded = this.onnegotiationneeded.bind(this);
  }

  /**
   * Start Peer connection as caller
   * @link https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
   * @param offerOptions options for the connection 
   * 
   * @returns `true` when offer is made `false` if no connection available or the connection is already open
   */
  public startAsCaller(offerOptions: RTCOfferOptions = {}): boolean {
    this.log('startAsCaller', offerOptions);

    if (!this.connection) {
      return false;
    }

    if (this.started) {
      return false;
    }

    this.isInitiator = true;
    this.started = true;

    const constraints: RTCOfferOptions = {...this.DEFAULT_SDP_OFFER_OPTIONS, ...offerOptions};
    this.log('Sending offer to peer, with constraints: \n\'' + JSON.stringify(constraints) + '\'.');

    this.connection.createOffer(constraints)
        .then(this.setLocalSdpAndNotify.bind(this))
        .catch(this.onError.bind(this, 'createOffer'));

    return true;
  }

  /**
   * Start Peer connection as callee
   * @param initialMessages messages that are collected before the `PeerConnectionClient` instance is created
   * @returns `true` when messages are queed or processed `false` if no connection available or the connection is already open
   */
  public startAsCallee(initialMessages?: string[] | PeerConnectionClientSignalMessage[]): boolean {
    this.log('startAsCallee', initialMessages);
    if (!this.connection) {
      this.error('startAsCallee()', 'no connection');
      return false;
    }

    if (this.started) {
      this.error('startAsCallee()', 'not started');
      return false;
    }

    this.started = true;

    if (initialMessages && initialMessages.length > 0) {
      // Convert received messages to JSON objects and add them to the message
      // queue.
      for (const message of initialMessages) {
        this.receiveSignalingMessage(message);
      }
      return true;
    }

    // We may have queued messages received from the signaling channel before
    // started.
    if (this.messageQueue.length > 0) {
      this.drainMessageQueue();
    }
    return true;
  }

  /**
   * send `PeerConnectionClientSignalMessageType.Bye` message to connected user and close the open connection 
   */
  public close(): void {
    this.log('close');
    if (!this.connection) {
      return;
    }
    this.signalingMessage.emit({
      type: PeerConnectionClientSignalMessageType.Bye
    });
    this.connection.close();
    this.connection = null;
  }

  /**
   * send `PeerConnectionClientSignalMessageType.AudioMuted` message to connected user
   */
  public audioMuted(): void {
    if (!this.connection) {
      return;
    }
    this.signalingMessage.emit({
      type: PeerConnectionClientSignalMessageType.AudioMuted
    });
  }

  /**
   * send `PeerConnectionClientSignalMessageType.AudioUnmuted` message to connected user
   */
  public audioUnmuted(): void {
    if (!this.connection) {
      return;
    }
    this.signalingMessage.emit({
      type: PeerConnectionClientSignalMessageType.AudioUnmuted
    });
  }

  /**
   * send `PeerConnectionClientSignalMessageType.VideoMuted` message to connected user
   */
  public videoMuted(): void {
    if (!this.connection) {
      return;
    }
    this.signalingMessage.emit({
      type: PeerConnectionClientSignalMessageType.VideoMuted
    });
  }

  /**
   * send `PeerConnectionClientSignalMessageType.VideoUnmuted` message to connected user
   */
  public videoUnmuted(): void {
    if (!this.connection) {
      return;
    }
    this.signalingMessage.emit({
      type: PeerConnectionClientSignalMessageType.VideoUnmuted
    });
  }

  /**
   * send `PeerConnectionClientSignalMessageType.RequestMuteAudio` message to connected user
   */
  public requestMuteAudio(): void {
    this.log('requestMuteAudio');
    if (!this.connection) {
      return;
    }
    this.signalingMessage.emit({
      type: PeerConnectionClientSignalMessageType.RequestMuteAudio
    });
  }

  /**
   * send `PeerConnectionClientSignalMessageType.RequestMuteVideo` message to connected user
   */
  public requestMuteVideo(): void {
    this.log('requestMuteVideo');
    if (!this.connection) {
      return;
    }
    this.signalingMessage.emit({
      type: PeerConnectionClientSignalMessageType.RequestMuteVideo
    });
  }

  /**
   * send `PeerConnectionClientSignalMessageType.StartShareScreen` message to connected user
   */
  public startShareScreen(): void {
    this.log('startShareScreen');
    if (!this.connection) {
      return;
    }
    this.signalingMessage.emit({
      type: PeerConnectionClientSignalMessageType.StartShareScreen
    });
  }

  /**
   * send `PeerConnectionClientSignalMessageType.StopShareScreen` message to connected user
   */
  public stopShareScreen(): void {
    this.log('startShareScreen');
    if (!this.connection) {
      return;
    }
    this.signalingMessage.emit({
      type: PeerConnectionClientSignalMessageType.StopShareScreen
    });
  }

  /**
   * get peer connection state
   * @returns `null` if not connected otherwiese an object of `RTCSignalingState`, `RTCIceGatheringState` and `RTCIceConnectionState`
   */
  public getPeerConnectionStates(): {
    signalingState: RTCSignalingState,
    iceGatheringState: RTCIceGatheringState,
    iceConnectionState: RTCIceConnectionState
  } | null {
    if (!this.connection) {
      return null;
    }
    return {
      signalingState: this.connection.signalingState,
      iceGatheringState: this.connection.iceGatheringState,
      iceConnectionState: this.connection.iceConnectionState
    };
  }

  /**
   * get the connection stats of a track in the connection 
   * @param track `MediaStreamTrack` to check state for
   * @returns Promise that resolves to `RTCStatsReport`
   */
  public getPeerConnectionStats(track?: MediaStreamTrack): Promise<RTCStatsReport> {
    if (!this.connection) {
      return Promise.reject();
    }
    return this.connection.getStats(track);
  }

  /**
   * add a `MediaStreamTrack` to the connection
   * @param track `MediaStreamTrack` to be added to the connection.
   */
  public addTrack(track: MediaStreamTrack): void {
    this.log('addTrack', track);
    if (this.connection) {
      this.connection.addTrack(track);
    }
  }

  /**
   * replace current `MediaStreamTrack` with new from parameter
   * @param track new `MediaStreamTrack`
   */
  public replaceTrack(track: MediaStreamTrack): void {
    this.log(track);
    if (this.connection) {
      const sender = this.connection.getSenders().find((s) => {
        return s?.track?.kind === track.kind;
      });
      if (sender) {
        sender.replaceTrack(track);
      }
    }
  }

  /**
   * Add all `MediaStreamTrack`s of a `MediaStream` to the connection
   * @param mediaSteam `MediaStream` with tracks
   */
  public addStream(mediaSteam: MediaStream): void {
    mediaSteam.getTracks().forEach(track => {
      this.addTrack(track);
    });
  }

  private setLocalSdpAndNotify(sessionDescription: RTCSessionDescriptionInit): void {
    if (!this.connection) {
      return;
    }
    // this.log('setLocalSdpAndNotify', sessionDescription);
    if (sessionDescription.sdp) {
      sessionDescription.sdp = SdpUtils.maybeSetOpusOptions(sessionDescription.sdp, this.settings);
      sessionDescription.sdp = SdpUtils.maybePreferAudioReceiveCodec(sessionDescription.sdp, this.settings);
      sessionDescription.sdp = SdpUtils.maybePreferVideoReceiveCodec(sessionDescription.sdp, this.settings);
      sessionDescription.sdp = SdpUtils.maybeSetAudioReceiveBitRate(sessionDescription.sdp, this.settings);
      sessionDescription.sdp = SdpUtils.maybeSetVideoReceiveBitRate(sessionDescription.sdp, this.settings);
      sessionDescription.sdp = SdpUtils.maybeRemoveVideoFec(sessionDescription.sdp, this.settings);
    }
    this.connection.setLocalDescription(sessionDescription)
        .then(() => this.log('Set session description success.'))
        .catch(this.onError.bind(this, 'setLocalDescription'));

    // Chrome version of RTCSessionDescription can't be serialized directly
    // because it JSON.stringify won't include attributes which are on the
    // object's prototype chain. By creating the message to serialize
    // explicitly we can avoid the issue.
    this.signalingMessage.emit({
      sdp: sessionDescription.sdp,
      type: sessionDescription.type
    });
  }

  private filterIceCandidate(candidateObj: RTCIceCandidate): boolean {
    // this.log('filterIceCandidate', candidateObj);
    const candidateStr = candidateObj.candidate;

    // Always remove TCP candidates. Not needed in this context.
    if (candidateStr.indexOf('tcp') !== -1) {
      return false;
    }

    // If we're trying to remove non-relay candidates, do that.
    if (this.settings.peerConnectionConfig.iceTransports === 'relay' && SdpUtils.iceCandidateType(candidateStr) !== 'relay') {
      return false;
    }

    return true;
  }

  private onIceCandidate(event: RTCPeerConnectionIceEvent): void {
    // this.log('onIceCandidate', event);
    if (event.candidate) {
      // Eat undesired candidates.
      if (this.filterIceCandidate(event.candidate)) {
        const message = {
          type: PeerConnectionClientSignalMessageType.Candidate,
          label: event.candidate.sdpMLineIndex,
          id: event.candidate.sdpMid,
          candidate: event.candidate.candidate
        };
        this.signalingMessage.emit(message);
        this.onRecordIceCandidate('Local', event.candidate);
      }
    } else {
      this.log('End of candidates.');
    }
  }


  private handleMessageEvents(messageObj: PeerConnectionClientSignalMessage): void {
    if (messageObj.type === PeerConnectionClientSignalMessageType.Bye) {
      this.remoteHangUp.emit();
    } else if (messageObj.type === PeerConnectionClientSignalMessageType.RequestMuteAudio) {
      this.muteMyAudio.emit();
    } else if (messageObj.type === PeerConnectionClientSignalMessageType.RequestMuteVideo) {
      this.muteMyVideo.emit();
    } else if (messageObj.type === PeerConnectionClientSignalMessageType.AudioMuted) {
      this.userMuteAudio.emit();
    } else if (messageObj.type === PeerConnectionClientSignalMessageType.AudioUnmuted) {
      this.userUnmuteAudio.emit();
    } else if (messageObj.type === PeerConnectionClientSignalMessageType.VideoMuted) {
      this.userMuteVideo.emit();
    }  else if (messageObj.type === PeerConnectionClientSignalMessageType.VideoUnmuted) {
      this.userUnmuteVideo.emit();
    } else if (messageObj.type === PeerConnectionClientSignalMessageType.StartShareScreen) {
      this.useShareScreen$.next(true);
    } else if (messageObj.type === PeerConnectionClientSignalMessageType.StopShareScreen) {
      this.useShareScreen$.next(false);
    }
  }

  /**
   * execute this methode to set messages in the peer connection. You need a connection lay to receive messages.
   * @param message message to process
   */
  public receiveSignalingMessage(message: string | PeerConnectionClientSignalMessage): void {
    this.log('receiveSignalingMessage', message);
    let messageObj: PeerConnectionClientSignalMessage;
    if (typeof message === 'string') {
      try {
        messageObj = JSON.parse(message);
      } catch (error) {
        this.log('invalid json for message', message);
        return;
      }
    } else {
      messageObj = message;
    }

    if ((this.isInitiator && messageObj.type === PeerConnectionClientSignalMessageType.Answer) ||
        (!this.isInitiator && messageObj.type === PeerConnectionClientSignalMessageType.Offer)) {
      this.hasRemoteSdp = true;
      // Always process offer before candidates.
      this.messageQueue.unshift(messageObj);
    }
    if (messageObj.type === PeerConnectionClientSignalMessageType.Candidate) {
      this.messageQueue.push(messageObj);
    }
    this.handleMessageEvents(messageObj);
    this.drainMessageQueue();
  }


  private processSignalingMessage(message: PeerConnectionClientSignalMessage): void {
    this.log('processSignalingMessage', message);
    if (!this.connection) {
      return;
    }
    this.handleMessageEvents(message);
    if (message.type === PeerConnectionClientSignalMessageType.Offer && !this.isInitiator) {
      if (this.connection.signalingState !== 'stable') {
        this.log('ERROR: remote offer received in unexpected state: ' + this.connection.signalingState);
        return;
      }
      this.setRemoteSdp(message);
      this.doAnswer();
    } else if (message.type === PeerConnectionClientSignalMessageType.Answer && this.isInitiator) {
      if (this.connection.signalingState !== 'have-local-offer') {
        this.log('ERROR: remote answer received in unexpected state: ' +
              this.connection.signalingState);
        return;
      }
      this.setRemoteSdp(message);
    } else if (message.type === PeerConnectionClientSignalMessageType.Candidate) {
      const candidate = new RTCIceCandidate({
        sdpMLineIndex: message.label,
        candidate: message.candidate
      });
      this.onRecordIceCandidate('Remote', candidate);
      this.connection.addIceCandidate(candidate)
          .then(this.log.bind(this, 'Remote candidate added successfully.'))
          .catch(this.onError.bind(this, 'addIceCandidate'));
    } else {
      this.log('WARNING: unexpected message: ' + JSON.stringify(message));
    }
  }

  private doAnswer(): void {
    if (!this.connection) {
      return;
    }
    this.log('Sending answer to peer.');
    this.connection.createAnswer()
        .then(this.setLocalSdpAndNotify.bind(this))
        .catch(this.onError.bind(this, 'createAnswer'));
  }


  private setRemoteSdp(message: PeerConnectionClientSignalMessage): void {
    if (!this.connection) {
      return;
    }
    // this.log('setRemoteSdp', message);
    if (message.sdp) {
      message.sdp = SdpUtils.maybeSetOpusOptions(message.sdp, this.settings);
      message.sdp = SdpUtils.maybePreferAudioSendCodec(message.sdp, this.settings);
      message.sdp = SdpUtils.maybePreferVideoSendCodec(message.sdp, this.settings);
      message.sdp = SdpUtils.maybeSetAudioSendBitRate(message.sdp, this.settings);
      message.sdp = SdpUtils.maybeSetVideoSendBitRate(message.sdp, this.settings);
      message.sdp = SdpUtils.maybeSetVideoSendInitialBitRate(message.sdp, this.settings);
      message.sdp = SdpUtils.maybeRemoveVideoFec(message.sdp, this.settings);
    }
    this.connection.setRemoteDescription(new RTCSessionDescription(message as RTCSessionDescriptionInit))
        .then(this.onSetRemoteDescriptionSuccess.bind(this))
        .catch(this.onError.bind(this, 'setRemoteDescription'));
  }

  // When we receive messages from GAE registration and from the WSS connection,
  // we add them to a queue and drain it if conditions are right.
  private drainMessageQueue(): void {
    // It's possible that we finish registering and receiving messages from WSS
    // before our peer connection is created or started. We need to wait for the
    // peer connection to be created and started before processing messages.
    //
    // Also, the order of messages is in general not the same as the POST order
    // from the other client because the POSTs are async and the server may handle
    // some requests faster than others. We need to process offer before
    // candidates so we wait for the offer to arrive first if we're answering.
    // Offers are added to the front of the queue.
    if (!this.connection || !this.started || !this.hasRemoteSdp) {
      return;
    }
    for (const message of this.messageQueue) {
      this.processSignalingMessage(message);
    }
    this.messageQueue = [];
  }


  // Hooks

  private onIceConnectionStateChange(): void {
    if (!this.connection) {
      return;
    }
    this.log('ICE connection state changed to: ' + this.connection.iceConnectionState);

    if (this.connection.iceConnectionState === 'completed') {
      this.log('ICE complete time: ' +
          (window.performance.now() - this.startTime).toFixed(0) + 'ms.');
    }

    this.iceConnectionState$.next(this.connection.iceConnectionState);
  }

  private onnegotiationneeded(): void {
    if (!this.connection) {
      return;
    }
    this.log('onnegotiationneeded');
    this.negotiationNeededTriggered.next(true);

  }

  private onSignalingStateChange(): void {
    if (!this.connection) {
      return;
    }
    this.isNegotiating = (this.connection.signalingState !== 'stable');
    this.log('Signaling state changed to: ' + this.connection.signalingState);
    this.signalState$.next(this.connection.signalingState);
  }

  private onError(source: string, error?: Error): void {
    this.log(`${source}:`, error);
    this.error$.next({source, error});
  }

  private onRecordIceCandidate(location: string, candidateObj: RTCPeerConnectionIceEvent['candidate']): void {
    if (candidateObj?.candidate) {
      this.seeNewCandidate$.next({location, candidate: candidateObj.candidate});
    } else {
      this.log('see new candidate but candidate is null', {location, candidate: candidateObj});
    }
  }

  private onRemoteStreamAdded(event: RTCTrackEvent): void {
    this.remoteStreamAdded.emit({
      track: event.track,
      kind: event.track.kind as StreamType
    });
  }

  private onSetRemoteDescriptionSuccess(): void {
    if (!this.connection) {
      return;
    }
    this.log('Set remote session description success.');
    // By now all onaddstream events for the setRemoteDescription have fired,
    // so we can know if the peer has any remote video streams that we need
    // to wait for. Otherwise, transition immediately to the active state.
    const remoteStreams = this.connection.getReceivers();
    if (remoteStreams.length) {
      for (const stream of remoteStreams) {
        this.remotesDescriptionSet.next(stream.track);
      }
    }
  }

  private log(...args: any[]): void {
    if (this.settings.debug) {
      console.log(this.id, ...args);
    }
  }

  private error(...args: any[]): void {
    if (this.settings.debug) {
      console.error(this.id, ...args);
    }
  }

  private getRandom(size: number): string {
    return `${Math.round(Math.random() * parseInt(`1${(1e15 + 0 + '').slice(-size)}`, 10))}`;
  }

}
