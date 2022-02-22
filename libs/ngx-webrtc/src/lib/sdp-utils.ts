import { SdpSettings } from "./interfaces/sdp-settings";

export interface FormatObject {
  pt: string;
  params: FormatParams
}

export interface FormatParams {
  [key: string]: string | number
}

export class  SdpUtils {

  public static iceCandidateType(candidateStr: string): string {
    return candidateStr.split(' ')[7];
  }

  public static maybeSetOpusOptions(sdp: string, params: SdpSettings): string {
    // Set Opus in Stereo, if stereo is true, unset it, if stereo is false, and
    // do nothing if otherwise.
    if (params.opusStereo) {
      sdp = SdpUtils.setCodecParam(sdp, 'opus/48000', 'stereo', '1');
    } else if (!params.opusStereo) {
      sdp = SdpUtils.removeCodecParam(sdp, 'opus/48000', 'stereo');
    }

    // Set Opus FEC, if opusfec is true, unset it, if opusfec is false, and
    // do nothing if otherwise.
    if (params.opusFec) {
      sdp = SdpUtils.setCodecParam(sdp, 'opus/48000', 'useinbandfec', '1');
    } else if (!params.opusFec) {
      sdp = SdpUtils.removeCodecParam(sdp, 'opus/48000', 'useinbandfec');
    }

    // Set Opus DTX, if opusdtx is true, unset it, if opusdtx is false, and
    // do nothing if otherwise.
    if (params.opusDtx) {
      sdp = SdpUtils.setCodecParam(sdp, 'opus/48000', 'usedtx', '1');
    } else if (!params.opusDtx) {
      sdp = SdpUtils.removeCodecParam(sdp, 'opus/48000', 'usedtx');
    }

    // Set Opus maxplaybackrate, if requested.
    if (params.opusMaxPbr) {
      sdp = SdpUtils.setCodecParam(
          sdp, 'opus/48000', 'maxplaybackrate', params.opusMaxPbr);
    }
    return sdp;
  }

  public static maybeSetAudioSendBitRate(sdp: string, params: SdpSettings): string {
    if (!params.audioSendBitrate) {
      return sdp;
    }
    // console.log('Prefer audio send bitrate: ' + params.audioSendBitrate);
    return SdpUtils.preferBitRate(sdp, params.audioSendBitrate, 'audio');
  }

  public static maybeSetAudioReceiveBitRate(sdp: string, params: SdpSettings): string {
    if (!params.audioRecvBitrate) {
      return sdp;
    }
    // console.log('Prefer audio receive bitrate: ' + params.audioRecvBitrate);
    return SdpUtils.preferBitRate(sdp, params.audioRecvBitrate, 'audio');
  }

  public static maybeSetVideoSendBitRate(sdp: string, params: SdpSettings): string {
    if (!params.videoSendBitrate) {
      return sdp;
    }
    // console.log('Prefer video send bitrate: ' + params.videoSendBitrate);
    return SdpUtils.preferBitRate(sdp, params.videoSendBitrate, 'video');
  }

  public static maybeSetVideoReceiveBitRate(sdp: string, params: SdpSettings): string {
    if (!params.videoRecvBitrate) {
      return sdp;
    }
    // console.log('Prefer video receive bitrate: ' + params.videoRecvBitrate);
    return SdpUtils.preferBitRate(sdp, params.videoRecvBitrate, 'video');
  }

