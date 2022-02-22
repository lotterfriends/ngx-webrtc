[ngx-webrtc](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/README.md) / [Exports](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/modules.md) / ToggleAudioSelfDirective

# Class: ToggleAudioSelfDirective

Toggle disabled/enable audio track to mute/unmute local audio.

## Implements

- `OnDestroy`

## Table of contents

### Constructors

- [constructor](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#constructor)

### Properties

- [callStartedSubscription$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#callstartedsubscription$)
- [isDisabled](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#isdisabled)
- [isEnabled](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#isenabled)
- [localStreamStatusChangedSubscription$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#localstreamstatuschangedsubscription$)

### Methods

- [init](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#init)
- [ngOnDestroy](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#ngondestroy)
- [onClick](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#onclick)
- [onLocalStreamStatusChanged](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#onlocalstreamstatuschanged)
- [onStart](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#onstart)
- [toggleMute](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#togglemute)
- [updateStatusWithTrack](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleAudioSelfDirective.md#updatestatuswithtrack)

## Constructors

### constructor

• **new ToggleAudioSelfDirective**(`streamService`, `callService`, `cdr`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `streamService` | [`StreamService`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md) |
| `callService` | [`CallService`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/CallService.md) |
| `cdr` | `ChangeDetectorRef` |

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:23](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L23)

## Properties

### callStartedSubscription$

• `Private` **callStartedSubscription$**: ``null`` \| `Subscription` = `null`

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:15](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L15)

___

### isDisabled

• **isDisabled**: `boolean` = `true`

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:17](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L17)

___

### isEnabled

• **isEnabled**: `boolean` = `false`

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:18](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L18)

___

### localStreamStatusChangedSubscription$

• `Private` **localStreamStatusChangedSubscription$**: ``null`` \| `Subscription` = `null`

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:16](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L16)

## Methods

### init

▸ **init**(): `void`

#### Returns

`void`

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:36](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L36)

___

### ngOnDestroy

▸ **ngOnDestroy**(): `void`

#### Returns

`void`

#### Implementation of

OnDestroy.ngOnDestroy

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:31](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L31)

___

### onClick

▸ **onClick**(): `void`

#### Returns

`void`

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:19](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L19)

___

### onLocalStreamStatusChanged

▸ **onLocalStreamStatusChanged**(`stream`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `stream` | `MediaStreamTrack` \| `MediaStream` |

#### Returns

`void`

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:47](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L47)

___

### onStart

▸ **onStart**(`isStarted`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `isStarted` | `boolean` |

#### Returns

`void`

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:40](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L40)

___

### toggleMute

▸ **toggleMute**(): `void`

#### Returns

`void`

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:61](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L61)

___

### updateStatusWithTrack

▸ `Private` **updateStatusWithTrack**(`track`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `track` | `MediaStreamTrack` |

#### Returns

`void`

#### Defined in

[lib/directives/toggle-audio-self.directive.ts:65](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/toggle-audio-self.directive.ts#L65)
