<script setup lang="ts">
import { ref, watch } from "vue";
import type { Session } from "./side-bar/side-bar.vue";
import SideBar from "./side-bar/side-bar.vue";
import AiChat from "./ai-chat.vue";
import { nanoid } from "nanoid";
import NewSession from "./new-session/new-session.vue";
import type { IFormData } from "./chat-input/chat-input.vue";

const props = defineProps<{}>();

const sessionList = ref<Session[]>([
  {
    id: nanoid(),
    messageList: [],
    createdTime: 0,
    title: "",
  },
]);
const selectedSession = ref<Session>(sessionList.value[0]);
// function handleNewSession(session: Session) {
//   sessionList.value.unshift(session);
//   // selectedSession.value = sessionList.value[0];
// }

function handleSessionCreated(session: Session) {
  // selectedSessionId.value = session.id;
  sessionList.value.unshift({
    id: nanoid(),
    messageList: [],
    createdTime: 0,
    title: "",
  });
  selectedSession.value = session;
}
</script>
<template>
  <div class="flex gap-2">
    <SideBar
      :session-list="sessionList"
      v-model:selected-session="selectedSession"
    ></SideBar>
    <KeepAlive>
      <AiChat
        class="flex-1 min-w-0 max-w-[800px] mx-auto mb-4"
        :session="selectedSession"
        :key="selectedSession.id"
        @created="handleSessionCreated"
      >
      </AiChat>
    </KeepAlive>
  </div>
</template>

<style scoped></style>