  // Add a b=AS:bitrate line to the m=mediaType section.
  public static preferBitRate(sdp: string, bitrate: string | number, mediaType: string): string {
    const sdpLines = sdp.split('\r\n');

    // Find m line for the given mediaType.
    const mLineIndex = SdpUtils.findLine(sdpLines, 'm=', mediaType);
    if (mLineIndex === null) {
      // console.log('Failed to add bandwidth line to sdp, as no m-line found');
      return sdp;
    }

    // Find next m-line if any.
    let nextMLineIndex = SdpUtils.findLineInRange(sdpLines, mLineIndex + 1, -1, 'm=');
    if (nextMLineIndex === null) {
      nextMLineIndex = sdpLines.length;
    }

    // Find c-line corresponding to the m-line.
    const cLineIndex = SdpUtils.findLineInRange(sdpLines, mLineIndex + 1,
        nextMLineIndex, 'c=');
    if (cLineIndex === null) {
      // console.log('Failed to add bandwidth line to sdp, as no c-line found');
      return sdp;
    }

    // Check if bandwidth line already exists between c-line and next m-line.
    const bLineIndex = SdpUtils.findLineInRange(sdpLines, cLineIndex + 1,
        nextMLineIndex, 'b=AS');
    if (bLineIndex) {
      sdpLines.splice(bLineIndex, 1);
    }

    // Create the b (bandwidth) sdp line.
    const bwLine = 'b=AS:' + bitrate;
    // As per RFC 4566, the b line should follow after c-line.
    sdpLines.splice(cLineIndex + 1, 0, bwLine);
    sdp = sdpLines.join('\r\n');
    return sdp;
  }

  // Add an a=fmtp: x-google-min-bitrate=kbps line, if videoSendInitialBitrate
  // is specified. We'll also add a x-google-min-bitrate value, since the max
  // must be >= the min.
  public static maybeSetVideoSendInitialBitRate(sdp: string, params: SdpSettings): string {
    if (!params.videoSendInitialBitrate) {
      return sdp;
    }
    let initialBitrate = typeof params.videoSendInitialBitrate === 'string' ?
      parseInt(params.videoSendInitialBitrate, 10) : params.videoSendInitialBitrate;
    if (!initialBitrate) {
      return sdp;
    }

    // Validate the initial bitrate value.
    let maxBitrate = (typeof initialBitrate === 'string') ? parseInt(initialBitrate, 10) : initialBitrate;
    if (params.videoSendBitrate) {
      const bitrate = typeof params.videoSendBitrate === 'string' ?
        parseInt(params.videoSendBitrate, 10) : params.videoSendBitrate;
      if (bitrate) {
        if (initialBitrate > bitrate) {
          // console.log('Clamping initial bitrate to max bitrate of ' + bitrate + ' kbps.');
          initialBitrate = bitrate;
          params.videoSendInitialBitrate = initialBitrate;
        }
        maxBitrate = bitrate;
      }
    }

    const sdpLines = sdp.split('\r\n');

    // Search for m line.
    const mLineIndex = SdpUtils.findLine(sdpLines, 'm=', 'video');
    if (mLineIndex === null) {
      // console.log('Failed to find video m-line');
      return sdp;
    }
    // Figure out the first codec payload type on the m=video SDP line.
    const videoMLine = sdpLines[mLineIndex];
    const pattern = new RegExp('m=video\\s\\d+\\s[A-Z/]+\\s');
    const sendPayloadType = videoMLine.split(pattern)[1].split(' ')[0];
    const line = SdpUtils.findLine(sdpLines, 'a=rtpmap', sendPayloadType);
    if (!line) {
      return sdp;
    }
    const fmtpLine = sdpLines[line];
    const codecName = fmtpLine.split('a=rtpmap:' +
        sendPayloadType)[1].split('/')[0];

    // Use codec from params if specified via URL param, otherwise use from SDP.
    const codec = params.videoSendCodec || codecName;
    sdp = SdpUtils.setCodecParam(sdp, codec, 'x-google-min-bitrate', params.videoSendInitialBitrate.toString());
    sdp = SdpUtils.setCodecParam(sdp, codec, 'x-google-max-bitrate', maxBitrate.toString());

    return sdp;
  }

  public static removePayloadTypeFromMline(mLine: string, payloadType: string): string {
    const mLineArray = mLine.split(' ');
    for (let i = 0; i < mLineArray.length; ++i) {
      if (mLineArray[i] === payloadType.toString()) {
        mLineArray.splice(i, 1);
      }
    }
    return mLineArray.join(' ');
  }

