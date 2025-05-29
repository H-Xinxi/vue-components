<script setup lang="ts">
import { useHeightResize } from "@/hooks/use-height-resize";
import { scrollbarContextKey } from "element-plus";
import { inject, onMounted, onUnmounted, ref, watch } from "vue";

const elScrollbarContext = inject(scrollbarContextKey);
const atBottom = ref(true);
// console.log('elscroll',elScrollbarContext?.wrapElement)
const unmountedController = new AbortController();
onUnmounted(() => {
  unmountedController.abort();
});
onMounted(() => {
  const scrollElm = elScrollbarContext!.wrapElement;
  // console.log('mounted', elScrollbarContext?.wrapElement,elScrollbarContext?.scrollbarElement)
  scrollElm.addEventListener(
    "scroll",
    () => {
      if (
        Math.abs(
          scrollElm.scrollTop + scrollElm.clientHeight - scrollElm.scrollHeight
        ) <= 2
      ) {
        // 滚到底部
        atBottom.value = true;
      } else {
        atBottom.value = false;
      }
    },
    {
      signal: unmountedController.signal,
    }
  );
});
const [height, vHeightResize] = useHeightResize();
watch(height, () => {
  if (!elScrollbarContext) return;
  if(!atBottom.value) return
  const scrollElm = elScrollbarContext.wrapElement;
  scrollElm.scrollTop = scrollElm.scrollHeight;
});
</script>

<template>
  <div v-height-resize>
    <slot></slot>
  </div>
</template>

<style scoped></style>
