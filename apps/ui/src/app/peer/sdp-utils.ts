import { SdpSettings } from "./peer-connection-client";

export class  SdpUtils {

  public static iceCandidateType(candidateStr: string): string {
    return candidateStr.split(' ')[7];
  }

  public static maybeSetOpusOptions(sdp: string, params: SdpSettings) {
    // Set Opus in Stereo, if stereo is true, unset it, if stereo is false, and
    // do nothing if otherwise.
    if (params.opusStereo === 'true') {
      sdp = SdpUtils.setCodecParam(sdp, 'opus/48000', 'stereo', '1');
    } else if (params.opusStereo === 'false') {
      sdp = SdpUtils.removeCodecParam(sdp, 'opus/48000', 'stereo');
    }
  
    // Set Opus FEC, if opusfec is true, unset it, if opusfec is false, and
    // do nothing if otherwise.
    if (params.opusFec === 'true') {
      sdp = SdpUtils.setCodecParam(sdp, 'opus/48000', 'useinbandfec', '1');
    } else if (params.opusFec === 'false') {
      sdp = SdpUtils.removeCodecParam(sdp, 'opus/48000', 'useinbandfec');
    }
  
    // Set Opus DTX, if opusdtx is true, unset it, if opusdtx is false, and
    // do nothing if otherwise.
    if (params.opusDtx === 'true') {
      sdp = SdpUtils.setCodecParam(sdp, 'opus/48000', 'usedtx', '1');
    } else if (params.opusDtx === 'false') {
      sdp = SdpUtils.removeCodecParam(sdp, 'opus/48000', 'usedtx');
    }
  
    // Set Opus maxplaybackrate, if requested.
    if (params.opusMaxPbr) {
      sdp = SdpUtils.setCodecParam(
          sdp, 'opus/48000', 'maxplaybackrate', params.opusMaxPbr);
    }
    return sdp;
  }
  
  public static maybeSetAudioSendBitRate(sdp: string, params: SdpSettings) {
    if (!params.audioSendBitrate) {
      return sdp;
    }
    // console.log('Prefer audio send bitrate: ' + params.audioSendBitrate);
    return SdpUtils.preferBitRate(sdp, params.audioSendBitrate, 'audio');
  }
  
  public static maybeSetAudioReceiveBitRate(sdp: string, params: SdpSettings) {
    if (!params.audioRecvBitrate) {
      return sdp;
    }
    // console.log('Prefer audio receive bitrate: ' + params.audioRecvBitrate);
    return SdpUtils.preferBitRate(sdp, params.audioRecvBitrate, 'audio');
  }
  
  public static maybeSetVideoSendBitRate(sdp: string, params: SdpSettings) {
    if (!params.videoSendBitrate) {
      return sdp;
    }
    // console.log('Prefer video send bitrate: ' + params.videoSendBitrate);
    return SdpUtils.preferBitRate(sdp, params.videoSendBitrate, 'video');
  }
  
  public static maybeSetVideoReceiveBitRate(sdp: string, params: SdpSettings) {
    if (!params.videoRecvBitrate) {
      return sdp;
    }
    // console.log('Prefer video receive bitrate: ' + params.videoRecvBitrate);
    return SdpUtils.preferBitRate(sdp, params.videoRecvBitrate, 'video');
  }
  
  // Add a b=AS:bitrate line to the m=mediaType section.
  public static preferBitRate(sdp: string, bitrate: string | number, mediaType: string) {
    var sdpLines = sdp.split('\r\n');
  
    // Find m line for the given mediaType.
    var mLineIndex = SdpUtils.findLine(sdpLines, 'm=', mediaType);
    if (mLineIndex === null) {
      // console.log('Failed to add bandwidth line to sdp, as no m-line found');
      return sdp;
    }
  
    // Find next m-line if any.
    var nextMLineIndex = SdpUtils.findLineInRange(sdpLines, mLineIndex + 1, -1, 'm=');
    if (nextMLineIndex === null) {
      nextMLineIndex = sdpLines.length;
    }
  
    // Find c-line corresponding to the m-line.
    var cLineIndex = SdpUtils.findLineInRange(sdpLines, mLineIndex + 1,
        nextMLineIndex, 'c=');
    if (cLineIndex === null) {
      // console.log('Failed to add bandwidth line to sdp, as no c-line found');
      return sdp;
    }
  
    // Check if bandwidth line already exists between c-line and next m-line.
    var bLineIndex = SdpUtils.findLineInRange(sdpLines, cLineIndex + 1,
        nextMLineIndex, 'b=AS');
    if (bLineIndex) {
      sdpLines.splice(bLineIndex, 1);
    }
  
    // Create the b (bandwidth) sdp line.
    var bwLine = 'b=AS:' + bitrate;
    // As per RFC 4566, the b line should follow after c-line.
    sdpLines.splice(cLineIndex + 1, 0, bwLine);
    sdp = sdpLines.join('\r\n');
    return sdp;
  }
  
