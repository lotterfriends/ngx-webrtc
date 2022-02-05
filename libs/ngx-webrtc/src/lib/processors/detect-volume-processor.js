class DetectVolumeProcessor extends AudioWorkletProcessor {
  volume = 0;
  averaging = 0.95;
  pause = false;

  static get parameterDescriptors() {
    return [
      {
        name: 'averaging',
        defaultValue: 0.95
      },
    ];
  }

  constructor() {
    super();

    this.port.onmessage = (event) => {
      if (event.data === 'pause') {
        this.pause = true;
      }
      if (event.data === 'play') {
        this.pause = false;
      }
    };
  }

  process(inputs, outputs, paramaters) {
    
    if (!this.pause) {
      if (paramaters && paramaters.averaging && paramaters.averaging.length) {
        this.averaging = paramaters.averaging[0];
      }

      const input = inputs[0];
      const inputChannel = input[0];

      const buf = inputChannel;
      const bufLength = buf.length;

      let sum = 0;
      let x;

      for (let i = 0; i < bufLength; i++) {
        x = buf[i];
        sum += x * x;
      }
  
      const rms = Math.sqrt(sum / bufLength);
      this.volume = Math.max(rms, this.volume * this.averaging);
      this.port.postMessage(this.volume);
    }
    return true;
  }

}

registerProcessor('detect-volume', DetectVolumeProcessor);