<script setup lang="ts">
import { useDeepSeek } from "@/hooks/use-deep-seek";
import MessageList, { type UserMessage } from "./message-list/message-list.vue";
import { computed, onMounted, reactive, ref, toRef, watch } from "vue";
import ChatInput from "./chat-input/chat-input.vue";
import type { Session } from "./side-bar/side-bar.vue";
import SvgIcon from "../svg-icon.vue";
const props = defineProps<{
  session: Session;
}>();
const emits = defineEmits<{
  created: [Session];
}>();
const messageList = toRef(props.session, "messageList");
const isNewSession = computed(() => messageList.value.length === 0);
// const chatQuery = useDeepSeek();
const {
  query: deepSeekQuery,
  think,
  answer,
  state,
  abortController,
} = useDeepSeek();

async function chatQuery() {
  const _messageList = messageList.value.map((item) => ({
    role: item.role,
    content: item.content ?? "",
  }));

  await deepSeekQuery(_messageList);
}

// onMounted(() => {
//   if (props.session.isNewSession) {
//     // delete props.session.isNewSession;
//     chatQuery();
//   }
// });

watch(state, () => {
  switch (state.value) {
    case "idle": {
      break;
    }
    case "pending": {
      break;
    }
    case "thinking": {
      if (messageList.value.length === 0) {
        props.session.title = newUserMessage.value?.content ?? "新会话";
        props.session.createdTime = Date.now();
        emits("created", props.session);
      }
      // if(props.session.isNewSession) {
      //   delete props.session.isNewSession
      //   emits('created', props.session)

      // }

      messageList.value.push(newUserMessage.value!);
      newUserMessage.value = null;
      messageList.value.push(
        reactive({
          role: "assistant",
          createdTime: Date.now(),
          state: "processing",
          think: computed(() => ({
            content: think.html,
            duration: think.duration,
          })),
          content: computed(() => answer.html),
        })
      );
      break;
    }
    case "answering": {
      break;
    }
    case "compeleted": {
      const message = messageList.value.pop();
      if (message && message.role === "assistant")
        messageList.value.push({ ...message, state: "completed" });
      else {
        throw new Error();
      }
      break;
    }
    case "aborted": {
      const message = messageList.value.pop();
      if (message && message.role === "assistant")
        messageList.value.push({ ...message, state: "paused" });
      else {
        throw new Error();
      }
      break;
    }
  }
});

const newUserMessage = ref<UserMessage | null>(null);

async function onSubmit(formData: { text: string }) {
  const userMessage: UserMessage = {
    attachList: [],
    createdTime: Date.now(),
    role: "user",
    content: formData.text,
  };
  newUserMessage.value = userMessage;
  const _messageList = messageList.value.map((item) => ({
    role: item.role,
    content: item.content ?? "",
  }));

  await deepSeekQuery([
    ..._messageList,
    { role: userMessage.role, content: userMessage.content! },
  ]);
}
function handleStop() {
  abortController.value?.abort();
}
</script>
<template>
  <div class="flex relative flex-col justify-center">
    <template v-if="!isNewSession">
      <div
        class="z-10 relative pt-2 h-12 text-[#262626] font-bold text-base grid place-items-center"
      >
        <div class="max-w-[400px] truncate">
          {{ session.title }}
        </div>
        <div
          class="h-8 absolute top-full left-0 right-0 bg-linear-to-b from-[rgba(255,255,255,0.8)] to-transparent"
        ></div>
      </div>
      <MessageList class="flex-1 min-h-0" :message-list="messageList">
      </MessageList>
    </template>
    <template v-else>
      <div
        class="text-2xl leading-none relative text-[#262626] font-bold grid place-items-center"
      >
        <div class="flex items-center">
          <SvgIcon
            class="mr-8 scale-250"
            :size="24"
            name="deepseek_icon"
          ></SvgIcon>
          我是 DeepSeek，很高兴见到你！
        </div>
      </div>
      <div class="text-sm text-[#404040] mx-auto my-5">
        我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~
      </div>
    </template>
    <ChatInput
      :is-pending="state === 'pending'"
      :is-answering="state === 'thinking' || state === 'answering'"
      @submit="onSubmit"
      @stop="handleStop"
    ></ChatInput>
  </div>
</template>

<style scoped></style>
