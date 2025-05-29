<script setup lang="ts">
import { ElAvatar } from 'element-plus';
import avatarUrl from '@/assets/vue.svg'
const props = defineProps<
  | {
      type: "text";
      data: string;
    }
  | {
      type: "img";
      data: Blob;
    }
  | {
      type: "file";
      data: Blob;
    }
>();
</script>

<template>
  <div class="flex gap-4">
    <div class="flex-1 min-w-1/12"></div>
    <div v-if="props.type==='text'" class="border-2 p-4 min-w-30">
        {{ props.data }}
    </div>
    <ElAvatar class="shrink-0" :size="50" :src="avatarUrl" />
  </div>
</template>

<style scoped></style>
