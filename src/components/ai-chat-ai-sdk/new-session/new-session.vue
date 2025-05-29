<script setup lang="ts">
import ChatInput, { type IFormData } from "../chat-input/chat-input.vue";
import type { Session } from "../side-bar/side-bar.vue";
import { nanoid } from "nanoid";
import SvgIcon from "@/components/svg-icon.vue";

const props = defineProps<{
  // session: Session;
}>();
const emits = defineEmits<{
  newSession: [session: Session];
}>();
// const messageList = toRef(props.session, "messageList");

// const chatQuery = useDeepSeek();
// const { query, think, answer, state, abortController } = useDeepSeek();

// watch(state, () => {
//   switch (state.value) {
//     case "idle": {
//       break;
//     }
//     case "pending": {
//       break;
//     }
//     case "thinking": {
//       messageList.value.push(
//         reactive({
//           role: "assistant",
//           createdTime: Date.now(),
//           state: "processing",
//           think: computed(() => ({
//             content: think.html,
//             duration: think.duration,
//           })),
//           content: computed(() => answer.html),
//         })
//       );
//       break;
//     }
//     case "answering": {
//       break;
//     }
//     case "compeleted": {
//       const message = messageList.value.pop();
//       if (message && message.role === "assistant")
//         messageList.value.push({ ...message, state: "completed" });
//       else {
//         throw new Error();
//       }
//       break;
//     }
//     case "aborted": {
//       const message = messageList.value.pop();
//       if (message && message.role === "assistant")
//         messageList.value.push({ ...message, state: "paused" });
//       else {
//         throw new Error();
//       }
//       break;
//     }
//   }
// });

function handleSubmit(formData: IFormData) {
  // emits('newSession', formData)
  const newSession: Session = {
    id: nanoid(),
    isNewSession: true,
    createdTime: Date.now(),
    messageList: [
      {
        attachList: [],
        createdTime: Date.now(),
        role: "user",
        content: formData.text,
      },
    ],
    title: formData.text,
  };
  emits("newSession", newSession);
}
</script>
<template>
  <div class="flex relative flex-col justify-center items-center gap-5">
    <div
      class="text-2xl leading-none relative text-[#262626] font-bold grid place-items-center"
    >
      <div class="flex items-center">
        <SvgIcon class="mr-8 scale-250" :size="24" name="deepseek_icon"></SvgIcon>
        我是 DeepSeek，很高兴见到你！
      </div>
      <!-- <div
        class="h-8 absolute top-full left-0 right-0 bg-linear-to-b from-[rgba(255,255,255,0.8)] to-transparent"
      ></div> -->
    </div>
    <div class="text-sm text-[#404040]">
      我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~
    </div>
    <!-- <MessageList class="flex-1 min-h-0" :message-list="messageList">
    </MessageList> -->

    <ChatInput @submit="handleSubmit"></ChatInput>
  </div>
</template>

<style scoped></style>
