<script setup lang="ts">
import { computed, ref, watch, type Ref } from "vue";
import SideBar from "./side-bar/side-bar.vue";
import AiChat from "./ai-chat.vue";
import type { SessionInfo } from "./Session";
import NewSession from "./new-session/new-session.vue";
import { nanoid } from "nanoid";
import { generateId } from "ai";

const sessionInfoList = ref<SessionInfo[]>([]);
const selectedSessionId = ref<string | null>(null);
const selectedSessionInfo = computed(() => {
  return sessionInfoList.value.find(
    (item) => item.id === selectedSessionId.value
  );
});

const newSessionInfo = ref<SessionInfo>({
  id: generateId(),
  createdAt: 0,
  title: "",
});

const onSessionCreated = (title:string) => {
  newSessionInfo.value.title = title
  sessionInfoList.value.unshift(newSessionInfo.value);
  selectedSessionId.value = newSessionInfo.value.id;

  newSessionInfo.value = {
    id: generateId(),
    createdAt: 0,
    title: "",
  };
};
</script>
<template>
  <div class="flex gap-2">
    <SideBar
      :session-info-list="sessionInfoList"
      v-model:selected-session-id="selectedSessionId"
    ></SideBar>
    <KeepAlive>
      <AiChat
        v-if="selectedSessionInfo"
        class="flex-1 min-w-0 max-w-[800px] mx-auto mb-4"
        :session-info="selectedSessionInfo"
        :key="selectedSessionInfo.id"
      >
      </AiChat>

      <!-- <NewSession v-else></NewSession> -->
      <AiChat
        v-else
        :session-info="newSessionInfo"
        is-new
        :key="newSessionInfo.id"
        @created="onSessionCreated"
      ></AiChat>
    </KeepAlive>
  </div>
</template>

<style scoped></style>
