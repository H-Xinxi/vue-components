<script setup lang="ts">
import {
  ref,
  watch,
  shallowRef,
  onUnmounted,
  useTemplateRef,
  watchEffect,
} from "vue";
import WaveSurfer from "wavesurfer.js";
import Record from "wavesurfer.js/dist/plugins/record";
import audioProcessorUrl from "./audio-processor?url";

import { v4 as uuidv4 } from "uuid";
const props = withDefaults(defineProps<{
  showWave?: boolean
}>(), {
  showWave:false
})
const result = defineModel<string>("result", {
  default: "",
});
const isRecording = defineModel<boolean>("isRecording", {
  default: false,
});
// 状态管理
// 生成32位随机ID
const TASK_ID = uuidv4().replace(/-/g, "").slice(0, 32);

const wavesurfer = shallowRef<WaveSurfer | null>(null);

// const isRecording = ref(false);

const wavesurferContainerRef = useTemplateRef("wavesurferContainer");

const mediaStream = shallowRef<MediaStream | null>(null);
const websocket = shallowRef<WebSocket | null>(null);
const audioChunk = shallowRef<Int8Array | null>(null);

interface AsrResponseData {
  header: {
    task_id: string;
    event:
      | "task-started"
      | "result-generated"
      | "task-finished"
      | "task-failed";
    attributes: {};
  };
  payload: {
    output: {
      transcription: {
        begin_time: number;
        end_time: number;
        pre_end_failed: boolean;
        sentence_end: boolean;
        sentence_id: number;
        text: string;
        vad_pre_end: boolean;
        words: {
          begin_time: number;
          end_time: number;
          fixed: boolean;
          punctuation: string;
          speaker_id: string | null;
          text: string;
        }[];
      };
    };
    usage: {
      duration: number;
    };
  };
}

const wsData = shallowRef<AsrResponseData | null>(null);

let audioWorkletNode = null as AudioWorkletNode | null;

watch(isRecording, () => {
  if (isRecording.value) {
    completedSentences.value = result.value
    startRecording();
  } else {
    stopRecording();
  }
});

watch(audioChunk, () => {
  // console.log(audioChunk.value)
  // if (!websocket.value || !audioChunk.value || !canSend.value) return;
  if (!websocket.value) return;
  if (!audioChunk.value) return;
  if (websocket.value.readyState !== WebSocket.OPEN) return;
  if (
    wsData.value &&
    wsData.value.header.event !== "task-started" &&
    wsData.value.header.event !== "result-generated"
  )
    return;
  websocket.value.send(audioChunk.value);
});

const completedSentences = ref("");
const progressingSentence = ref("");

watchEffect(() => {
  result.value = completedSentences.value + progressingSentence.value;
});
// const result = computed(
//   () => completedSentences.value + progressingSentence.value
// );
watch(wsData, () => {
  const message = wsData.value;
  if (!message) return;
  switch (message.header.event) {
    case "task-started":
      console.log("任务开始");
      // sendAudioStream();
      // asrStarted.value = true;
      break;
    case "result-generated":
      // 解析payload中的transcription
      if (message.payload.output.transcription) {
        const transcription = message.payload.output.transcription;
        if (transcription.sentence_end) {
          completedSentences.value += transcription.text;
          progressingSentence.value = "";
        } else {
          progressingSentence.value = transcription.text;
        }
      }
      break;
    case "task-finished":
      console.log("任务完成");
      websocket.value?.close();
      break;
    case "task-failed":
      console.error("任务失败：", message.header.error_message);
      websocket.value?.close();
      break;
    default:
      console.log("未知事件：", message.header.event);
  }
});