  public static removeCodecByName(sdpLines: string[], codec: string): string[] {
    const index = SdpUtils.findLine(sdpLines, 'a=rtpmap', codec);
    if (index === null) {
      return sdpLines;
    }
    const payloadType = SdpUtils.getCodecPayloadTypeFromLine(sdpLines[index]);
    if (!payloadType) {
      return sdpLines;
    }
    sdpLines.splice(index, 1);

    // Search for the video m= line and remove the codec.
    const mLineIndex = SdpUtils.findLine(sdpLines, 'm=', 'video');
    if (mLineIndex === null) {
      return sdpLines;
    }
    sdpLines[mLineIndex] = SdpUtils.removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
    return sdpLines;
  }

  public static removeCodecByPayloadType(sdpLines: string[], payloadType: string): string[] {
    const index = SdpUtils.findLine(sdpLines, 'a=rtpmap', payloadType.toString());
    if (index === null) {
      return sdpLines;
    }
    sdpLines.splice(index, 1);

    // Search for the video m= line and remove the codec.
    const mLineIndex = SdpUtils.findLine(sdpLines, 'm=', 'video');
    if (mLineIndex === null) {
      return sdpLines;
    }
    sdpLines[mLineIndex] = SdpUtils.removePayloadTypeFromMline(sdpLines[mLineIndex],
        payloadType);
    return sdpLines;
  }

  public static maybeRemoveVideoFec(sdp: string, params: SdpSettings): string {
    if (params.videoFec !== false) {
      return sdp;
    }

    let sdpLines = sdp.split('\r\n');

    let index = SdpUtils.findLine(sdpLines, 'a=rtpmap', 'red');
    if (index === null) {
      return sdp;
    }
    const redPayloadType = SdpUtils.getCodecPayloadTypeFromLine(sdpLines[index]);
    if (redPayloadType === null) {
      return sdp;
    }
    sdpLines = SdpUtils.removeCodecByPayloadType(sdpLines, redPayloadType);
    sdpLines = SdpUtils.removeCodecByName(sdpLines, 'ulpfec');

    // Remove fmtp lines associated with red codec.
    index = SdpUtils.findLine(sdpLines, 'a=fmtp', redPayloadType.toString());
    if (index === null) {
      return sdp;
    }
    const fmtpLine = SdpUtils.parseFmtpLine(sdpLines[index]);
    const rtxPayloadType = fmtpLine?.pt;
    if (!rtxPayloadType || rtxPayloadType === null) {
      return sdp;
    }
    sdpLines.splice(index, 1);

    sdpLines = SdpUtils.removeCodecByPayloadType(sdpLines, rtxPayloadType);
    return sdpLines.join('\r\n');
  }

  // Promotes |audioSendCodec| to be the first in the m=audio line, if set.
  public static maybePreferAudioSendCodec(sdp: string, params: SdpSettings): string {
    return SdpUtils.maybePreferCodec(sdp, 'audio', 'send', params.audioSendCodec);
  }

  // Promotes |audioRecvCodec| to be the first in the m=audio line, if set.
  public static maybePreferAudioReceiveCodec(sdp: string, params: SdpSettings): string {
    return SdpUtils.maybePreferCodec(sdp, 'audio', 'receive', params.audioRecvCodec);
  }

  // Promotes |videoSendCodec| to be the first in the m=audio line, if set.
  public static maybePreferVideoSendCodec(sdp: string, params: SdpSettings): string {
    return SdpUtils.maybePreferCodec(sdp, 'video', 'send', params.videoSendCodec);
  }

  // Promotes |videoRecvCodec| to be the first in the m=audio line, if set.
  public static maybePreferVideoReceiveCodec(sdp: string, params: SdpSettings): string {
    return SdpUtils.maybePreferCodec(sdp, 'video', 'receive', params.videoRecvCodec);
  }