  // Add an a=fmtp: x-google-min-bitrate=kbps line, if videoSendInitialBitrate
  // is specified. We'll also add a x-google-min-bitrate value, since the max
  // must be >= the min.
  public static maybeSetVideoSendInitialBitRate(sdp: string, params: SdpSettings) {
    if (!params.videoSendInitialBitrate) {
      return sdp;
    }
    let initialBitrate = typeof params.videoSendInitialBitrate === 'string' ? parseInt(params.videoSendInitialBitrate) : params.videoSendInitialBitrate;
    if (!initialBitrate) {
      return sdp;
    }
  
    // Validate the initial bitrate value.
    var maxBitrate = (typeof initialBitrate === 'string') ? parseInt(initialBitrate, 10) : initialBitrate;
    if (params.videoSendBitrate) {
      let bitrate = typeof params.videoSendBitrate === 'string' ? parseInt(params.videoSendBitrate) : params.videoSendBitrate;
      if (bitrate) {
        if (initialBitrate > bitrate) {
          // console.log('Clamping initial bitrate to max bitrate of ' + bitrate + ' kbps.');
          initialBitrate = bitrate;
          params.videoSendInitialBitrate = initialBitrate;
        }
        maxBitrate = bitrate;
      }
    }
  
    var sdpLines = sdp.split('\r\n');
  
    // Search for m line.
    var mLineIndex = SdpUtils.findLine(sdpLines, 'm=', 'video');
    if (mLineIndex === null) {
      // console.log('Failed to find video m-line');
      return sdp;
    }
    // Figure out the first codec payload type on the m=video SDP line.
    var videoMLine = sdpLines[mLineIndex];
    var pattern = new RegExp('m=video\\s\\d+\\s[A-Z/]+\\s');
    var sendPayloadType = videoMLine.split(pattern)[1].split(' ')[0];
    var line = SdpUtils.findLine(sdpLines, 'a=rtpmap', sendPayloadType)
    if (!line) {
      return sdp;
    }
    var fmtpLine = sdpLines[line];
    var codecName = fmtpLine.split('a=rtpmap:' +
        sendPayloadType)[1].split('/')[0];
  
    // Use codec from params if specified via URL param, otherwise use from SDP.
    var codec = params.videoSendCodec || codecName;
    sdp = SdpUtils.setCodecParam(sdp, codec, 'x-google-min-bitrate', params.videoSendInitialBitrate.toString());
    sdp = SdpUtils.setCodecParam(sdp, codec, 'x-google-max-bitrate', maxBitrate.toString());
  
    return sdp;
  }
  
  public static removePayloadTypeFromMline(mLine: string, payloadType: string) {
    const mLineArray = mLine.split(' ');
    for (let i = 0; i < mLineArray.length; ++i) {
      if (mLineArray[i] === payloadType.toString()) {
        mLineArray.splice(i, 1);
      }
    }
    return mLineArray.join(' ');
  }
  
  public static removeCodecByName(sdpLines: string[], codec: string) {
    var index = SdpUtils.findLine(sdpLines, 'a=rtpmap', codec);
    if (index === null) {
      return sdpLines;
    }
    var payloadType = SdpUtils.getCodecPayloadTypeFromLine(sdpLines[index]);
    if (!payloadType) {
      return sdpLines;
    }
    sdpLines.splice(index, 1);
  
    // Search for the video m= line and remove the codec.
    var mLineIndex = SdpUtils.findLine(sdpLines, 'm=', 'video');
    if (mLineIndex === null) {
      return sdpLines;
    }
    sdpLines[mLineIndex] = SdpUtils.removePayloadTypeFromMline(sdpLines[mLineIndex], payloadType);
    return sdpLines;
  }
  
  public static removeCodecByPayloadType(sdpLines: string[], payloadType: string) {
    var index = SdpUtils.findLine(sdpLines, 'a=rtpmap', payloadType.toString());
    if (index === null) {
      return sdpLines;
    }
    sdpLines.splice(index, 1);
  
    // Search for the video m= line and remove the codec.
    var mLineIndex = SdpUtils.findLine(sdpLines, 'm=', 'video');
    if (mLineIndex === null) {
      return sdpLines;
    }
    sdpLines[mLineIndex] = SdpUtils.removePayloadTypeFromMline(sdpLines[mLineIndex],
        payloadType);
    return sdpLines;
  }
  
