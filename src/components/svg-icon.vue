<template>
  <svg
    :style="{
      width: width,
      height: height,
    }"
    class="outline-none"
  >
    <!-- xlink:href 是使用哪个svg的图标 fill是更改图标的颜色 -->

    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>
<script setup lang="ts">
import { computed, defineProps } from "vue";

const props = withDefaults(
  defineProps<{
    prefix?: string;
    name: string;
    color?: string;
    size?: number;
    width?: number;
    height?: number;
  }>(),
  {
    prefix: "#icon-",
  }
);
const width = computed(() => {
  if (props.width != null) return props.width + "px";
  if (props.size != null) return props.size + "px";
  return undefined;
});
const height = computed(() => {
  if (props.height != null) return props.height + "px";
  if (props.size != null) return props.size + "px";
  return undefined;
});
</script>
<style scoped></style>
