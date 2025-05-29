<script setup lang="ts">
import { useDeepSeek } from "@/hooks/use-deep-seek";
import MessageList, {
  type Message,
  type UserMessage,
} from "./message-list/message-list.vue";
import { ElButton, ElInput } from "element-plus";
import {
  computed,
  effectScope,
  reactive,
  ref,
  toRaw,
  toRef,
  watch,
  type Ref,
} from "vue";
import ChatInput from "./chat-input/chat-input.vue";
import { useDeepSeekChat } from "@/hooks/use-deep-seek-chat";
import type { Session } from "./side-bar/side-bar.vue";

const props = defineProps<{
  session: Session;
}>();

const messageList = toRef(props.session, "messageList");

// const chatQuery = useDeepSeek();
const chatQuery = useDeepSeekChat();
const text = ref("");

// const props.messageList = ref<Message[]>([]);

const handleSumbit = () => {
  const userMessage: UserMessage = {
    attachList: [],
    createdTime: Date.now(),
    role: "user",
    content: text.value,
  };

  messageList.value.push(userMessage);

  const _messageList = messageList.value.map((item) => ({
    role: item.role,
    content: item.content ?? "",
  }));

  const scope = effectScope();
  scope.run(() => {
    const { state, think, answer } = chatQuery(_messageList);

    switch(state.value) {
      case 'idle': {
        break;
      }
      case 'pending': {
        break;
      }
      case 'thinking': {
        break;
      }
      case 'answering': {
        break;
      }
      case 'compeleted': {
        break;
      }
      case 'aborted': {
        break;
      }
    }
  });
};
const handlePause = () => {
  chatQuery.abortController?.abort();
};

function handleSubmit(formData: { text: string }) {
  const userMessage: UserMessage = {
    attachList: [],
    createdTime: Date.now(),
    role: "user",
    content: formData.text,
  };

  messageList.value.push(userMessage);

  const _messageList = messageList.value.map((item) => ({
    role: item.role,
    content: item.content ?? "",
  }));

  chatQuery.query(_messageList);
}
watch(
  () => chatQuery.state,
  () => {
    switch (chatQuery.state) {
      case "thinking": {
        messageList.value.push(
          reactive({
            role: "assistant",
            state: "processing",
            createdTime: Date.now(),
            text: computed(() => chatQuery.answer.html),
            think: computed(() => ({
              text: chatQuery.think.html,
              duration: chatQuery.think.duration,
            })),
          })
        );
        break;
      }
      case "compeleted": {
        let lastMessage = {
          ...messageList.value[messageList.value.length - 1],
        };
        if (
          lastMessage.role === "assistant" &&
          lastMessage.state === "processing"
        ) {
          lastMessage.state = "completed";
          messageList.value.pop();
          messageList.value.push(lastMessage);
        }
        break;
      }
      case "aborted": {
        let lastMessage = {
          ...messageList.value[messageList.value.length - 1],
        };
        if (
          lastMessage.role === "assistant" &&
          lastMessage.state === "processing"
        ) {
          //  lastMessage = {...toRaw( lastMessage),state: 'completed'}
          lastMessage.state = "paused";
          messageList.value.pop();
          messageList.value.push(lastMessage);
        }
        break;
      }
    }
  }
);
</script>
<template>
  <div class="flex flex-col">
    <MessageList class="flex-1 min-h-0" :message-list="messageList">
    </MessageList>

    <ChatInput @submit="handleSubmit"></ChatInput>
  </div>
</template>

<style scoped></style>