  // Sets |codec| as the default |type| codec if it's present.
  // The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.
  public static maybePreferCodec(sdp: string, type: string, dir: string, codec?: string ): string {
    // let str = type + ' ' + dir + ' codec';
    if (!codec) {
      // console.log('No preference on ' + str + '.');
      return sdp;
    }

    // console.log('Prefer ' + str + ': ' + codec);

    const sdpLines = sdp.split('\r\n');

    // Search for m line.
    const mLineIndex = SdpUtils.findLine(sdpLines, 'm=', type);
    if (mLineIndex === null) {
      return sdp;
    }

    // If the codec is available, set it as the default in m line.
    let payload = null;
    // Iterate through rtpmap enumerations to find all matching codec entries
    for (let i = sdpLines.length - 1; i >= 0 ; --i) {
      // Finds first match in rtpmap
      const index = SdpUtils.findLineInRange(sdpLines, i, 0, 'a=rtpmap', codec, 'desc');
      if (index !== null) {
        // Skip all of the entries between i and index match
        i = index;
        payload = SdpUtils.getCodecPayloadTypeFromLine(sdpLines[index]);
        if (payload) {
          // Move codec to top
          sdpLines[mLineIndex] = SdpUtils.setDefaultCodec(sdpLines[mLineIndex], payload);
        }
      } else {
        // No match means we can break the loop
        break;
      }
    }

    sdp = sdpLines.join('\r\n');
    return sdp;
  }

  // Set fmtp param to specific codec in SDP. If param does not exists, add it.
  public static setCodecParam(sdp: string, codec: string, param: string, value: string | number): string {
    const sdpLines = sdp.split('\r\n');

    const fmtpLineIndex = SdpUtils.findFmtpLine(sdpLines, codec);

    let fmtpObj: FormatObject | null = {pt: '', params: {}}
    if (fmtpLineIndex === null) {
      const index = SdpUtils.findLine(sdpLines, 'a=rtpmap', codec);
      if (index === null) {
        return sdp;
      }
      const payload = SdpUtils.getCodecPayloadTypeFromLine(sdpLines[index]);
      if (payload === null) {
        return sdp;
      }
      fmtpObj.pt = payload.toString();
      fmtpObj.params = {};
      fmtpObj.params[param] = value;
      const result = SdpUtils.writeFmtpLine(fmtpObj);
      if (result) {
        sdpLines.splice(index + 1, 0, result);
      }
    } else {
      fmtpObj = SdpUtils.parseFmtpLine(sdpLines[fmtpLineIndex]);
      if (fmtpObj) {
        fmtpObj.params[param] = value;
        const result = SdpUtils.writeFmtpLine(fmtpObj);
        if (result) {
          sdpLines[fmtpLineIndex] = result;
        }
      }
    }

    sdp = sdpLines.join('\r\n');
    return sdp;
  }

  // Remove fmtp param if it exists.
  public static removeCodecParam(sdp: string, codec: string, param: string): string {
    const sdpLines = sdp.split('\r\n');

    const fmtpLineIndex = SdpUtils.findFmtpLine(sdpLines, codec);
    if (fmtpLineIndex === null) {
      return sdp;
    }

    const map = SdpUtils.parseFmtpLine(sdpLines[fmtpLineIndex]);
    if (map === null) {
      return sdp;
    }
    delete map.params[param];

    const newLine = SdpUtils.writeFmtpLine(map);
    if (newLine === null) {
      sdpLines.splice(fmtpLineIndex, 1);
    } else {
      sdpLines[fmtpLineIndex] = newLine;
    }

    sdp = sdpLines.join('\r\n');
    return sdp;
  }

  // Split an fmtp line into an object including 'pt' and 'params'.
  public static parseFmtpLine(fmtpLine: string): null | FormatObject {
    const fmtpObj: FormatObject = {pt: '', params: {}};
    const spacePos = fmtpLine.indexOf(' ');
    const keyValues = fmtpLine.substring(spacePos + 1).split(';');

    const pattern = new RegExp('a=fmtp:(\\d+)');
    const result = fmtpLine.match(pattern);
    if (result && result.length === 2) {
      fmtpObj.pt = result[1];
    } else {
      return null;
    }

    const params: FormatParams = {};
    for (const pairString of keyValues) {
      const pair = pairString.split('=');
      if (pair.length === 2) {
        params[pair[0]] = pair[1];
      }
    }
    fmtpObj.params = params;

    return fmtpObj;
  }

