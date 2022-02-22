[ngx-webrtc](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/README.md) / [Exports](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/modules.md) / ShareScreenDirective

# Class: ShareScreenDirective

Trigger get capture screen permissions and send screen to CallService.
You can listen to the change and call replaceTrack of peer connection to send the screen capture to that connection

## Table of contents

### Constructors

- [constructor](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ShareScreenDirective.md#constructor)

### Properties

- [desktopStream](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ShareScreenDirective.md#desktopstream)
- [isDisabled](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ShareScreenDirective.md#isdisabled)
- [isEnabled](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ShareScreenDirective.md#isenabled)

### Methods

- [onClick](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ShareScreenDirective.md#onclick)
- [startShareScreen](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ShareScreenDirective.md#startsharescreen)
- [stopShareScreen](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/ShareScreenDirective.md#stopsharescreen)

## Constructors

### constructor

• **new ShareScreenDirective**(`streamService`, `callService`, `cdr`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `streamService` | [`StreamService`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/StreamService.md) |
| `callService` | [`CallService`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/CallService.md) |
| `cdr` | `ChangeDetectorRef` |

#### Defined in

[lib/directives/share-screen.directive.ts:27](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/share-screen.directive.ts#L27)

## Properties

### desktopStream

• `Private` **desktopStream**: ``null`` \| `MediaStream` = `null`

#### Defined in

[lib/directives/share-screen.directive.ts:16](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/share-screen.directive.ts#L16)

___

### isDisabled

• **isDisabled**: `boolean` = `true`

#### Defined in

[lib/directives/share-screen.directive.ts:17](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/share-screen.directive.ts#L17)

___

### isEnabled

• **isEnabled**: `boolean` = `false`

#### Defined in

[lib/directives/share-screen.directive.ts:18](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/share-screen.directive.ts#L18)

## Methods

### onClick

▸ **onClick**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/directives/share-screen.directive.ts:19](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/share-screen.directive.ts#L19)

___

### startShareScreen

▸ `Private` **startShareScreen**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[lib/directives/share-screen.directive.ts:33](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/share-screen.directive.ts#L33)

___

### stopShareScreen

▸ `Private` **stopShareScreen**(): `void`

#### Returns

`void`

#### Defined in

[lib/directives/share-screen.directive.ts:64](https://github.com/lotterfriends/video-chat/blob/238aa43/libs/ngx-webrtc/src/lib/directives/share-screen.directive.ts#L64)
