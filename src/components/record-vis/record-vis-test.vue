<script setup lang="ts">
import { ref } from "vue";
import RecordVis from "./record-vis.vue";
import { ElInput } from "element-plus";

const isRecording = ref(false);
const text = ref("");
function toggleRecording() {
  isRecording.value = !isRecording.value;
}
</script>
<template>
  <div class="container">
    <!-- 波形可视化 -->
    <!-- <div ref="wavesurferContainer" class="waveform"></div> -->
    <RecordVis v-model:result="text" :is-recording="isRecording" show-wave />
    <ElInput v-model="text" :disabled="isRecording"></ElInput>
    <!-- 控制按钮 -->
    <button @click="toggleRecording">
      {{ isRecording ? "停止录音" : "开始录音" }}
    </button>
  </div>
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
