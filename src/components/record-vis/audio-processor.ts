declare var sampleRate: number;
// audio-processor.js (AudioWorklet 处理器)
class AudioProcessor extends AudioWorkletProcessor {
  buffer: Int16Array;
  currentBufferLenght: number;
  targetSampleRate: number;
  isActive = true;
  constructor(options?: AudioWorkletNodeOptions) {
    super();
    const chunkDuration = options?.processorOptions.chunkDuration ?? 100;
    this.targetSampleRate = options?.processorOptions.targetSampleRate ?? 16000; // 目标采样率

    const bufferLength =
      Math.ceil(((chunkDuration / 1000) * sampleRate) / 128) * 128 * 2;
    this.buffer = new Int16Array(bufferLength/2);
    this.currentBufferLenght = 0;
    this.port.onmessage = (e) => {
      if (e.data.type === "stop") {
        this.isActive = false;
      }
    };
  }

  process(inputs: Float32Array[][]) {
    const input = inputs[0];

    if (!input || input.length === 0) return true;

    // 多声道转单声道
    const monoData = input[0];
    // const monoData = this.mixToMono(input);

    // 重采样处理
    const resampled = this.resample(monoData, this.targetSampleRate);

    // 转换为16位PCM
    const pcm16 = this.float32ToInt16(resampled);

    // 发送处理后的数据

    this.buffer.set(pcm16, this.currentBufferLenght);
    this.currentBufferLenght = this.currentBufferLenght + pcm16.length;
    if (this.currentBufferLenght >= this.buffer.length) {
      this.port.postMessage(this.buffer);
      this.currentBufferLenght = 0;
    }

    return this.isActive;
  }

  // 多声道混合为单声道
  mixToMono(inputChannels: Float32Array[]) {
    if (inputChannels.length === 1) return inputChannels[0];
    const mixed = new Float32Array(inputChannels[0].length);

    for (let channel of inputChannels) {
      for (let i = 0; i < channel.length; i++) {
        mixed[i] += channel[i] / inputChannels.length;
      }
    }
    return mixed;
  }

  // 动态重采样
  resample(audioData: Float32Array, targetRate: number) {
    if (sampleRate === targetRate) return audioData;
    const ratio = sampleRate / targetRate;
    const newLength = Math.round(audioData.length / ratio);
    const resampled = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const index = i * ratio;
      const floor = Math.floor(index);
      const fraction = index - floor;
      resampled[i] =
        audioData[floor] * (1 - fraction) +
        audioData[Math.min(floor + 1, audioData.length - 1)] * fraction;
    }
    return resampled;
  }

  // 浮点转16位整型
  float32ToInt16(buffer: Float32Array) {
    // const int16Array = new Int16Array(buffer.length);
    // for (let i = 0; i < buffer.length; i++) {
    //   let s = Math.max(-1, Math.min(1, buffer[i]));
    //   int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    // }
    // return int16Array;
    const int16Array = new Int16Array(
      buffer.buffer,
      buffer.byteOffset,
      buffer.byteLength / 2
    );
    for (let i = 0; i < buffer.length; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Array.subarray(0, buffer.length);
  }
}

registerProcessor("audio-processor", AudioProcessor);
