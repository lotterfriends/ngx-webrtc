[ngx-webrtc](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/README.md) / [Exports](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/modules.md) / PeerConnectionClient

# Class: PeerConnectionClient

## Table of contents

### Constructors

- [constructor](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#constructor)

### Properties

- [DEFAULT\_SDP\_OFFER\_OPTIONS](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#default_sdp_offer_options)
- [connection](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#connection)
- [error$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#error$)
- [hasRemoteSdp](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#hasremotesdp)
- [iceConnectionState$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#iceconnectionstate$)
- [id](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#id)
- [isInitiator](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#isinitiator)
- [isNegotiating](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#isnegotiating)
- [messageQueue](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#messagequeue)
- [muteMyAudio](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#mutemyaudio)
- [muteMyVideo](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#mutemyvideo)
- [negotiationNeededTriggered](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#negotiationneededtriggered)
- [remoteHangUp](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#remotehangup)
- [remoteStreamAdded](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#remotestreamadded)
- [remotesDescriptionSet](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#remotesdescriptionset)
- [seeNewCandidate$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#seenewcandidate$)
- [settings](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#settings)
- [signalState$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#signalstate$)
- [signalingMessage](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#signalingmessage)
- [startTime](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#starttime)
- [started](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#started)
- [useShareScreen$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#usesharescreen$)
- [userMuteAudio](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#usermuteaudio)
- [userMuteVideo](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#usermutevideo)
- [userUnmuteAudio](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#userunmuteaudio)
- [userUnmuteVideo](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#userunmutevideo)

### Methods

- [addStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#addstream)
- [addTrack](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#addtrack)
- [audioMuted](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#audiomuted)
- [audioUnmuted](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#audiounmuted)
- [close](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#close)
- [doAnswer](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#doanswer)
- [drainMessageQueue](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#drainmessagequeue)
- [error](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#error)
- [filterIceCandidate](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#filtericecandidate)
- [getPeerConnectionStates](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#getpeerconnectionstates)
- [getPeerConnectionStats](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#getpeerconnectionstats)
- [handleMessageEvents](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#handlemessageevents)
- [log](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#log)
- [onError](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#onerror)
- [onIceCandidate](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#onicecandidate)
- [onIceConnectionStateChange](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#oniceconnectionstatechange)
- [onRecordIceCandidate](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#onrecordicecandidate)
- [onRemoteStreamAdded](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#onremotestreamadded)
- [onSetRemoteDescriptionSuccess](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#onsetremotedescriptionsuccess)
- [onSignalingStateChange](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#onsignalingstatechange)
- [onnegotiationneeded](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#onnegotiationneeded)
- [processSignalingMessage](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#processsignalingmessage)
- [receiveSignalingMessage](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#receivesignalingmessage)
- [replaceTrack](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#replacetrack)
- [requestMuteAudio](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#requestmuteaudio)
- [requestMuteVideo](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#requestmutevideo)
- [setLocalSdpAndNotify](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#setlocalsdpandnotify)
- [setRemoteSdp](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#setremotesdp)
- [startAsCallee](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#startascallee)
- [startAsCaller](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#startascaller)
- [startShareScreen](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#startsharescreen)
- [stopShareScreen](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#stopsharescreen)
- [videoMuted](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#videomuted)
- [videoUnmuted](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/PeerConnectionClient.md#videounmuted)

## Constructors

### constructor

• **new PeerConnectionClient**(`settings`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `settings` | [`PeerConnectionClientSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSettings.md) |

#### Defined in

[lib/peer-connection-client.ts:91](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L91)

## Properties

### DEFAULT\_SDP\_OFFER\_OPTIONS

• `Private` `Readonly` **DEFAULT\_SDP\_OFFER\_OPTIONS**: `RTCOfferOptions`

#### Defined in

[lib/peer-connection-client.ts:22](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L22)

___

### connection

• `Private` **connection**: ``null`` \| `RTCPeerConnection`

#### Defined in

[lib/peer-connection-client.ts:18](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L18)

___

### error$

• **error$**: `BehaviorSubject`<``null`` \| { `error?`: `Error` ; `source`: `string`  }\>

triggered if an error occure inital value is `null`

#### Defined in

[lib/peer-connection-client.ts:45](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L45)

___

### hasRemoteSdp

• `Private` **hasRemoteSdp**: `boolean` = `false`

#### Defined in

[lib/peer-connection-client.ts:16](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L16)

___

### iceConnectionState$

• **iceConnectionState$**: `BehaviorSubject`<``null`` \| `RTCIceConnectionState`\>

triggered on I see connection state changed, inital value is `null`

#### Defined in

[lib/peer-connection-client.ts:89](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L89)

___

### id

• `Private` **id**: `string`

#### Defined in

[lib/peer-connection-client.ts:21](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L21)

___

### isInitiator

• `Private` **isInitiator**: `boolean` = `false`

#### Defined in

[lib/peer-connection-client.ts:15](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L15)

___

### isNegotiating

• `Private` **isNegotiating**: `boolean` = `false`

#### Defined in

[lib/peer-connection-client.ts:20](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L20)

___

### messageQueue

• `Private` **messageQueue**: [`PeerConnectionClientSignalMessage`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSignalMessage.md)[] = `[]`

#### Defined in

[lib/peer-connection-client.ts:17](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L17)

___

### muteMyAudio

• **muteMyAudio**: `EventEmitter`<`void`\>

triggered when the connected user asks for mute user audio

#### Defined in

[lib/peer-connection-client.ts:61](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L61)

___

### muteMyVideo

• **muteMyVideo**: `EventEmitter`<`void`\>

triggered when the connected user asks for mute user video

#### Defined in

[lib/peer-connection-client.ts:65](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L65)

___

### negotiationNeededTriggered

• **negotiationNeededTriggered**: `Subject`<`boolean`\>

triggerd on need negotiation

#### Defined in

[lib/peer-connection-client.ts:85](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L85)

___

### remoteHangUp

• **remoteHangUp**: `EventEmitter`<`void`\>

triggered when connected user close connection

#### Defined in

[lib/peer-connection-client.ts:57](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L57)

___

### remoteStreamAdded

• **remoteStreamAdded**: `EventEmitter`<[`StreamTrack`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/StreamTrack.md)\>

triggered when a remote stream is added

#### Defined in

[lib/peer-connection-client.ts:37](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L37)

___

### remotesDescriptionSet

• **remotesDescriptionSet**: `BehaviorSubject`<``null`` \| `MediaStreamTrack`\>

triggered when remote description is set, inital value is `null`

#### Defined in

[lib/peer-connection-client.ts:53](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L53)

___

### seeNewCandidate$

• **seeNewCandidate$**: `BehaviorSubject`<``null`` \| { `candidate`: `string` ; `location`: `string`  }\>

triggered when new candidate is available initial value is `null`

#### Defined in

[lib/peer-connection-client.ts:33](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L33)

___

### settings

• `Private` **settings**: [`PeerConnectionClientSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSettings.md)

#### Defined in

[lib/peer-connection-client.ts:19](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L19)

___

### signalState$

• **signalState$**: `BehaviorSubject`<``null`` \| `RTCSignalingState`\>

triggered when the `RTCSignalingState` is changed inital value is `null`

#### Defined in

[lib/peer-connection-client.ts:41](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L41)

___

### signalingMessage

• **signalingMessage**: `EventEmitter`<[`PeerConnectionClientSignalMessage`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSignalMessage.md)\>

messages send by the peer connection

#### Defined in

[lib/peer-connection-client.ts:29](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L29)

___

### startTime

• `Private` **startTime**: `number`

#### Defined in

[lib/peer-connection-client.ts:13](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L13)

___

### started

• `Private` **started**: `boolean` = `false`

#### Defined in

[lib/peer-connection-client.ts:14](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L14)

___

### useShareScreen$

• **useShareScreen$**: `BehaviorSubject`<`boolean`\>

triggered when the connected user toggle share screen, inital value is `false`

#### Defined in

[lib/peer-connection-client.ts:49](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L49)

___

### userMuteAudio

• **userMuteAudio**: `EventEmitter`<`void`\>

triggered when the connected user mutes his audio

#### Defined in

[lib/peer-connection-client.ts:77](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L77)

___

### userMuteVideo

• **userMuteVideo**: `EventEmitter`<`void`\>

triggered when the connected user mutes his video

#### Defined in

[lib/peer-connection-client.ts:69](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L69)

___

### userUnmuteAudio

• **userUnmuteAudio**: `EventEmitter`<`void`\>

triggered when the connected user unmutes his audio

#### Defined in

[lib/peer-connection-client.ts:81](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L81)

___

### userUnmuteVideo

• **userUnmuteVideo**: `EventEmitter`<`void`\>

triggered when the connected user unmutes his video

#### Defined in

[lib/peer-connection-client.ts:73](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L73)

## Methods

### addStream

▸ **addStream**(`mediaSteam`): `void`

Add all `MediaStreamTrack`s of a `MediaStream` to the connection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mediaSteam` | `MediaStream` | `MediaStream` with tracks |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:347](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L347)

___

### addTrack

▸ **addTrack**(`track`): `void`

add a `MediaStreamTrack` to the connection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `track` | `MediaStreamTrack` | `MediaStreamTrack` to be added to the connection. |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:320](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L320)

___

### audioMuted

▸ **audioMuted**(): `void`

send `PeerConnectionClientSignalMessageType.AudioMuted` message to connected user

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:188](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L188)

___

### audioUnmuted

▸ **audioUnmuted**(): `void`

send `PeerConnectionClientSignalMessageType.AudioUnmuted` message to connected user

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:200](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L200)

___

### close

▸ **close**(): `void`

send `PeerConnectionClientSignalMessageType.Bye` message to connected user and close the open connection

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:173](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L173)

___

### doAnswer

▸ `Private` **doAnswer**(): `void`

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:505](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L505)

___

### drainMessageQueue

▸ `Private` **drainMessageQueue**(): `void`

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:537](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L537)

___

### error

▸ `Private` **error**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:633](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L633)

___

### filterIceCandidate

▸ `Private` **filterIceCandidate**(`candidateObj`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `candidateObj` | `RTCIceCandidate` |

#### Returns

`boolean`

#### Defined in

[lib/peer-connection-client.ts:380](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L380)

___

### getPeerConnectionStates

▸ **getPeerConnectionStates**(): ``null`` \| { `iceConnectionState`: `RTCIceConnectionState` ; `iceGatheringState`: `RTCIceGatheringState` ; `signalingState`: `RTCSignalingState`  }

get peer connection state

#### Returns

``null`` \| { `iceConnectionState`: `RTCIceConnectionState` ; `iceGatheringState`: `RTCIceGatheringState` ; `signalingState`: `RTCSignalingState`  }

`null` if not connected otherwiese an object of `RTCSignalingState`, `RTCIceGatheringState` and `RTCIceConnectionState`

#### Defined in

[lib/peer-connection-client.ts:289](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L289)

___

### getPeerConnectionStats

▸ **getPeerConnectionStats**(`track?`): `Promise`<`RTCStatsReport`\>

get the connection stats of a track in the connection

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `track?` | `MediaStreamTrack` | `MediaStreamTrack` to check state for |

#### Returns

`Promise`<`RTCStatsReport`\>

Promise that resolves to `RTCStatsReport`

#### Defined in

[lib/peer-connection-client.ts:309](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L309)

___

### handleMessageEvents

▸ `Private` **handleMessageEvents**(`messageObj`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `messageObj` | [`PeerConnectionClientSignalMessage`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSignalMessage.md) |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:417](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L417)

___

### log

▸ `Private` **log**(...`args`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | `any`[] |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:627](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L627)

___

### onError

▸ `Private` **onError**(`source`, `error?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `source` | `string` |
| `error?` | `Error` |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:591](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L591)

___

### onIceCandidate

▸ `Private` **onIceCandidate**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `RTCPeerConnectionIceEvent` |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:397](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L397)

___

### onIceConnectionStateChange

▸ `Private` **onIceConnectionStateChange**(): `void`

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:559](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L559)

___

### onRecordIceCandidate

▸ `Private` **onRecordIceCandidate**(`location`, `candidateObj`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `location` | `string` |
| `candidateObj` | ``null`` \| `RTCIceCandidate` |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:596](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L596)

___

### onRemoteStreamAdded

▸ `Private` **onRemoteStreamAdded**(`event`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `RTCTrackEvent` |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:604](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L604)

___

### onSetRemoteDescriptionSuccess

▸ `Private` **onSetRemoteDescriptionSuccess**(): `void`

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:611](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L611)

___

### onSignalingStateChange

▸ `Private` **onSignalingStateChange**(): `void`

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:582](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L582)

___

### onnegotiationneeded

▸ `Private` **onnegotiationneeded**(): `void`

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:573](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L573)

___

### processSignalingMessage

▸ `Private` **processSignalingMessage**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`PeerConnectionClientSignalMessage`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSignalMessage.md) |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:471](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L471)

___

### receiveSignalingMessage

▸ **receiveSignalingMessage**(`message`): `void`

execute this methode to set messages in the peer connection. You need a connection lay to receive messages.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message` | `string` \| [`PeerConnectionClientSignalMessage`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSignalMessage.md) | message to process |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:443](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L443)

___

### replaceTrack

▸ **replaceTrack**(`track`): `void`

replace current `MediaStreamTrack` with new from parameter

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `track` | `MediaStreamTrack` | new `MediaStreamTrack` |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:331](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L331)

___

### requestMuteAudio

▸ **requestMuteAudio**(): `void`

send `PeerConnectionClientSignalMessageType.RequestMuteAudio` message to connected user

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:236](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L236)

___

### requestMuteVideo

▸ **requestMuteVideo**(): `void`

send `PeerConnectionClientSignalMessageType.RequestMuteVideo` message to connected user

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:249](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L249)

___

### setLocalSdpAndNotify

▸ `Private` **setLocalSdpAndNotify**(`sessionDescription`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sessionDescription` | `RTCSessionDescriptionInit` |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:353](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L353)

___

### setRemoteSdp

▸ `Private` **setRemoteSdp**(`message`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message` | [`PeerConnectionClientSignalMessage`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSignalMessage.md) |

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:516](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L516)

___

### startAsCallee

▸ **startAsCallee**(`initialMessages?`): `boolean`

Start Peer connection as callee

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `initialMessages?` | [`PeerConnectionClientSignalMessage`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/PeerConnectionClientSignalMessage.md)[] \| `string`[] | messages that are collected before the `PeerConnectionClient` instance is created |

#### Returns

`boolean`

`true` when messages are queed or processed `false` if no connection available or the connection is already open

#### Defined in

[lib/peer-connection-client.ts:139](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L139)

___

### startAsCaller

▸ **startAsCaller**(`offerOptions?`): `boolean`

Start Peer connection as caller

**`link`** https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `offerOptions` | `RTCOfferOptions` | options for the connection |

#### Returns

`boolean`

`true` when offer is made `false` if no connection available or the connection is already open

#### Defined in

[lib/peer-connection-client.ts:110](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L110)

___

### startShareScreen

▸ **startShareScreen**(): `void`

send `PeerConnectionClientSignalMessageType.StartShareScreen` message to connected user

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:262](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L262)

___

### stopShareScreen

▸ **stopShareScreen**(): `void`

send `PeerConnectionClientSignalMessageType.StopShareScreen` message to connected user

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:275](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L275)

___

### videoMuted

▸ **videoMuted**(): `void`

send `PeerConnectionClientSignalMessageType.VideoMuted` message to connected user

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:212](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L212)

___

### videoUnmuted

▸ **videoUnmuted**(): `void`

send `PeerConnectionClientSignalMessageType.VideoUnmuted` message to connected user

#### Returns

`void`

#### Defined in

[lib/peer-connection-client.ts:224](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/peer-connection-client.ts#L224)
