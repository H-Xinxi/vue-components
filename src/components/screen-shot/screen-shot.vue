<script setup lang="ts">
import { domToCanvas } from "modern-screenshot";
import { computed, onMounted, onUnmounted, reactive, ref } from "vue";
// import {} from 
// LatLng
// import {BaseIconOptions} from 'leaflet'
// 
const emits = defineEmits<{
  (e: "screenShot", imageBlob: Blob): void;
}>();

const clipZone = reactive({
  show: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});

const style = computed(() => {
  const display = clipZone.show ? "block" : "none";
  let width = clipZone.width;
  let x = clipZone.x;
  if (width < 0) {
    width = -width;
    x = x - width;
  }
  let height = clipZone.height;
  let y = clipZone.y;
  if (height < 0) {
    height = -height;
    y = y - height;
  }
  return {
    display,
    left: x + "px",
    top: y + "px",
    width: width + "px",
    height: height + "px",
  };
});

const unMountedAbortController = new AbortController();
onUnmounted(() => {
  unMountedAbortController.abort();
});

const handleScreenShotEnd = () => {
  clipZone.show = false;
  domToCanvas(document.querySelector("#app")!, {
    // scale: 1,
    backgroundColor: 'white',
    features: {
      restoreScrollPosition: true,
    },
  }).then((canvas) => {
    const getPixelRatio = (context: CanvasRenderingContext2D) => {
      const backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        1;
      return (window.devicePixelRatio || 1) / backingStore;
    };
    // const ratio = getPixelRatio(canvas);
    const ctx = canvas.getContext("2d")!;
    // console.log("ratio", getPixelRatio(canvas), canvas);
    // canvas.style.width = `${canvas.width}px`;
    // canvas.style.height = `${canvas.height}px`;
    // canvas.width = canvas.width * ratio;
    // canvas.height = canvas.height * ratio;
    // ctx.scale(ratio, ratio);
    // console.log(canvas);
    const imageData = ctx.getImageData(
      clipZone.x,
      clipZone.y,
      clipZone.width,
      clipZone.height
    );
    if (!imageData) return;
    const clipedCanvas = document.createElement("canvas");
    clipedCanvas.width = Math.abs(clipZone.width);
    clipedCanvas.height = Math.abs(clipZone.height);
    clipedCanvas.getContext("2d")?.putImageData(imageData, 0, 0);

    clipedCanvas.toBlob((blob) => {
      if (!blob) return;
      emits("screenShot", blob);
    });
  });
};

defineExpose({
  screenShot() {
    Object.assign(clipZone, {
      show: true,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    });
    const pointerUpAbortController = new AbortController();
    const eventAbortSignal = AbortSignal.any([
      pointerUpAbortController.signal,
      unMountedAbortController.signal,
    ]);

    // 阻止拖动
    document.addEventListener(
      "dragstart",
      function (event) {
        event.preventDefault();
      },
      {
        signal: eventAbortSignal,
      }
    );
    // 阻止文本选择
    document.addEventListener(
      "selectstart",
      function (event) {
        event.preventDefault();
      },
      {
        signal: eventAbortSignal,
      }
    );
    document.addEventListener(
      "pointerdown",
      (e) => {
        const { clientX, clientY } = e;
        clipZone.x = clientX;
        clipZone.y = clientY;

        document.addEventListener(
          "pointerup",
          (e) => {
            pointerUpAbortController.abort();
            handleScreenShotEnd();
          },
          {
            once: true,
            signal: eventAbortSignal,
          }
        );

        document.addEventListener(
          "pointermove",
          (e) => {
            const { clientX, clientY } = e;
            const width = clientX - clipZone.x;
            const height = clientY - clipZone.y;
            clipZone.width = width;
            clipZone.height = height;
          },
          {
            signal: eventAbortSignal,
          }
        );
      },

      {
        once: true,
        signal: eventAbortSignal,
      }
    );
  },
});
</script>

<template>
  <!-- <div class="clip-container"> -->
  <div class="clip-zone" :style="style"></div>
  <!-- </div> -->
</template>

<style scoped lang="scss">
.clip-zone {
  position: fixed;
  z-index: 9999;
  box-shadow: 0 0 0 9999em rgba(100, 100, 100, 0.6);
  background-color: transparent;
}
</style>
