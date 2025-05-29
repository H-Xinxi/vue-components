<script setup lang="ts">
import { ElButton } from "element-plus";
// import AiChatDialog from "./components/ai-chat-dialog/ai-chat-dialog.vue";
import DialogTest from "./components/dialog-test.vue";
import HDrawerTest from "./components/h-drawer/h-drawer-test.vue";
import HFormTest from "./components/h-form/h-form-test.vue";
import HelloWorld from "./components/HelloWorld.vue";
import TableTest from "./components/table-test.vue";
import { screenShot } from "./hooks/use-screen-shot";
import { checkIfBrowserSupported, takeScreenshot } from "@xata.io/screenshot";
import { domToPng } from "modern-screenshot";
import ScreenShot from "./components/screen-shot/screen-shot.vue";
import { ref, useTemplateRef } from "vue";
import AiChatTest from "./views/ai-chat-test.vue";
import ChatInput from "./components/ai-chat/chat-input/chat-input.vue";
// import AiChat from "./components/ai-chat/ai-chat.vue";
import type { Message } from "./components/ai-chat/message-list/message-list.vue";
import type { Session } from "./components/ai-chat/side-bar/side-bar.vue";
import RecordVis from "./components/record-vis/record-vis.vue";
import RecordVisTest from "./components/record-vis/record-vis-test.vue";
import AiChatDialog from "./components/ai-chat-ai-sdk/ai-chat-dialog.vue";
import StreamMarkdown from "./components/ai-chat/stream-markdown.vue";
import AiChat from "./components/ai-chat-ai-sdk/ai-chat.vue";
// import AiChat from "./components/ai-chat-ai-sdk/ai-chat-dialog.vue";
const screenShotRef = useTemplateRef("screenShotRef");

const handleClickScreenShotButton = () => {
  // takeScreenshot().then((s) => {
  //   console.log(s)
  //       const link = document.createElement("a");
  //   link.download = "screenshot.png";
  //   link.href = s;
  //   link.click();
  // });
  screenShotRef.value?.screenShot();
  // domToPng(document.querySelector("#app"), {
  //   style: {
  //     width: "200px",
  //     height: "200px",
  //     scrollTop,
  //   },
  //   features: {
  //     restoreScrollPosition: true,
  //   },
  // }).then((dataUrl) => {
  //   const link = document.createElement("a");
  //   link.download = "screenshot.png";
  //   link.href = dataUrl;
  //   link.click();
  // });
};
// document.addEventListener('click', handleClickScreenShotButton)
const handleScreenShot = (imageBlob: Blob) => {
  console.log("imageBlob", imageBlob);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(imageBlob);
  a.download = "screenshot";
  a.click();
  URL.revokeObjectURL(a.href);
};

const sessionList = ref<Session[]>([
  {
    title: "test",
    createdTime: Date.now(),
    messageList: [],
  },
  {
    title: "test",
    createdTime: Date.now(),
    messageList: [],
  },
]);
const selectedSessionIndex = ref(0);

const messageList = ref<Message[]>([]);
const handleClick = () => {
  if (selectedSessionIndex.value === 0) {
    selectedSessionIndex.value = 1;
  } else {
    selectedSessionIndex.value = 0;
  }
};
</script>

<template>
  <!-- <AiChatDialog class="fixed inset-0"></AiChatDialog> -->
  <AiChatDialog class="fixed inset-0"></AiChatDialog>
   <!-- <HFormTest></HFormTest> -->
  <!-- <StreamMarkdown></StreamMarkdown> -->
  <div @click="">
    <!-- <RecordVisTest></RecordVisTest> -->
    <!-- <RecordVis></RecordVis> -->

    <!-- <AiChatTest></AiChatTest> -->
    <!-- <AiChat
      class="w-screen h-screen"
      v-model:message-list="sessionList[selectedSessionIndex].messageList"
    ></AiChat>
    <ElButton @click="handleClick">
      test
    </ElButton> -->
    <!-- <ElButton @click="handleClickScreenShotButton"> 截图 </ElButton>
    <ScreenShot
      ref="screenShotRef"
      @screen-shot="handleScreenShot"
    ></ScreenShot>
    <HFormTest></HFormTest>
    <DialogTest></DialogTest>
    <TableTest></TableTest>
    <AiChatDialog></AiChatDialog>
    <HDrawerTest></HDrawerTest>
    <div style="height: 100px; overflow: auto">
      <div style="height: 100px"></div>
      <div style="height: 100px; background-color: greenyellow"></div>
    </div>
    <div style="height: 1000px; background-color: red"></div> -->
  </div>
  <!-- <HelloWorld msg="Vite + Vue" /> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
