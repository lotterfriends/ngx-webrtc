[ngx-webrtc](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/README.md) / [Exports](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/modules.md) / StreamService

# Class: StreamService

## Table of contents

### Constructors

- [constructor](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#constructor)

### Properties

- [audioOutput$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#audiooutput$)
- [hasAudio](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#hasaudio)
- [hasVideo](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#hasvideo)
- [localAudioStreamStatusChanged](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#localaudiostreamstatuschanged)
- [localShareScreenStream$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#localsharescreenstream$)
- [localStream$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#localstream$)
- [localStreamStatusChanged](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#localstreamstatuschanged)
- [localVideoStreamStatusChanged](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#localvideostreamstatuschanged)
- [replaceTrack$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#replacetrack$)

### Methods

- [getAudioTrackForStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#getaudiotrackforstream)
- [getLocalStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#getlocalstream)
- [getMediaDevices](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#getmediadevices)
- [getScreenCapture](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#getscreencapture)
- [getVideoTrackForStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#getvideotrackforstream)
- [muteLocalAudioStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#mutelocalaudiostream)
- [muteLocalVideoStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#mutelocalvideostream)
- [muteStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#mutestream)
- [replaceTrack](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#replacetrack)
- [replaceTrackInStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#replacetrackinstream)
- [setAudioOutput](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#setaudiooutput)
- [setLocalStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#setlocalstream)
- [setStreamInNode](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#setstreaminnode)
- [stopStreamInNode](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#stopstreaminnode)
- [toggleMuteLocalAudioStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#togglemutelocalaudiostream)
- [toggleMuteLocalVideoStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#togglemutelocalvideostream)
- [toggleMuteStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#togglemutestream)
- [tryGetUserMedia](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#trygetusermedia)
- [unmuteLocalAudioStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#unmutelocalaudiostream)
- [unmuteLocalVideoStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#unmutelocalvideostream)
- [unmuteStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#unmutestream)
- [getAspectRatio](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md#getaspectratio)

## Constructors

### constructor

• **new StreamService**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`NgxWebrtConfiguration`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/NgxWebrtConfiguration.md) |

#### Defined in

[lib/services/stream.service.ts:56](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L56)

## Properties

### audioOutput$

• **audioOutput$**: `BehaviorSubject`<``null`` \| `string`\>

Emitted when `StreamService.setAudioOutput` is called with new device (Call it when the switch the audio device).

#### Defined in

[lib/services/stream.service.ts:29](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L29)

___

### hasAudio

• **hasAudio**: `boolean` = `false`

Set to `true` when the StreamService.tryGetUserMedia is succefull for audio (microphone).

#### Defined in

[lib/services/stream.service.ts:54](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L54)

___

### hasVideo

• **hasVideo**: `boolean` = `false`

Set to `true` when the StreamService.tryGetUserMedia is succefull for video (camera).

#### Defined in

[lib/services/stream.service.ts:49](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L49)

___

### localAudioStreamStatusChanged

• **localAudioStreamStatusChanged**: `EventEmitter`<`boolean`\>

Emitted when the status of the local audio stream changed e.g. audio disabled or enabled.

#### Defined in

[lib/services/stream.service.ts:39](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L39)

___

### localShareScreenStream$

• **localShareScreenStream$**: `BehaviorSubject`<``null`` \| `MediaStream`\>

You can subscribe to screen share changes

#### Defined in

[lib/services/stream.service.ts:19](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L19)

___

### localStream$

• **localStream$**: `BehaviorSubject`<``null`` \| `MediaStream`\>

You can subscribe to localSteam changes

#### Defined in

[lib/services/stream.service.ts:15](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L15)

___

### localStreamStatusChanged

• **localStreamStatusChanged**: `EventEmitter`<`MediaStreamTrack` \| `MediaStream`\>

Emitted when the status of the local stream changed e.g. audio or video disabled or enabled.

#### Defined in

[lib/services/stream.service.ts:34](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L34)

___

### localVideoStreamStatusChanged

• **localVideoStreamStatusChanged**: `EventEmitter`<`boolean`\>

Emitted when the status of the local video stream changed e.g. video disabled or enabled.

#### Defined in

[lib/services/stream.service.ts:44](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L44)

___

### replaceTrack$

• **replaceTrack$**: `BehaviorSubject`<``null`` \| `MediaStreamTrack`\>

Emitted with new Track when `StreamService.replaceTrack` is called

#### Defined in

[lib/services/stream.service.ts:24](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L24)

## Methods

### getAudioTrackForStream

▸ **getAudioTrackForStream**(`stream?`): ``null`` \| `MediaStreamTrack`

get first/single audio track of the given stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream?` | `MediaStream` | stream with audio treack |

#### Returns

``null`` \| `MediaStreamTrack`

first audio track of stream

#### Defined in

[lib/services/stream.service.ts:318](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L318)

___

### getLocalStream

▸ **getLocalStream**(): ``null`` \| `MediaStream`

get current state value of local stream

#### Returns

``null`` \| `MediaStream`

current local stream

#### Defined in

[lib/services/stream.service.ts:205](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L205)

___

### getMediaDevices

▸ **getMediaDevices**(): `Promise`<`MediaDeviceInfo`[]\>

get media devices, Attention you need getMedia permissions for this call

#### Returns

`Promise`<`MediaDeviceInfo`[]\>

Promise that resolves to media Devices as array

#### Defined in

[lib/services/stream.service.ts:329](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L329)

___

### getScreenCapture

▸ **getScreenCapture**(): `Promise`<``null`` \| `MediaStream`\>

get screen or window as stream

#### Returns

`Promise`<``null`` \| `MediaStream`\>

MediaStram of desktop or display

#### Defined in

[lib/services/stream.service.ts:281](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L281)

___

### getVideoTrackForStream

▸ **getVideoTrackForStream**(`stream?`): ``null`` \| `MediaStreamTrack`

get first/single video track of the given stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream?` | `MediaStream` | stream with video treack |

#### Returns

``null`` \| `MediaStreamTrack`

first video track of stream

#### Defined in

[lib/services/stream.service.ts:306](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L306)

___

### muteLocalAudioStream

▸ **muteLocalAudioStream**(): `void`

mute local audio stream

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:230](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L230)

___

### muteLocalVideoStream

▸ **muteLocalVideoStream**(): `void`

mute local video stream

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:260](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L260)

___

### muteStream

▸ **muteStream**(`stream`, `type`): `void`

Mute stream in node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | `MediaStreamTrack` \| `MediaStream` | stram or track |
| `type` | [`StreamType`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/enums/StreamType.md) | stream or track type |

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:165](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L165)

___

### replaceTrack

▸ **replaceTrack**(`track`): `void`

set replace track service state. You can subscribe to `StreamService.replaceTrack$` to update the track somewhere.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `track` | `MediaStreamTrack` | new track |

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:213](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L213)

___

### replaceTrackInStream

▸ **replaceTrackInStream**(`stream`, `track`): `void`

replace a track in stream

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | `MediaStream` | stream with thre track to replace |
| `track` | `MediaStreamTrack` | new track |

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:183](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L183)

___

### setAudioOutput

▸ **setAudioOutput**(`deviceId`): `void`

set current audio device in service state. You can subscribe to `StreamService.audioOutput$` to get changes.

#### Parameters

| Name | Type |
| :------ | :------ |
| `deviceId` | `string` |

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:337](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L337)

___

### setLocalStream

▸ **setLocalStream**(`stream`): `void`

set local stream in service state

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | ``null`` \| `MediaStream` | stream to set |

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:197](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L197)

___

### setStreamInNode

▸ **setStreamInNode**(`node`, `stream`, `muted?`, `local?`): `void`

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `node` | `HTMLVideoElement` \| `HTMLAudioElement` | `undefined` | `HTMLVideoElement` or `HTMLAudioElement` that should play the stream. |
| `stream` | `MediaStreamTrack` \| `MediaStream` | `undefined` | stream to set in node |
| `muted` | `boolean` | `true` | mute audio |
| `local` | `boolean` | `false` | if set to `true` `localStreamStatusChanged` is emitted on play |

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:84](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L84)

___

### stopStreamInNode

▸ **stopStreamInNode**(`node`): `void`

stop stream playing in node

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `ElementRef`<`any`\> | node with nativeElement type `HTMLVideoElement` or  `HTMLAudioElement` |

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:118](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L118)

___

### toggleMuteLocalAudioStream

▸ **toggleMuteLocalAudioStream**(): `void`

toggle mute audio of local stream

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:220](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L220)

___

### toggleMuteLocalVideoStream

▸ **toggleMuteLocalVideoStream**(): `void`

toggle mute local video stream

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:250](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L250)

___

### toggleMuteStream

▸ **toggleMuteStream**(`stream`, `type`, `value?`): `void`

set stream or track mute state or toggle mute

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | `MediaStreamTrack` \| `MediaStream` | stream or track |
| `type` | [`StreamType`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/enums/StreamType.md) | stream or track type |
| `value?` | `boolean` | enforce `true` or `false` |

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:132](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L132)

___

### tryGetUserMedia

▸ **tryGetUserMedia**(`mediaConstraints?`): `Promise`<`MediaStream`\>

An simple wrapper for `navigator.mediaDevices.getUserMedia`, with basis error handling.

**`todo`** refactor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `mediaConstraints?` | `MediaStreamConstraints` | a MediaStreamConstraints e.g. with specific deviceId, resolution or just audio. Default is:                          ```json                         {                             audio: true,                             video: true                         }                         ``` |

#### Returns

`Promise`<`MediaStream`\>

Promise that resilve to a stream matching the constraint

#### Defined in

[lib/services/stream.service.ts:354](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L354)

___

### unmuteLocalAudioStream

▸ **unmuteLocalAudioStream**(): `void`

unmute local audio stream

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:240](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L240)

___

### unmuteLocalVideoStream

▸ **unmuteLocalVideoStream**(): `void`

unmute local video stream

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:270](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L270)

___

### unmuteStream

▸ **unmuteStream**(`stream`, `type`): `void`

Unmute stream in node.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `stream` | `MediaStreamTrack` \| `MediaStream` | stram or track |
| `type` | [`StreamType`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/enums/StreamType.md) | stream or track type |

#### Returns

`void`

#### Defined in

[lib/services/stream.service.ts:174](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L174)

___

### getAspectRatio

▸ `Static` **getAspectRatio**(`width`, `height`): `string`

Get aspect ratio for given width and height.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `width` | `number` | width in pixel |
| `height` | `number` | height in pixel |

#### Returns

`string`

aspect ratio for the given width and height

#### Defined in

[lib/services/stream.service.ts:67](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/services/stream.service.ts#L67)
