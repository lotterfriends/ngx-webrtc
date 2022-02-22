[ngx-webrtc](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/README.md) / [Exports](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/modules.md) / ToggleVideoSelfDirective

# Class: ToggleVideoSelfDirective

Toggle disabled/enable video track to mute/unmute local video.

## Implements

- `OnDestroy`

## Table of contents

### Constructors

- [constructor](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#constructor)

### Properties

- [callStartedSubscription$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#callstartedsubscription$)
- [isDisabled](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#isdisabled)
- [isEnabled](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#isenabled)
- [localStreamStatusChangedSubscription$](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#localstreamstatuschangedsubscription$)

### Methods

- [init](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#init)
- [ngOnDestroy](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#ngondestroy)
- [onClick](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#onclick)
- [onLocalStreamStatusChanged](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#onlocalstreamstatuschanged)
- [onStart](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#onstart)
- [toggleMute](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#togglemute)
- [updateStatusWithTrack](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ToggleVideoSelfDirective.md#updatestatuswithtrack)

## Constructors

### constructor

• **new ToggleVideoSelfDirective**(`streamService`, `callService`, `cdr`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `streamService` | [`StreamService`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md) |
| `callService` | [`CallService`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/CallService.md) |
| `cdr` | `ChangeDetectorRef` |

#### Defined in

[lib/directives/toggle-video-self.directive.ts:23](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L23)

## Properties

### callStartedSubscription$

• `Private` **callStartedSubscription$**: ``null`` \| `Subscription` = `null`

#### Defined in

[lib/directives/toggle-video-self.directive.ts:15](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L15)

___

### isDisabled

• **isDisabled**: `boolean` = `true`

#### Defined in

[lib/directives/toggle-video-self.directive.ts:17](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L17)

___

### isEnabled

• **isEnabled**: `boolean` = `false`

#### Defined in

[lib/directives/toggle-video-self.directive.ts:18](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L18)

___

### localStreamStatusChangedSubscription$

• `Private` **localStreamStatusChangedSubscription$**: ``null`` \| `Subscription` = `null`

#### Defined in

[lib/directives/toggle-video-self.directive.ts:16](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L16)

## Methods

### init

▸ **init**(): `void`

#### Returns

`void`

#### Defined in

[lib/directives/toggle-video-self.directive.ts:36](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L36)

___

### ngOnDestroy

▸ **ngOnDestroy**(): `void`

#### Returns

`void`

#### Implementation of

OnDestroy.ngOnDestroy

#### Defined in

[lib/directives/toggle-video-self.directive.ts:31](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L31)

___

### onClick

▸ **onClick**(): `void`

#### Returns

`void`

#### Defined in

[lib/directives/toggle-video-self.directive.ts:19](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L19)

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

[lib/directives/toggle-video-self.directive.ts:47](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L47)

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

[lib/directives/toggle-video-self.directive.ts:40](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L40)

___

### toggleMute

▸ **toggleMute**(): `void`

#### Returns

`void`

#### Defined in

[lib/directives/toggle-video-self.directive.ts:61](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L61)

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

[lib/directives/toggle-video-self.directive.ts:65](https://github.com/lotterfriends/video-chat/blob/a615e2f/libs/ngx-webrtc/src/lib/directives/toggle-video-self.directive.ts#L65)