  public static maybeRemoveVideoFec(sdp: string, params: SdpSettings) {
    if (params.videoFec !== 'false') {
      return sdp;
    }
  
    var sdpLines = sdp.split('\r\n');
  
    var index = SdpUtils.findLine(sdpLines, 'a=rtpmap', 'red');
    if (index === null) {
      return sdp;
    }
    var redPayloadType = SdpUtils.getCodecPayloadTypeFromLine(sdpLines[index]);
    sdpLines = SdpUtils.removeCodecByPayloadType(sdpLines, redPayloadType);
    sdpLines = SdpUtils.removeCodecByName(sdpLines, 'ulpfec');
  
    // Remove fmtp lines associated with red codec.
    index = SdpUtils.findLine(sdpLines, 'a=fmtp', redPayloadType.toString());
    if (index === null) {
      return sdp;
    }
    var fmtpLine = SdpUtils.parseFmtpLine(sdpLines[index]);
    var rtxPayloadType = fmtpLine.pt;
    if (rtxPayloadType === null) {
      return sdp;
    }
    sdpLines.splice(index, 1);
  
    sdpLines = SdpUtils.removeCodecByPayloadType(sdpLines, rtxPayloadType);
    return sdpLines.join('\r\n');
  }
  
  // Promotes |audioSendCodec| to be the first in the m=audio line, if set.
  public static maybePreferAudioSendCodec(sdp: string, params) {
    return SdpUtils.maybePreferCodec(sdp, 'audio', 'send', params.audioSendCodec);
  }
  
  // Promotes |audioRecvCodec| to be the first in the m=audio line, if set.
  public static maybePreferAudioReceiveCodec(sdp: string, params: SdpSettings) {
    return SdpUtils.maybePreferCodec(sdp, 'audio', 'receive', params.audioRecvCodec);
  }
  
  // Promotes |videoSendCodec| to be the first in the m=audio line, if set.
  public static maybePreferVideoSendCodec(sdp: string, params: SdpSettings) {
    return SdpUtils.maybePreferCodec(sdp, 'video', 'send', params.videoSendCodec);
  }
  
  // Promotes |videoRecvCodec| to be the first in the m=audio line, if set.
  public static maybePreferVideoReceiveCodec(sdp: string, params: SdpSettings) {
    return SdpUtils.maybePreferCodec(sdp, 'video', 'receive', params.videoRecvCodec);
  }
  
