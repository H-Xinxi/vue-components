<script setup lang="ts">
import { ArrowDown, ArrowUp, User } from "@element-plus/icons-vue";
import {
  ElAvatar,
  ElButton,
  ElCollapse,
  ElCollapseItem,
  ElIcon,
} from "element-plus";
import { ref } from "vue";

interface Props {
  avatarUrl?: string;
  content: string;
}
const props = defineProps<Props>();
</script>
<template>
  <div class="w-full flex justify-end gap-4">
    <div class="p-[8px_20px] text-base text-[#262626] flex-1 flex flex-col max-w-fit rounded-xl bg-[#eff6ff]">
      <!-- answer -->
      <div  v-html="props.content"></div>
      <!-- action buttons -->
    </div>
    <ElAvatar :size="28" :icon="User" />
  </div>
</template>

<style scoped></style>
