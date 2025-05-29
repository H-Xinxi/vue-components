<script setup lang="ts">
import SvgIcon from "@/components/svg-icon.vue";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CopyDocument,
  Refresh,
} from "@element-plus/icons-vue";
import {
  ElButton,
  ElCollapse,
  ElCollapseItem,
  ElIcon,
  ElMessage,
  ElScrollbar,
  ElSpace,
  ElTooltip,
} from "element-plus";
import { ref, useTemplateRef } from "vue";

interface Props {
  thinkContent: string;
  // isThinking: boolean;
  // state: "thinking" | "answering" | "paused" | "completed";
  isPaused: boolean;
  thinkDuration?: number | null;
  content?: string | null;
}
const props = defineProps<Props>();
const showThinkContent = ref("true");
const contentRef = useTemplateRef("contentRef");


const copyedTimer = ref<number | null>(null)
function handleCopy() {
  if (!contentRef.value) return;
  const text = contentRef.value.innerText;
  navigator.clipboard.writeText(text).then(() => {
    copyedTimer.value = setTimeout(() => {
      copyedTimer.value = null
    }, 1000)
    ElMessage.success('复制成功')
  }).catch(() => {
    ElMessage.error('复制失败')
  });
}
</script>
<template>
  <div class="group w-full flex gap-4">
    <!-- <el-avatar :size="50" :src="" /> -->
    <div
      class="w-8 h-8 grid place-items-center rounded-full border-1 border-neutral-300"
    >
      <SvgIcon name="deepseek_icon" :size="28"></SvgIcon>
    </div>
    <!-- <el-avatar :size="50" :src="props.avatarUrl" /> -->
    <div class="flex-1 flex flex-col min-w-[400px]">
      <!-- think -->
      <ElCollapse class="border-0!" v-model="showThinkContent">
        <ElCollapseItem
          name="true"
          class="[&_.el-collapse-item\\_\\_wrap]:border-0! [&_.el-collapse-item\\_\\_arrow:not(.is-active)]:-rotate-90! [&_.el-collapse-item\\_\\_header]:text-neutral-800 [&_.el-collapse-item\\_\\_arrow]:m-0! [&_.el-collapse-item\\_\\_header]:p-[7px_14px]! [&_.el-collapse-item\\_\\_header]:h-8! [&_.el-collapse-item\\_\\_header]:w-auto! [&_.el-collapse-item\\_\\_header]:rounded-[10px]! [&_.el-collapse-item\\_\\_header]:bg-gray-100!"
        >
          <template #title>
            <!-- <ElButton> -->
            <SvgIcon class="mr-2" :size="12" name="think"></SvgIcon>
            <span class="pr-2 text-xs">
              <template v-if="props.thinkDuration == null">
                <span v-if="!props.isPaused"> 思考中 </span>
                <span v-else-if="props.isPaused"> 思考已暂停 </span>
              </template>
              <span class="text-neutral-800" v-else>
                {{
                  `已深度思考 (用时 ${(props.thinkDuration / 1000).toFixed(
                    2
                  )} 秒)`
                }}
              </span>
            </span>

            <!-- <ElIcon @click="showThinkContent = !showThinkContent">
              <ArrowUp v-if="showThinkContent" />
              <ArrowDown v-else />
            </ElIcon> -->
            <!-- </ElButton> -->
          </template>
          <!-- <ElScrollbar :max-height="300"> -->
          <div
            class="text-[#8b8b8b] pl-3 border-l-2 border-[#e5e5e5]"
            v-html="props.thinkContent"
          ></div>
          <!-- </ElScrollbar> -->
        </ElCollapseItem>
      </ElCollapse>
      <!-- answer -->
      <div
        ref="contentRef"
        class="text-base text-[#404040]"
        v-html="props.content"
      ></div>
      <ElSpace
        v-if="props.content"
        class="opacity-0 group-hover:opacity-100 transition-opacity [--tw-duration:300ms] mt-3 [&>*]:cursor-pointer [&>*]:hover:bg-neutral-100 [&>*]:transition-[background] [&>*]:w-7 [&>*]:h-7 [&>*]:rounded-lg [&>*]:grid [&>*]:place-items-center"
      >
        <!-- <ElButton :icon="Refresh" type="text"></ElButton> -->
        <ElTooltip effect="dark" content="复制" placement="top">
          <ElIcon size="20" color="#909090" @click="handleCopy"
            >
            <CopyDocument v-if="!copyedTimer"/>
            <Check v-else/>
        </ElIcon>
        </ElTooltip>
        <ElTooltip effect="dark" content="重新生成" placement="top">
          <ElIcon size="20" color="#909090"><Refresh /></ElIcon>
        </ElTooltip>

        <!-- <ElIcon><Refresh/></ElIcon> -->
      </ElSpace>
      <!-- action buttons -->
    </div>
  </div>
</template>

<style scoped lang="scss">
.el-collapse-item {
  :deep(.el-collapse-item__header) {
    margin-bottom: 12px;
  }
  :deep(.el-collapse-item__wrap) {
    // position: absolute;
  }
}
.think-button {
  margin-bottom: 12px;
}
</style>