  // Generate an fmtp line from an object including 'pt' and 'params'.
  public static writeFmtpLine(fmtpObj: FormatObject): string | null {
    if (!Object.prototype.hasOwnProperty.call(fmtpObj, 'pt') || !Object.prototype.hasOwnProperty.call(fmtpObj, 'params')) {
      return null;
    }
    const pt = fmtpObj.pt;
    const params = fmtpObj.params;
    const keyValues = [];
    let i = 0;
    for (const key in params) {
      if (params[key]) {
        keyValues[i] = key + '=' + params[key];
        ++i;
      }
    }
    if (i === 0) {
      return null;
    }
    return 'a=fmtp:' + pt?.toString() + ' ' + keyValues.join(';');
  }

  // Find fmtp attribute for |codec| in |sdpLines|.
  public static findFmtpLine(sdpLines: string[], codec: string): number | null {
    // Find payload of codec.
    const payload = SdpUtils.getCodecPayloadType(sdpLines, codec);
    // Find the payload in fmtp line.
    return payload ? SdpUtils.findLine(sdpLines, 'a=fmtp:' + payload.toString()) : null;
  }

  // Find the line in sdpLines that starts with |prefix|, and, if specified,
  // contains |substr| (case-insensitive search).
  public static findLine(sdpLines: string[], prefix: string, substr?: string): number | null {
    return SdpUtils.findLineInRange(sdpLines, 0, -1, prefix, substr);
  }

  // Find the line in sdpLines[startLine...endLine - 1] that starts with |prefix|
  // and, if specified, contains |substr| (case-insensitive search).
  public static findLineInRange(
    sdpLines: string[],
    startLine: number,
    endLine: number,
    prefix?: string,
    substr?: string,
    direction?: 'asc' | 'desc'
  ): number | null {
    if (direction === undefined) {
      direction = 'asc';
    }

    direction = direction || 'asc';

    if (direction === 'asc') {
      // Search beginning to end
      const realEndLine = endLine !== -1 ? endLine : sdpLines.length;
      for (let i = startLine; i < realEndLine; ++i) {
        if (prefix && sdpLines[i].indexOf(prefix) === 0) {
          if (!substr ||
              sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
            return i;
          }
        }
      }
    } else {
      // Search end to beginning
      const realStartLine = startLine !== -1 ? startLine : sdpLines.length - 1;
      for (let j = realStartLine; j >= 0; --j) {
        if (prefix && sdpLines[j].indexOf(prefix) === 0) {
          if (!substr ||
              sdpLines[j].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
            return j;
          }
        }
      }
    }
    return null;
  }

  // Gets the codec payload type from sdp lines.
  public static getCodecPayloadType(sdpLines: string[], codec: string): string | null {
    const index = SdpUtils.findLine(sdpLines, 'a=rtpmap', codec);
    return index ? SdpUtils.getCodecPayloadTypeFromLine(sdpLines[index]) : null;
  }

  // Gets the codec payload type from an a=rtpmap:X line.
  public static getCodecPayloadTypeFromLine(sdpLine: string): string | null {
    const pattern = new RegExp('a=rtpmap:(\\d+) [a-zA-Z0-9-]+\\/\\d+');
    const result = sdpLine.match(pattern);
    return (result && result.length === 2) ? result[1] : null;
  }

  // Returns a new m= line with the specified codec as the first one.
  public static setDefaultCodec(mLine: string, payload: string): string {
    const elements = mLine.split(' ');

    // Just copy the first three parameters; codec order starts on fourth.
    const newLine = elements.slice(0, 3);

    // Put target payload first and copy in the rest.
    newLine.push(payload);
    for (let i = 3; i < elements.length; i++) {
      if (elements[i] !== payload) {
        newLine.push(elements[i]);
      }
    }
    return newLine.join(' ');
  }


}
