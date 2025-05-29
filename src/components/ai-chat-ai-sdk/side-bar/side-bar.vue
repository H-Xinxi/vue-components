<script setup lang="ts">
import SvgIcon from "@/components/svg-icon.vue";
import { Expand, Fold, MoreFilled } from "@element-plus/icons-vue";
import {
  ClickOutside as vClickOutside,
  ElButton,
  ElDropdown,
  ElDropdownItem,
  ElDropdownMenu,
  ElIcon,
  ElInput,
  ElScrollbar,
  ElTooltip,
} from "element-plus";
import type { Message } from "../message-list/message-list.vue";
import { ref, toRef } from "vue";
import { vFocus } from "@/directives/v-focus";
import type { Chat, SessionInfo } from "../Session";
// import {} from '../'
// ClickOutside
const props = defineProps<{
  sessionInfoList: SessionInfo[];
}>();

const emits = defineEmits<{
  delete: [id: string];
}>();
// const sessionList = toRef(props, "sessionList");
const selectedSessionId = defineModel<string | null>("selectedSessionId", {
  default: null,
});

function handleSelectSession(session: SessionInfo) {
  selectedSessionId.value = session.id;
}

function handleClickNewSession() {
  selectedSessionId.value = null;
  // props.sessionList.createSession()
}

const isFold = ref(false);
function handleExpand() {
  isFold.value = false;
}

function handleNewSession() {
  selectedSessionId.value = null;
}

const renamingSession = ref<SessionInfo | null>(null);

function handleCommand(session: SessionInfo, command: "rename" | "delete") {
  switch (command) {
    case "rename": {
      renamingSession.value = session;
      break;
    }
    case "delete": {
      if (session.id === selectedSessionId.value)
        selectedSessionId.value = null;

      emits("delete", session.id);
      break;
    }
  }
}

const handleClickOutside = (e) => {
  renamingSession.value = null;
};
</script>
<template>
  <div
    v-if="!isFold"
    class="pl-5 pt-6 w-64 shrink-0 h-full flex flex-col gap-8 bg-[#f9fbff]"
  >
    <div class="flex justify-between items-center h-[26px]">
      <SvgIcon name="deepseek_font_logo" :height="26" :width="142"></SvgIcon>
      <ElTooltip content="收起边栏">
        <ElIcon
          class="cursor-pointer mr-2 text-neutral-400!"
          size="22"
          @click="isFold = true"
          ><Fold
        /></ElIcon>
      </ElTooltip>
    </div>
    <div class="flex gap-2">
      <ElButton
        class="h-11! bg-[rgb(219_234_254)]! text-[#4d6bfe]! rounded-2xl! hover:bg-[#c6dcf8]!"
        @click="handleClickNewSession"
      >
        <SvgIcon class="mr-2" :size="22" name="new_session"></SvgIcon>
        开启新对话</ElButton
      >
    </div>

    <div class="flex-1">
      <ElScrollbar>
        <div class="flex flex-col">
          <template
            v-for="(session, index) of props.sessionInfoList"
            :key="session.id"
          >
            <div
              class="group relative hover:bg-blue-50 rounded-xl flex h-9 px-2 items-center"
              :class="[
                {
                  'bg-blue-100!': session.id === selectedSessionId,
                  'border-blue-500! border-2 bg-transparent!':
                    renamingSession && renamingSession.id === session.id,
                },
              ]"
              @click="handleSelectSession(session)"
            >
              <template v-if="renamingSession?.id !== session.id">
                <div class="flex-1 overflow-hidden text-nowrap">
                  {{ session.title }}
                </div>
                <div class="relative w-6 h-6 group grid place-items-center">
                  <div
                    class="rounded-lg absolute inset-0 bg-[#f9fbff] opacity-0 group-hover:opacity-100 transition-opacity"
                  ></div>
                  <ElDropdown
                    trigger="click"
                    @command="handleCommand(session, $event)"
                  >
                    <!-- <ElDropdownI -->
                    <ElIcon
                      class="z-[2] cursor-pointer"
                      :class="{
                        'hidden! group-hover:block!':
                          session.id !== selectedSessionId,
                      }"
                      size="16"
                      @click.stop
                      ><MoreFilled
                    /></ElIcon>
                    <template #dropdown>
                      <ElDropdownMenu>
                        <ElDropdownItem command="rename">重命名</ElDropdownItem>
                        <ElDropdownItem command="delete">删除 </ElDropdownItem>
                      </ElDropdownMenu>
                    </template>
                  </ElDropdown>
                </div>

                <div
                  class="absolute top-0 right-0 w-6 h-full bg-gradient-to-r from-transparent to-50% to-[#f9fbff]"
                ></div>
                <div
                  class="absolute top-0 right-0 h-full w-20 bg-gradient-to-r from-transparent to-[#f9fbff]"
                ></div>
              </template>

              <template v-else>
                <ElInput
                  class="rename-input"
                  v-focus
                  v-click-outside="handleClickOutside"
                  v-model="renamingSession.title"
                  @click.stop
                  @keydown.enter="renamingSession = null"
                ></ElInput>
              </template>
            </div>
          </template>
        </div>
      </ElScrollbar>
    </div>
  </div>
  <div
    v-else
    class="w-16 h-full text-neutral-400 bg-[#f9fbff] flex flex-col pt-5 gap-7 items-center"
  >
    <SvgIcon class="cursor-pointer" :size="44" name="deepseek_icon"></SvgIcon>
    <ElTooltip content="打开边栏">
      <ElIcon class="cursor-pointer" size="28" @click="handleExpand">
        <Expand></Expand>
      </ElIcon>
    </ElTooltip>
    <ElTooltip content="开启新对话">
      <SvgIcon
        class="cursor-pointer"
        :size="28"
        name="new_session"
        @click="handleNewSession"
      ></SvgIcon>
    </ElTooltip>
  </div>
</template>

<style scoped lang="scss">
.rename-input {
  font-size: inherit !important;
  // background-color: red;
  :deep(.el-input__wrapper) {
    padding: 0 !important;
    background-color: transparent !important;
    box-shadow: none !important;
    .el-input__inner {
      color: inherit !important;
    }
  }
}
</style>
