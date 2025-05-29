<script setup lang="ts">
import { ElButton, ElDialog, useDraggable } from "element-plus";
import { ref, useId, useTemplateRef } from "vue";
import ElDialogResizeHandlers from "./el-dialog-resize-handlers.vue";
const showDialog = ref(false);
const dialogRef = useTemplateRef("dialog");
const handleClick = () => {
  showDialog.value = true;
  console.log(dialogRef);
};
// 在模板中启用 v-highlight
const vHighlight = {
  mounted: (el: HTMLElement) => {
    // el.classList.add('is-highlight')
    const dialogElm: HTMLDivElement = el.closest(".el-dialog")!;
    const topResizeHandler = document.createElement("div");

    dialogElm.style.position = "relative";
    topResizeHandler.style.position = "absolute";
    topResizeHandler.style.top = "-1px";
    topResizeHandler.style.left = "0";
    topResizeHandler.style.width = "100%";
    topResizeHandler.style.height = "2px";
    topResizeHandler.style.backgroundColor = "red";
    topResizeHandler.style.cursor = "n-resize";
    topResizeHandler.addEventListener("mousedown", (e) => {
      const x = +(dialogElm.dataset.transformX ?? 0);
      const y = +(dialogElm.dataset.transformY ?? 0);
      const { width, height } = dialogElm.getBoundingClientRect();
      const startDialog = {
        x,
        y,
        width,
        height,
      };
      const { clientX, clientY } = e;
      const startMousePosition = { x: clientX, y: clientY };
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const offsetX = 0;
        const offsetY = clientY - startMousePosition.y;
        const transformX = startDialog.x + offsetX;
        const transformY = startDialog.y + offsetY;
        dialogElm.style.transform = `translate(${transformX}px, ${transformY}px)`;
        dialogElm.style.height = startDialog.height - offsetY + "px";
        // topResizeHandler.dataset.transformY = transformY.toString()
      };
      const handleMouseUp = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const offsetX = 0;
        const offsetY = clientY - startMousePosition.y;
        const transformX = startDialog.x + offsetX;
        const transformY = startDialog.y + offsetY;
        dialogElm.style.transform = `translate(${transformX}px, ${transformY}px)`;
        dialogElm.style.height = startDialog.height - offsetY + "px";

        dialogElm.dataset.transformX = transformX.toString();
        dialogElm.dataset.transformY = transformY.toString();

        document.removeEventListener("mousemove", handleMouseMove);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp, {
        once: true,
      });
    });
    dialogElm.append(topResizeHandler);

    const leftResizeHandler = document.createElement("div");

    dialogElm.style.position = "relative";
    leftResizeHandler.style.position = "absolute";
    leftResizeHandler.style.top = "0";
    leftResizeHandler.style.left = "-1px";
    leftResizeHandler.style.height = "100%";
    leftResizeHandler.style.width = "2px";
    leftResizeHandler.style.backgroundColor = "red";
    leftResizeHandler.style.cursor = "e-resize";
    leftResizeHandler.addEventListener("mousedown", (e) => {
        
      const x = +(dialogElm.dataset.transformX ?? 0);
      const y = +(dialogElm.dataset.transformY ?? 0);
      const {top,left, width, height } = dialogElm.getBoundingClientRect();
      const startDialog = {
        x,
        y,
        width,
        height,
      };

      const { clientX, clientY } = e;
      if(!dialogElm.dataset.handled) {

          dialogElm.style.top = top + 'px'
          dialogElm.style.left = left + 'px'
          dialogElm.style.position = 'absolute'
          dialogElm.style.margin = '0'
          dialogElm.dataset.handled = 'true'
        }
      const startMousePosition = { x: clientX, y: clientY };
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const offsetX = clientX - startMousePosition.x;
        const offsetY = 0;
        const transformX = startDialog.x + offsetX;
        const transformY = startDialog.y + offsetY;
        dialogElm.style.transform = `translate(${transformX}px, ${transformY}px)`;
        dialogElm.style.width = startDialog.width - offsetX + "px";
        // dialogElm.style.height = startDialog.height - offsetY + "px";
        // topResizeHandler.dataset.transformY = transformY.toString()
      };
      const handleMouseUp = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const offsetX = clientX - startMousePosition.x;
        const offsetY = 0;
        const transformX = startDialog.x + offsetX;
        const transformY = startDialog.y + offsetY;
        dialogElm.style.transform = `translate(${transformX}px, ${transformY}px)`;
        dialogElm.style.width = startDialog.width - offsetX + "px";

        dialogElm.dataset.transformX = transformX.toString();
        dialogElm.dataset.transformY = transformY.toString();

        document.removeEventListener("mousemove", handleMouseMove);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp, {
        once: true,
      });
    });
    dialogElm.append(leftResizeHandler);

    const buttonResizeHandler = document.createElement("div");

    dialogElm.style.position = "relative";
    buttonResizeHandler.style.position = "absolute";
    buttonResizeHandler.style.bottom = "-1px";
    buttonResizeHandler.style.left = "0";
    buttonResizeHandler.style.width = "100%";
    buttonResizeHandler.style.height = "2px";
    buttonResizeHandler.style.backgroundColor = "red";
    buttonResizeHandler.style.cursor = "n-resize";
    buttonResizeHandler.addEventListener("mousedown", (e) => {
      const x = +(dialogElm.dataset.transformX ?? 0);
      const y = +(dialogElm.dataset.transformY ?? 0);
      const { width, height } = dialogElm.getBoundingClientRect();
      const startDialog = {
        x,
        y,
        width,
        height,
      };
      const { clientX, clientY } = e;
      const startMousePosition = { x: clientX, y: clientY };
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const offsetX = 0;
        const offsetY = clientY - startMousePosition.y;
        // const transformX = startDialog.x + offsetX;
        // const transformY = startDialog.y + offsetY;
        // dialogElm.style.transform = `translate(${transformX}px, ${transformY}px)`;
        dialogElm.style.height = startDialog.height + offsetY + "px";
        // topResizeHandler.dataset.transformY = transformY.toString()
      };
      const handleMouseUp = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const offsetX = 0;
        const offsetY = clientY - startMousePosition.y;
        const transformX = startDialog.x + offsetX;
        const transformY = startDialog.y + offsetY;
        // dialogElm.style.transform = `translate(${transformX}px, ${transformY}px)`;
        dialogElm.style.height = startDialog.height + offsetY + "px";

        // dialogElm.dataset.transformX = transformX.toString();
        // dialogElm.dataset.transformY = transformY.toString();

        document.removeEventListener("mousemove", handleMouseMove);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp, {
        once: true,
      });
    });
    dialogElm.append(buttonResizeHandler);

    const dialogHeader: HTMLDivElement =
      dialogElm.querySelector(".el-dialog__header")!;
    dialogHeader.addEventListener("mousedown", (e) => {
      const x = +(dialogElm.dataset.transformX ?? 0);
      const y = +(dialogElm.dataset.transformY ?? 0);
      const { width, height } = dialogElm.getBoundingClientRect();
      const startDialog = {
        x,
        y,
        width,
        height,
      };
      const { clientX, clientY } = e;
      const startMousePosition = { x: clientX, y: clientY };
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const offsetX = clientX - startMousePosition.x;
        const offsetY = clientY - startMousePosition.y;
        const transformX = startDialog.x + offsetX;
        const transformY = startDialog.y + offsetY;
        dialogElm.style.transform = `translate(${transformX}px, ${transformY}px)`;
        // dialogElm.style.height = startDialog.height - offsetY + 'px'
        // topResizeHandler.dataset.transformY = transformY.toString()
      };
      const handleMouseUp = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const offsetX = clientX - startMousePosition.x;
        const offsetY = clientY - startMousePosition.y;
        const transformX = startDialog.x + offsetX;
        const transformY = startDialog.y + offsetY;
        dialogElm.style.transform = `translate(${transformX}px, ${transformY}px)`;
        // dialogElm.style.height = startDialog.height - offsetY + 'px'

        dialogElm.dataset.transformX = transformX.toString();
        dialogElm.dataset.transformY = transformY.toString();

        document.removeEventListener("mousemove", handleMouseMove);
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp, {
        once: true,
      });
    });
    // dialogElm.addEventListener()
    // console.dir(el.closest('.el-dialog'))
  },
};
const id = useId();
console.log("id", id);
</script>

<template>
  <ElButton @click="handleClick"> 123 </ElButton>
  <ElDialog
    ref="dialog"
    class="aaa"
    v-model="showDialog"
    width="500"
    title="123"

  >
  <ElDialogResizeHandlers></ElDialogResizeHandlers>
  123
    <!-- <div v-highlight>123</div> -->
  </ElDialog>
</template>

<style scoped>
body {
}
</style>