  // Sets |codec| as the default |type| codec if it's present.
  // The format of |codec| is 'NAME/RATE', e.g. 'opus/48000'.
  public static maybePreferCodec(sdp: string, type: string, dir: string, codec?: string ) {
    var str = type + ' ' + dir + ' codec';
    if (!codec) {
      // console.log('No preference on ' + str + '.');
      return sdp;
    }
  
    // console.log('Prefer ' + str + ': ' + codec);
  
    var sdpLines = sdp.split('\r\n');
  
    // Search for m line.
    var mLineIndex = SdpUtils.findLine(sdpLines, 'm=', type);
    if (mLineIndex === null) {
      return sdp;
    }
  
    // If the codec is available, set it as the default in m line.
    var payload = null;
    // Iterate through rtpmap enumerations to find all matching codec entries
    for (var i = sdpLines.length-1; i >= 0 ; --i) {
      // Finds first match in rtpmap
      var index = SdpUtils.findLineInRange(sdpLines, i, 0, 'a=rtpmap', codec, 'desc');
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
  public static setCodecParam(sdp, codec, param, value) {
    var sdpLines = sdp.split('\r\n');
  
    var fmtpLineIndex = SdpUtils.findFmtpLine(sdpLines, codec);
  
    var fmtpObj: {pt?: string, params?: any}= {};
    if (fmtpLineIndex === null) {
      var index = SdpUtils.findLine(sdpLines, 'a=rtpmap', codec);
      if (index === null) {
        return sdp;
      }
      var payload = SdpUtils.getCodecPayloadTypeFromLine(sdpLines[index]);
      fmtpObj.pt = payload.toString();
      fmtpObj.params = {};
      fmtpObj.params[param] = value;
      sdpLines.splice(index + 1, 0, SdpUtils.writeFmtpLine(fmtpObj));
    } else {
      fmtpObj = SdpUtils.parseFmtpLine(sdpLines[fmtpLineIndex]);
      fmtpObj.params[param] = value;
      sdpLines[fmtpLineIndex] = SdpUtils.writeFmtpLine(fmtpObj);
    }
  
    sdp = sdpLines.join('\r\n');
    return sdp;
  }
  
  // Remove fmtp param if it exists.
  public static removeCodecParam(sdp, codec, param) {
    var sdpLines = sdp.split('\r\n');
  
    var fmtpLineIndex = SdpUtils.findFmtpLine(sdpLines, codec);
    if (fmtpLineIndex === null) {
      return sdp;
    }
  
    var map = SdpUtils.parseFmtpLine(sdpLines[fmtpLineIndex]);
    delete map.params[param];
  
    var newLine = SdpUtils.writeFmtpLine(map);
    if (newLine === null) {
      sdpLines.splice(fmtpLineIndex, 1);
    } else {
      sdpLines[fmtpLineIndex] = newLine;
    }
  
    sdp = sdpLines.join('\r\n');
    return sdp;
  }
  
  // Split an fmtp line into an object including 'pt' and 'params'.
  public static parseFmtpLine(fmtpLine): null | {pt?: string, params?: any} {
    var fmtpObj: {pt?: string, params?: any} = {};
    var spacePos = fmtpLine.indexOf(' ');
    var keyValues = fmtpLine.substring(spacePos + 1).split(';');
  
    var pattern = new RegExp('a=fmtp:(\\d+)');
    var result = fmtpLine.match(pattern);
    if (result && result.length === 2) {
      fmtpObj.pt = result[1];
    } else {
      return null;
    }
  
    var params = {};
    for (var i = 0; i < keyValues.length; ++i) {
      var pair = keyValues[i].split('=');
      if (pair.length === 2) {
        params[pair[0]] = pair[1];
      }
    }
    fmtpObj.params = params;
  
    return fmtpObj;
  }
  
  // Generate an fmtp line from an object including 'pt' and 'params'.
  public static writeFmtpLine(fmtpObj) {
    if (!fmtpObj.hasOwnProperty('pt') || !fmtpObj.hasOwnProperty('params')) {
      return null;
    }
    var pt = fmtpObj.pt;
    var params = fmtpObj.params;
    var keyValues = [];
    var i = 0;
    for (var key in params) {
      keyValues[i] = key + '=' + params[key];
      ++i;
    }
    if (i === 0) {
      return null;
    }
    return 'a=fmtp:' + pt.toString() + ' ' + keyValues.join(';');
  }
  
  // Find fmtp attribute for |codec| in |sdpLines|.
  public static findFmtpLine(sdpLines, codec) {
    // Find payload of codec.
    var payload = SdpUtils.getCodecPayloadType(sdpLines, codec);
    // Find the payload in fmtp line.
    return payload ? SdpUtils.findLine(sdpLines, 'a=fmtp:' + payload.toString()) : null;
  }
  
  // Find the line in sdpLines that starts with |prefix|, and, if specified,
  // contains |substr| (case-insensitive search).
  public static findLine(sdpLines: string[], prefix: string, substr?: string) {
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
  ) {
    if (direction === undefined) {
      direction = 'asc';
    }
  
    direction = direction || 'asc';
  
    if (direction === 'asc') {
      // Search beginning to end
      var realEndLine = endLine !== -1 ? endLine : sdpLines.length;
      for (var i = startLine; i < realEndLine; ++i) {
        if (sdpLines[i].indexOf(prefix) === 0) {
          if (!substr ||
              sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1) {
            return i;
          }
        }
      }
    } else {
      // Search end to beginning
      var realStartLine = startLine !== -1 ? startLine : sdpLines.length-1;
      for (var j = realStartLine; j >= 0; --j) {
        if (sdpLines[j].indexOf(prefix) === 0) {
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
  public static getCodecPayloadType(sdpLines: string[], codec: string) {
    var index = SdpUtils.findLine(sdpLines, 'a=rtpmap', codec);
    return index ? SdpUtils.getCodecPayloadTypeFromLine(sdpLines[index]) : null;
  }
  
  // Gets the codec payload type from an a=rtpmap:X line.
  public static getCodecPayloadTypeFromLine(sdpLine: string) {
    var pattern = new RegExp('a=rtpmap:(\\d+) [a-zA-Z0-9-]+\\/\\d+');
    var result = sdpLine.match(pattern);
    return (result && result.length === 2) ? result[1] : null;
  }
  
  // Returns a new m= line with the specified codec as the first one.
  public static setDefaultCodec(mLine: string, payload: string) {
    var elements = mLine.split(' ');
  
    // Just copy the first three parameters; codec order starts on fourth.
    var newLine = elements.slice(0, 3);
  
    // Put target payload first and copy in the rest.
    newLine.push(payload);
    for (var i = 3; i < elements.length; i++) {
      if (elements[i] !== payload) {
        newLine.push(elements[i]);
      }
    }
    return newLine.join(' ');
  }
  

}