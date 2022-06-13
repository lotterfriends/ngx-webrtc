[ngx-webrtc](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/README.md) / [Exports](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/modules.md) / SdpUtils

# Class: SdpUtils

## Table of contents

### Constructors

- [constructor](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#constructor)

### Methods

- [findFmtpLine](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#findfmtpline)
- [findLine](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#findline)
- [findLineInRange](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#findlineinrange)
- [getCodecPayloadType](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#getcodecpayloadtype)
- [getCodecPayloadTypeFromLine](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#getcodecpayloadtypefromline)
- [iceCandidateType](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#icecandidatetype)
- [maybePreferAudioReceiveCodec](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybepreferaudioreceivecodec)
- [maybePreferAudioSendCodec](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybepreferaudiosendcodec)
- [maybePreferCodec](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybeprefercodec)
- [maybePreferVideoReceiveCodec](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybeprefervideoreceivecodec)
- [maybePreferVideoSendCodec](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybeprefervideosendcodec)
- [maybeRemoveVideoFec](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#mayberemovevideofec)
- [maybeSetAudioReceiveBitRate](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybesetaudioreceivebitrate)
- [maybeSetAudioSendBitRate](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybesetaudiosendbitrate)
- [maybeSetOpusOptions](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybesetopusoptions)
- [maybeSetVideoReceiveBitRate](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybesetvideoreceivebitrate)
- [maybeSetVideoSendBitRate](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybesetvideosendbitrate)
- [maybeSetVideoSendInitialBitRate](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#maybesetvideosendinitialbitrate)
- [parseFmtpLine](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#parsefmtpline)
- [preferBitRate](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#preferbitrate)
- [removeCodecByName](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#removecodecbyname)
- [removeCodecByPayloadType](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#removecodecbypayloadtype)
- [removeCodecParam](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#removecodecparam)
- [removePayloadTypeFromMline](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#removepayloadtypefrommline)
- [setCodecParam](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#setcodecparam)
- [setDefaultCodec](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#setdefaultcodec)
- [writeFmtpLine](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/classes/SdpUtils.md#writefmtpline)

## Constructors

### constructor

• **new SdpUtils**()

## Methods

### findFmtpLine

▸ `Static` **findFmtpLine**(`sdpLines`, `codec`): ``null`` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdpLines` | `string`[] |
| `codec` | `string` |

#### Returns

``null`` \| `number`

#### Defined in

[lib/sdp-utils.ts:435](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L435)

___

### findLine

▸ `Static` **findLine**(`sdpLines`, `prefix`, `substr?`): ``null`` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdpLines` | `string`[] |
| `prefix` | `string` |
| `substr?` | `string` |

#### Returns

``null`` \| `number`

#### Defined in

[lib/sdp-utils.ts:444](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L444)

___

### findLineInRange

▸ `Static` **findLineInRange**(`sdpLines`, `startLine`, `endLine`, `prefix?`, `substr?`, `direction?`): ``null`` \| `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdpLines` | `string`[] |
| `startLine` | `number` |
| `endLine` | `number` |
| `prefix?` | `string` |
| `substr?` | `string` |
| `direction?` | ``"asc"`` \| ``"desc"`` |

#### Returns

``null`` \| `number`

#### Defined in

[lib/sdp-utils.ts:450](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L450)

___

### getCodecPayloadType

▸ `Static` **getCodecPayloadType**(`sdpLines`, `codec`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdpLines` | `string`[] |
| `codec` | `string` |

#### Returns

``null`` \| `string`

#### Defined in

[lib/sdp-utils.ts:491](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L491)

___

### getCodecPayloadTypeFromLine

▸ `Static` **getCodecPayloadTypeFromLine**(`sdpLine`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdpLine` | `string` |

#### Returns

``null`` \| `string`

#### Defined in

[lib/sdp-utils.ts:497](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L497)

___

### iceCandidateType

▸ `Static` **iceCandidateType**(`candidateStr`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `candidateStr` | `string` |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:14](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L14)

___

### maybePreferAudioReceiveCodec

▸ `Static` **maybePreferAudioReceiveCodec**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:266](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L266)

___

### maybePreferAudioSendCodec

▸ `Static` **maybePreferAudioSendCodec**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:261](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L261)

___

### maybePreferCodec

▸ `Static` **maybePreferCodec**(`sdp`, `type`, `dir`, `codec?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `type` | `string` |
| `dir` | `string` |
| `codec?` | `string` |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:282](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L282)

___

### maybePreferVideoReceiveCodec

▸ `Static` **maybePreferVideoReceiveCodec**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:276](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L276)

___

### maybePreferVideoSendCodec

▸ `Static` **maybePreferVideoSendCodec**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:271](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L271)

___

### maybeRemoveVideoFec

▸ `Static` **maybeRemoveVideoFec**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:226](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L226)

___

### maybeSetAudioReceiveBitRate

▸ `Static` **maybeSetAudioReceiveBitRate**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:59](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L59)

___

### maybeSetAudioSendBitRate

▸ `Static` **maybeSetAudioSendBitRate**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:51](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L51)

___

### maybeSetOpusOptions

▸ `Static` **maybeSetOpusOptions**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:18](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L18)

___

### maybeSetVideoReceiveBitRate

▸ `Static` **maybeSetVideoReceiveBitRate**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:75](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L75)

___

### maybeSetVideoSendBitRate

▸ `Static` **maybeSetVideoSendBitRate**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:67](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L67)

___

### maybeSetVideoSendInitialBitRate

▸ `Static` **maybeSetVideoSendInitialBitRate**(`sdp`, `params`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `params` | [`SdpSettings`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/SdpSettings.md) |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:126](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L126)

___

### parseFmtpLine

▸ `Static` **parseFmtpLine**(`fmtpLine`): ``null`` \| [`FormatObject`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/FormatObject.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `fmtpLine` | `string` |

#### Returns

``null`` \| [`FormatObject`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/FormatObject.md)

#### Defined in

[lib/sdp-utils.ts:388](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L388)

___

### preferBitRate

▸ `Static` **preferBitRate**(`sdp`, `bitrate`, `mediaType`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `bitrate` | `string` \| `number` |
| `mediaType` | `string` |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:84](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L84)

___

### removeCodecByName

▸ `Static` **removeCodecByName**(`sdpLines`, `codec`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdpLines` | `string`[] |
| `codec` | `string` |

#### Returns

`string`[]

#### Defined in

[lib/sdp-utils.ts:189](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L189)

___

### removeCodecByPayloadType

▸ `Static` **removeCodecByPayloadType**(`sdpLines`, `payloadType`): `string`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdpLines` | `string`[] |
| `payloadType` | `string` |

#### Returns

`string`[]

#### Defined in

[lib/sdp-utils.ts:209](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L209)

___

### removeCodecParam

▸ `Static` **removeCodecParam**(`sdp`, `codec`, `param`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `codec` | `string` |
| `param` | `string` |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:362](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L362)

___

### removePayloadTypeFromMline

▸ `Static` **removePayloadTypeFromMline**(`mLine`, `payloadType`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mLine` | `string` |
| `payloadType` | `string` |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:179](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L179)

___

### setCodecParam

▸ `Static` **setCodecParam**(`sdp`, `codec`, `param`, `value`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `sdp` | `string` |
| `codec` | `string` |
| `param` | `string` |
| `value` | `string` \| `number` |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:324](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L324)

___

### setDefaultCodec

▸ `Static` **setDefaultCodec**(`mLine`, `payload`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `mLine` | `string` |
| `payload` | `string` |

#### Returns

`string`

#### Defined in

[lib/sdp-utils.ts:504](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L504)

___

### writeFmtpLine

▸ `Static` **writeFmtpLine**(`fmtpObj`): ``null`` \| `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `fmtpObj` | [`FormatObject`](https://github.com/lotterfriends/ngx-webrtc/tree/main/libs/ngx-webrtc/docs/interfaces/FormatObject.md) |

#### Returns

``null`` \| `string`

#### Defined in

[lib/sdp-utils.ts:414](https://github.com/lotterfriends/video-chat/blob/cd8d92e/libs/ngx-webrtc/src/lib/sdp-utils.ts#L414)