// Wavesurfer 初始化
const initVisualizer = async (mediaStream: MediaStream, elm: HTMLElement) => {
  wavesurfer.value = WaveSurfer.create({
    container: elm,
    waveColor: "#4a90e2",
    progressColor: "#d3e6ff",
    cursorWidth: 0,
    interact: false,
    backend: "WebAudio",
  });
  const record = wavesurfer.value.registerPlugin(Record.create({}));
  record.renderMicStream(mediaStream);
};
// WebSocket 连接管理
const initWebSocket = () => {
  websocket.value = new WebSocket(window.location.origin + "/ws");
  //   websocket.value.addEventListener('')
  websocket.value.onopen = () => {
    const runTaskMessage = {
      header: {
        action: "run-task",
        task_id: TASK_ID,
        streaming: "duplex",
      },
      payload: {
        task_group: "audio",
        task: "asr",
        function: "recognition",
        model: "gummy-realtime-v1",
        parameters: {
          sample_rate: 16000,
          format: "pcm",
          transcription_enabled: true,
          //   translation_enabled: true,
          //   translation_target_languages: ["zh"],
        },
        input: {},
      },
    };
    websocket.value!.send(JSON.stringify(runTaskMessage));
  };
  websocket.value.onmessage = (e) => {
    wsData.value = JSON.parse(e.data);
    return;
  };
  websocket.value.onclose = () => {
    if (progressingSentence.value) {
      completedSentences.value += progressingSentence.value;
      progressingSentence.value = "";
    }
  };
};
// function sendFinishTask() {
//   const finishTaskMessage = {
//     header: {
//       action: "finish-task",
//       task_id: TASK_ID,
//       streaming: "duplex",
//     },
//     payload: {
//       input: {},
//     },
//   };
//   websocket.value?.send(JSON.stringify(finishTaskMessage));
// }
async function initAudioWorklet(stream: MediaStream) {
  const audioContext = new AudioContext({
    sampleRate: 16000,
  });
  //   audioContext.ch/
  // 加载并注册 AudioWorklet 处理器
  await audioContext.audioWorklet.addModule(audioProcessorUrl);

  const microphoneSource = audioContext.createMediaStreamSource(stream);
  audioWorkletNode = new AudioWorkletNode(audioContext, "audio-processor", {
    outputChannelCount: [1],

    processorOptions: {
      targetSampleRate: 16000,
      chunkDuration: 100,
    },
  });
  // 连接处理链路
  microphoneSource.connect(audioWorkletNode);
  audioWorkletNode.connect(audioContext.destination);
  // 接收来自 Worklet 的音频数据
  audioWorkletNode.port.onmessage = (e) => {
    audioChunk.value = e.data;
  };
}

// 录音控制
const startRecording = async () => {
  const _mediaStream = await navigator.mediaDevices.getUserMedia({
    audio: {
      channelCount: 1, // 强制单声道
      sampleRate: 16000, // 优先使用16000Hz
      sampleSize: 16, // 16位采样
    },
  });
  mediaStream.value = _mediaStream;
  await initAudioWorklet(mediaStream.value);
  wavesurferContainerRef.value &&
    initVisualizer(_mediaStream, wavesurferContainerRef.value);
  initWebSocket();
};
// 发送finish-task指令
function sendFinishTask() {
  const finishTaskMessage = {
    header: {
      action: "finish-task",
      task_id: TASK_ID,
      streaming: "duplex",
    },
    payload: {
      input: {},
    },
  };
  websocket.value?.send(JSON.stringify(finishTaskMessage));
}
const stopRecording = () => {
  if (mediaStream.value) {
    // mediaStream.value.
    mediaStream.value.getTracks().forEach((track) => track.stop());
  }
  audioWorkletNode?.disconnect();
  audioWorkletNode?.port.postMessage({
    type: "stop",
  });
  if (websocket.value) {
    sendFinishTask();
    websocket.value.close();
  }
  wavesurfer.value?.destroy();
};

// 切换录音状态
const toggleRecording = () => {
  isRecording.value = !isRecording.value;
};

onUnmounted(() => {
  stopRecording();
});
</script>
<template>
  <div v-if="showWave" ref="wavesurferContainer" class="waveform"></div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.waveform {
  width: 100%;
  height: 200px;
  background: #1a1a1a;
  border-radius: 8px;
  margin-bottom: 20px;
}

.result {
  min-height: 60px;
  padding: 15px;
  margin: 20px 0;
  background: #f5f5f5;
  border-radius: 4px;
  font-size: 18px;
  line-height: 1.6;
}

button {
  padding: 12px 24px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #357abd;
}
</style>
