<script setup lang="ts">
import { ElButton } from "element-plus";
import { ref, Transition } from "vue";
const drawerVisible = ref(false);
</script>

<template>
  <div class="flex absolute top-0 left-0 bottom-0 drawer-container">
    <div class="w-[400px]">
      <Transition name="drawer" appear>
        <div v-show="drawerVisible" class="h-full flex flex-col bg-amber-600">
          <div class="h-[40px]"></div>
          <div class="flex-1"></div>
        </div>
      </Transition>
    </div>
    <div class="grid place-items-center h-full">
      <ElButton @click="drawerVisible = !drawerVisible">
        {{ drawerVisible ? "收起" : "展开" }}
      </ElButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.drawer-container {
  // transition: all 10s ease;
  &:has(.drawer-enter-from, .drawer-leave-to) {
    transform: translate(-350000px, 0);
  }
  &:has(.drawer-enter-to, .drawer-leave-from) {
    transform: translate(0px, 0px);
  }
  &:has(.drawer-enter-active, .drawer-leave-active) {
    transition: transform 1s ease;
  }
}
.drawer-enter-form,  .drawer-leave-to{
//   transform: translateX(-100%);
}
.drawer-enter-to, .drawer-leave-form {
  // transform: translateX(0);
}
.drawer-enter-active,.drawer-leave-active {
  transition: transform 1s ease;
}
</style>
