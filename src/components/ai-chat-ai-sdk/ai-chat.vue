<script setup lang="ts">
import { useChat } from "@ai-sdk/vue";
import { computed, reactive, toRef, toValue, useTemplateRef, watch } from "vue";
import StreamMarkdown from "./stream-markdown.vue";
import SvgIcon from "../svg-icon.vue";
import { User } from "@element-plus/icons-vue";
import {
  ElAvatar,
  ElCollapse,
  ElCollapseItem,
  ElScrollbar,
} from "element-plus";
import { AssistantMessage, Chat, SessionInfo } from "./Session";
import ElScrollbarAutoBottom from "../element-plus/el-scrollbar/el-scrollbar-auto-bottom/el-scrollbar-auto-bottom.vue";
import { z } from "zod";

const props = defineProps<{
  sessionInfo: SessionInfo;
  isNew?: boolean;
}>();
const emits = defineEmits<{
  created: [title: string];
}>();

const scrollRef = useTemplateRef("scrollRef");

const chat = reactive(
  new Chat(
    useChat({
      id: props.sessionInfo.id,
      api: "/api",
      sendExtraMessageFields: true,
      onResponse(response) {
        if (props.isNew) {
          emits("created", chat.messages[0].content);
        }
      },
    })
  )
);
// watch(() => chat.messages, () => {
//   console.log((chat.messages[1].partStatus))
// })
// function experimental_prepareRequestBody(options) {
//   return { ...options, messages: session.messages };
// }
// messages.value[0].

function handleSendUserMessage(e: Event) {
  if (scrollRef.value?.wrapRef) {
    scrollRef.value?.setScrollTop(scrollRef.value.wrapRef?.scrollHeight);
  }
  // if (props.session.isNewSession) {
  //   props.session.create({
  //     title: input.value,
  //     messages,
  //   });
  //   // emits("created");
  // }
  chat.handleSubmit(e);
}
</script>

<template>
  <div class="flex flex-col w-full py-24 mx-auto stretch">
    <div class="flex-1 min-h-0">
      <ElScrollbar ref="scrollRef">
        <ElScrollbarAutoBottom class="px-6">
          <div
            v-for="(m, index) in chat.messages"
            :key="m.id"
            class="flex gap-4"
            :class="{
              'flex-row-reverse': m.role === 'user',
            }"
          >
            <SvgIcon
              v-if="m.role === 'assistant'"
              class="shrink-0"
              name="deepseek_icon"
              :size="28"
            ></SvgIcon>
            <ElAvatar
              v-else-if="m.role === 'user'"
              class="shrink-0"
              :size="28"
              :icon="User"
            />
            <!-- {{ m.role === "user" ? "User: " : "AI: " }} -->
            <div
              class="max-w-fit flex-1 min-w-0 message-body"
              :class="{
                'py-2 px-5 bg-[#eff6ff] rounded-xl': m.role === 'user',
              }"
            >
              <template v-for="part of m.parts" :key="m.id">
                <template v-if="part.type === 'reasoning'">
                  <!-- think -->
                  <ElCollapse class="border-0!" model-value="true">
                    <ElCollapseItem
                      name="true"
                      class="[&_.el-collapse-item\\_\\_wrap]:border-0! [&_.el-collapse-item\\_\\_arrow:not(.is-active)]:-rotate-90! [&_.el-collapse-item\\_\\_header]:text-neutral-800 [&_.el-collapse-item\\_\\_arrow]:m-0! [&_.el-collapse-item\\_\\_header]:p-[7px_14px]! [&_.el-collapse-item\\_\\_header]:h-8! [&_.el-collapse-item\\_\\_header]:w-auto! [&_.el-collapse-item\\_\\_header]:rounded-[10px]! [&_.el-collapse-item\\_\\_header]:bg-gray-100!"
                    >
                      <template #title>
                        <div class="text-xs flex items-center">
                          <SvgIcon
                            class="mr-2"
                            :size="12"
                            name="think"
                          ></SvgIcon>
                          <span v-if="m.partStatus === 'reasoning'"> 思考中 </span>
                          <span v-else-if="m.partStatus !== 'step-start'">
                            已深度思考 (用时
                            {{ (m.reasoningDuration! / 1000).toFixed(2) }} 秒)
                          </span>
                        </div>
                      </template>
                      <blockquote>
                        <StreamMarkdown
                          :isStreaming="!!m.content"
                          :content="part.reasoning"
                        >
                        </StreamMarkdown>
                      </blockquote>
                    </ElCollapseItem>
                  </ElCollapse>
                </template>
                <StreamMarkdown
                  v-else-if="part.type === 'text'"
                  :isStreaming="
                    m instanceof AssistantMessage && m.status !== 'completed'
                  "
                  :content="part.text"
                >
                </StreamMarkdown>
              </template>
            </div>
            <div class="w-7 shrink-0"></div>
          </div>
        </ElScrollbarAutoBottom>
      </ElScrollbar>
    </div>

    <form @submit="handleSendUserMessage">
      <input
        class="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
        v-model="chat.input"
        placeholder="Say something..."
      />
    </form>
  </div>
</template>
<style scoped lang="scss">
.message-body {
  blockquote {
    margin: 0;
    padding: 0 1em;
    color: #57606a;
    border-left: 0.25em solid #d0d7de;
  }
}
</style>
