<script setup lang="ts">
import { ElScrollbar } from "element-plus";
import AiMessage from "./ai-message.vue";
import UserMessage from "./user-message.vue";
import { nextTick, onBeforeUnmount, onMounted, ref, useTemplateRef } from "vue";

interface MessageBase {
  // avatarUrl: string;
  content?: string | null;
  createdTime: number;
  //   children: MessageBase[];
}

export interface UserMessage extends MessageBase {
  role: "user";
  attachList: []; // 附件列表
}

interface ThinkBase {
  text: string;
  state: string;
}
interface ThinkCompleted extends ThinkBase {
  state: "isCompleted";
  duration: number;
}
interface ThinkNotCompleted extends ThinkBase {
  state: "isThinking" | "isPaused";
}
interface AiMessage extends MessageBase {
  role: "assistant";
  think: {
    content?: string | null;
    duration?: number | null;
  };
  state: "paused" | "processing" | "completed";
  //   type: "answering" | "history";
}

export type Message = UserMessage | AiMessage;
interface MessageBase {
  reGeneratedMessages?: Message[] | null;
}

interface Props {
  messageList: Message[];
}
const props = defineProps<Props>();
const atBottom = ref(true);
const scrollRef = useTemplateRef("scrollRef");
const preventScrollEvent = ref(false);

const handleScroll = (e) => {
  if (preventScrollEvent.value) {
    preventScrollEvent.value = false;
    return;
  }
  const scrollElm = scrollRef.value?.wrapRef;
  if (!scrollElm) return;

  // console.log('scrolleee')
  if (isJsScroll.value) {
    // if (
    //   Math.abs(
    //     scrollElm.clientHeight + scrollElm.scrollTop - scrollElm.scrollHeight
    //   ) <= 2
    // ) {
    //   scrollToBottom();
    //   preventScrollEvent.value = true;
    // }
    atBottom.value = true;
    isJsScroll.value = false;
    return;
  }

  if (
    Math.abs(
      scrollElm.clientHeight + scrollElm.scrollTop - scrollElm.scrollHeight
    ) <= 2
  ) {
    atBottom.value = true;
  } else {
    atBottom.value = false;
  }
};
const isJsScroll = ref(false);
function scrollToBottom() {
  const scrollElm = scrollRef.value?.wrapRef;
  if (!scrollElm) return;
  isJsScroll.value = true;
  // scrollRef.value.setScrollTop(scrollElm.scrollHeight);
  scrollElm.scrollTop = scrollElm.scrollHeight;
}
onMounted(() => {
  const scrollElm = scrollRef.value?.wrapRef;
  if (!scrollElm) return;

  const resizeObserver = new ResizeObserver(async (entries) => {
    console.log("resize");
    // await nextTick()
    if (atBottom.value) {
      // setTimeout(() => {

      scrollToBottom();
      // },10)
    }
  });
  resizeObserver.observe(scrollElm.lastElementChild!);
  onBeforeUnmount(() => {
    resizeObserver.disconnect();
  });
});
</script>
<template>
  <!-- <div> -->
  <ElScrollbar ref="scrollRef" class="scroll-container" @scroll="handleScroll">
    <div class="flex flex-col gap-2">
      <template v-for="message of props.messageList">
        <AiMessage
          v-if="message.role === 'assistant'"
          :content="message.content"
          :is-paused="message.state === 'paused'"
          :think-content="message.think.content"
          :think-duration="message.think.duration"
        />
        <UserMessage v-else :content="message.content"> </UserMessage>
      </template>
    </div>
  </ElScrollbar>
  <!-- </div> -->
</template>

<style scoped lang="scss">
.scroll-container {
  :deep(.el-scrollbar__wrap) {
    max-width: 800px;
    margin: auto;
    .el-scrollbar__view {
      padding: 38px 36px 0 36px;
    }
  }
}
</style>
