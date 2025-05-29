<script setup lang="ts">
import { ElAvatar } from "element-plus";
import avatarUrl from "@/assets/vue.svg";
const props = defineProps<{
  data: string;
}>();
</script>

<template>
  <div class="flex gap-4">
    <ElAvatar :size="50" :src="avatarUrl" />
    <div >
      {{ props.data }}
    </div>
  </div>
</template>

<style scoped></style>
