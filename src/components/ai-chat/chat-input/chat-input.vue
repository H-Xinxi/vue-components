<script setup lang="ts">
import { Top } from "@element-plus/icons-vue";
import { ElButton, ElInput, ElSpace, ElTooltip } from "element-plus";
import { reactive, ref, watchEffect } from "vue";

export interface IFormData {
  text: string;
}
const props = defineProps<{
  isPending: boolean;
  isAnswering: boolean;
}>();
watchEffect(() => {
  if(props.isAnswering) {
    formData.text = ''
  }
})
const emits = defineEmits<{
  submit: [{ text: string }];
  stop: [];
}>();
const formData = reactive({
  text: "",
});
function handleSubmit() {
  emits("submit", { ...formData });
}
function handleStop() {
  emits("stop");
}
</script>
<template>
  <div class="bg-gray-100 flex flex-col p-2.5 rounded-3xl w-full">
    <ElInput
      v-model="formData.text"
      :disabled="isPending"
      :autosize="{ minRows: 2, maxRows: 12 }"
      type="textarea"
      placeholder="给 DeepSeek 发送消息"
      @keydown.enter="handleSubmit"
    />
    <div class="h-8 flex justify-between">
      <ElSpace>
        <ElButton>深度思考(R1)</ElButton>

        <ElButton>联网搜索</ElButton>
      </ElSpace>
      <ElSpace>
        <ElButton>上传附件</ElButton>
        <ElButton
          v-if="!isAnswering"
          :loading="isPending"
          :disabled="!formData.text"
          :icon="Top"
          circle
          type="primary"
          @click="handleSubmit"
        ></ElButton>
        <ElButton v-else circle type="primary" @click="handleStop">
          <div class="w-[14px] h-[14px] border-1 rounded-xs"></div>
        </ElButton>
      </ElSpace>
    </div>
  </div>
</template>

<style scoped lang="scss">
.el-textarea {
  :deep(.el-textarea__inner) {
    box-shadow: none;
    resize: none;
    background-color: transparent;
  }
}
</style>
