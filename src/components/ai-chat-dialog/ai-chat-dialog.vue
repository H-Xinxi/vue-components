<script setup lang="ts">
import { ElButton, ElDialog, ElScrollbar } from "element-plus";
import { ref, useTemplateRef } from "vue";
import ElDialogResizeHandlers from "../el-dialog-resize-handlers.vue";
import UserMessage from "./user-message.vue";
import AiMessage from "./ai-message.vue";
const dialogVisible = ref(false);

type AiMessage = {
  role: "ai";
  text: string;
};
type UserMessage = {
  role: "user";
} & {
  type: "text";
  text: string;
};

type Message = AiMessage | UserMessage;
const messageList = ref<Message[]>([
  {
    role: "user",
    type: "text",
    text: "你好asfasfsadffffffffffffffffffasdfsafsafsafsafsd",
  },
  {
    role: "ai",
    text: "你好",
  },
  {
    role: "user",
    type: "text",
    text: "你好asfasfsadffffffffffffffffffasdfsafsafsafsafsd",
  },
  {
    role: "ai",
    text: "你好",
  },
  {
    role: "user",
    type: "text",
    text: "你好asfasfsadffffffffffffffffffasdfsafsafsafsafsd",
  },
  {
    role: "ai",
    text: "你好",
  },
  {
    role: "user",
    type: "text",
    text: "你好asfasfsadffffffffffffffffffasdfsafsafsafsafsd",
  },
  {
    role: "ai",
    text: "你好",
  },
]);
const scrollRef = useTemplateRef("scrollRef");
const handleClick = () => {
  scrollRef.value?.setScrollTop(scrollRef.value.wrapRef?.scrollHeight);
};
const atBottom = ref(false);
const handleScroll = ({ scrollTop: number }) => {
  const elem = scrollRef.value?.wrapRef!;
  if (Math.abs(elem.scrollHeight - elem.scrollTop - elem.clientHeight) <= 1) {
    atBottom.value = true;
  } else {
    atBottom.value = false;
  }
};
</script>

<template>

    <ElButton @click="dialogVisible = true"> ai 对话 </ElButton>
    <!-- <div class="pointer-events-none"> -->
    <ElDialog
      class="absolute! pointer-events-auto w-[500px] min-w-1/2 min-h-[400px]  h-[500px] top-10 right-10 m-0! flex flex-col"
      modal-class="pointer-events-none"
      body-class="flex-1 min-h-0"
      :close-on-click-modal="false"
      v-model="dialogVisible"
      :modal="false"
    >
      <ElDialogResizeHandlers ></ElDialogResizeHandlers>
      <template #header>
        <div>ai 对话</div>
      </template>
      <ElScrollbar ref="scrollRef" @scroll="handleScroll">
        <button @click="handleClick">asd</button>
        <template v-for="message of messageList">
          <UserMessage
            v-if="message.role === 'user'"
            :type="message.type"
            :data="message.text"
          >
          </UserMessage>
          <AiMessage v-else :data="message.text"> </AiMessage>
          <div></div>
        </template>
      </ElScrollbar>
    </ElDialog>

</template>

<style scoped></style>
