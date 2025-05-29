<script setup lang="ts">
import { dialogInjectionKey, type DialogContext } from "element-plus";
import {
  inject,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
  watchEffect,
  type Ref,
} from "vue";

enum ResizeHandler {
  Top = "Top",
  Bottom = "Bottom",
  Left = "Left",
  Right = "Right",
  TopLeft = "TopLeft",
  TopRight = "TopRight",
  BottomLeft = "BottomLeft",
  BottomRight = "BottomRight",
  DragHandler = "DragHandler",
}
function stringToResizeHandler(key?: string): ResizeHandler | undefined {
  return ResizeHandler[key as keyof typeof ResizeHandler];
}

const props = withDefaults(
  defineProps<{
    boundingElement?: HTMLElement;
    resizeHandlerSize?: number;
  }>(),
  {
    resizeHandlerSize: 4,
  }
);
const boundingElement = ref<HTMLElement | undefined | null>(
  props.boundingElement
);
const elDialogContext = inject(dialogInjectionKey);
function assertElDialog(
  elDialogContext: DialogContext | undefined
): asserts elDialogContext is DialogContext & {
  dialogRef: Ref<HTMLDivElement>;
  headerRef: Ref<HTMLDivElement>;
} {
  if (!elDialogContext?.dialogRef.value)
    throw new Error("el-dialog-resize-handlers 必须用在 el-dialog 中");
  //   return true;
}

const dialogTransfrom = reactive({
  x: 0,
  y: 0,
  width: 0,
  height: 0,
});
// 将 dialogTransfrom 同步到 ElDialog 样式
watch(dialogTransfrom, () => {
  assertElDialog(elDialogContext);
  const elDialogElm = elDialogContext.dialogRef.value;
  Object.assign(elDialogElm.style, {
    transform: `translate(${dialogTransfrom.x}px, ${dialogTransfrom.y}px)`,
    width: dialogTransfrom.width + "px",
    height: dialogTransfrom.height + "px",
  });
});

// draghandler 事件绑定
function useDragHandlerBinding() {
  onMounted(() => {
    assertElDialog(elDialogContext);
    const elHeader = elDialogContext.headerRef.value;
    elHeader.dataset.resizeHandler = ResizeHandler.DragHandler;
    elHeader.addEventListener("pointerdown", handlePointerDown);
  });
  onBeforeUnmount(() => {
    // assertElDialog(elDialogContext);
    const elHeader = elDialogContext?.headerRef.value;
    elHeader?.removeEventListener("pointerdown", handlePointerDown);
  });
}
useDragHandlerBinding();

// 若没有 props.boundingElement,boundingElement 默认为 offsetParent，最近的有 定位 的祖先
onMounted(async () => {
  assertElDialog(elDialogContext);

  if (!props.boundingElement) {
    await nextTick();
    boundingElement.value = (elDialogContext.dialogRef.value.offsetParent ??
      document.body) as HTMLElement;
  }
});

let _minHeight: string = "0px";
let _minWidth: string = "0px";
const minSize = {
  get minWidth() {
    assertElDialog(elDialogContext);
    const elDialogElm = elDialogContext.dialogRef.value;
    if (_minWidth.endsWith("%")) {
      return (
        (elDialogElm.parentElement!.clientWidth * parseFloat(_minWidth)) / 100
      );
    } else if (_minWidth.endsWith("px")) {
      return parseFloat(_minWidth);
    }
    return 0;
  },
  get minHeight() {
    assertElDialog(elDialogContext);
    const elDialogElm = elDialogContext.dialogRef.value;
    if (_minHeight.endsWith("%")) {
      return (
        (elDialogElm.parentElement!.clientHeight * parseFloat(_minHeight)) / 100
      );
    } else if (_minHeight.endsWith("px")) {
      return parseFloat(_minHeight);
    }
    return 0;
  },
};
onMounted(async () => {
  assertElDialog(elDialogContext);
  const elDialogElm = elDialogContext.dialogRef.value;
  const computedStyle = window.getComputedStyle(elDialogElm);
  _minWidth = computedStyle.getPropertyValue("min-width");
  _minHeight = computedStyle.getPropertyValue("min-Height");
});

// 同步 props.minHeight props.minWidth 到 elDialog 样式上
// watchEffect(() => {
//   const elDialogElm = elDialogContext?.dialogRef.value;
//   if (!elDialogElm) return;
//   const minWidth = props.minWidth;
//   const minHeigh = props.minHeigh;
//   elDialogElm.style.minHeight = minHeigh + "px";
//   elDialogElm.style.minWidth = minWidth + "px";
// });

// 第一次出发 pointer down 事件时，会将元素（ELDialog） 设置为绝对定位，并设置相应样式。
// 也就是说，在此之前的样式是有css控制的，第一次出发 pointer down 事件之后，样式就变为决定定位，并 dialogTransfrom 状态会同步到 style 样式中
const isFirstMouseDown = ref(false);
function firstMouseDownInit() {
  if (isFirstMouseDown.value) return;
  assertElDialog(elDialogContext);
  isFirstMouseDown.value = true;
  const elDialogElm = elDialogContext.dialogRef.value;
  const { left, top, width, height } = elDialogElm.getBoundingClientRect();
  const boundingElmRect = boundingElement.value?.getBoundingClientRect();
  if (!boundingElmRect) throw new Error("没有 boundingElmRect");

  Object.assign(elDialogElm.style, {
    position: "absolute",
    margin: "0",
    left: left - boundingElmRect.left + "px",
    top: top - boundingElmRect.top + "px",
  });
  Object.assign(dialogTransfrom, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });
}

// pointerDown 事件
const handlePointerDown = (e: PointerEvent) => {
  firstMouseDownInit();

  // 闭包保存 pointer down 状态

  const pointerDownTargetElm = e.target as HTMLElement;
  const pointerDownCurrentTargetElm = e.currentTarget as HTMLElement;
  // 捕获指针事件
  pointerDownTargetElm.setPointerCapture(e.pointerId);

  const mouseDownDialogTransform = { ...dialogTransfrom };
  const mouseDownPointerPosition = {
    x: e.clientX,
    y: e.clientY,
  };
  assertElDialog(elDialogContext);

  const mouseDownDialogRect =
    elDialogContext.dialogRef.value.getBoundingClientRect();

  // 取得元素上的 data-resize-handler 属性并转换为 ResizeHandler 类型
  const getResizeHandlerByEvent = (e: PointerEvent) => {
    let dataResizeHandler = pointerDownTargetElm.dataset.resizeHandler;
    if (!dataResizeHandler) {
      dataResizeHandler = pointerDownCurrentTargetElm.dataset.resizeHandler;
    }
    const resizeHandler = stringToResizeHandler(dataResizeHandler);
    if (!resizeHandler) return;
    return resizeHandler;
  };

  const resizeHandler = getResizeHandlerByEvent(e);
  if (!resizeHandler) return;

  // 边界框
  const boundingRect = boundingElement.value?.getBoundingClientRect();
  if (!boundingRect) throw new Error("boundingRect is undefined");

  const handlePointerMove = (e: PointerEvent) => {
    const { clientX: mouseMoveX, clientY: mouseMoveY } = e;
    function clampNumber(value: number, min: number, max: number) {
      return Math.min(Math.max(value, min), max);
    }
    const offset = {
      x: mouseMoveX - mouseDownPointerPosition.x,
      y: mouseMoveY - mouseDownPointerPosition.y,
    };

    // 处理 y 方向
    switch (resizeHandler) {
      case ResizeHandler.Left:
      case ResizeHandler.Right:
        break;
      case ResizeHandler.Bottom:
      case ResizeHandler.BottomLeft:
      case ResizeHandler.BottomRight:
        // dialogRect.height = mouseDownDialogRect.height + offset.y;
        dialogTransfrom.height = clampNumber(
          mouseDownDialogRect.height + offset.y,
          minSize.minHeight,
          boundingRect.bottom - mouseDownDialogRect.y
        );
        break;

      case ResizeHandler.Top:
      case ResizeHandler.TopLeft:
      case ResizeHandler.TopRight:
        dialogTransfrom.height = clampNumber(
          mouseDownDialogRect.height - offset.y,
          minSize.minHeight,
          mouseDownDialogRect.height + mouseDownDialogRect.y - boundingRect.top
        );

        dialogTransfrom.y =
          mouseDownDialogRect.height -
          dialogTransfrom.height +
          mouseDownDialogTransform.y;
        break;
      case ResizeHandler.DragHandler:
        // 拖动 el-dialog-header

        dialogTransfrom.y =
          mouseDownDialogTransform.y +
          clampNumber(
            offset.y,
            boundingRect.top - mouseDownDialogRect.top,
            boundingRect.bottom -
              dialogTransfrom.height -
              mouseDownDialogRect.top
          );
        break;
      default:
        const _exhaustiveCheck: never = resizeHandler;
        throw new Error(_exhaustiveCheck);
      // dialogTransfrom.y = mouseDownDialogTransform.y + clampNumber(offset.y, -(mouseDownDalogRect.top-boundingRect.top), boundingRect.bottom);
    }
    // 处理 x 方向
    switch (resizeHandler) {
      case ResizeHandler.Top:
      case ResizeHandler.Bottom:
        break;
      case ResizeHandler.Right:
      case ResizeHandler.TopRight:
      case ResizeHandler.BottomRight:
        // dialogTransfrom.width = mouseDownDialogTransform.width + offset.x;

        dialogTransfrom.width = clampNumber(
          mouseDownDialogRect.width + offset.x,
          minSize.minWidth,
          boundingRect.right - mouseDownDialogRect.x
        );
        break;
      case ResizeHandler.Left:
      case ResizeHandler.TopLeft:
      case ResizeHandler.BottomLeft:
        dialogTransfrom.width = clampNumber(
          mouseDownDialogRect.width - offset.x,
          minSize.minWidth,
          mouseDownDialogRect.width + mouseDownDialogRect.x - boundingRect.left
        );
        dialogTransfrom.x =
          mouseDownDialogRect.width -
          dialogTransfrom.width +
          mouseDownDialogTransform.x;
        break;
      case ResizeHandler.DragHandler:
        // 拖动 el-dialog-header
        dialogTransfrom.x =
          mouseDownDialogTransform.x +
          clampNumber(
            offset.x,
            boundingRect.left - mouseDownDialogRect.left,
            boundingRect.right -
              dialogTransfrom.width -
              mouseDownDialogRect.left
          );
        break;
      default:
        const _exhaustiveCheck: never = resizeHandler;
        throw new Error(_exhaustiveCheck);
      // return _exhaustiveCheck;
    }
  };
  const handlePointerUp = () => {
    pointerDownTargetElm.removeEventListener("pointermove", handlePointerMove);
  };
  pointerDownTargetElm.addEventListener("pointermove", handlePointerMove);
  pointerDownTargetElm.addEventListener("pointerup", handlePointerUp, {
    once: true,
  });
};
</script>
<template>
  <div class="resize-handlers-container" @pointerdown="handlePointerDown">
    <div
      class="resize-handler height top"
      :data-resize-handler="ResizeHandler.Top"
    ></div>
    <div
      class="resize-handler height bottom"
      :data-resize-handler="ResizeHandler.Bottom"
    ></div>
    <div
      class="resize-handler width left"
      :data-resize-handler="ResizeHandler.Left"
    ></div>
    <div
      class="resize-handler width right"
      :data-resize-handler="ResizeHandler.Right"
    ></div>
    <div
      class="resize-handler corner top left"
      :data-resize-handler="ResizeHandler.TopLeft"
    ></div>
    <div
      class="resize-handler corner top right"
      :data-resize-handler="ResizeHandler.TopRight"
    ></div>
    <div
      class="resize-handler corner bottom left"
      :data-resize-handler="ResizeHandler.BottomLeft"
    ></div>
    <div
      class="resize-handler corner bottom right"
      :data-resize-handler="ResizeHandler.BottomRight"
    ></div>
  </div>
</template>

<style scoped lang="scss">
.resize-handlers-container {
  --resize-handler-size: v-bind("`${props.resizeHandlerSize}px`");
  position: absolute;
  inset: 0;
  pointer-events: none;
  .resize-handler {
    position: absolute;
    pointer-events: all;
    &.width {
      width: var(--resize-handler-size);
      height: 100%;
      cursor: ew-resize;
    }
    &.height {
      width: 100%;
      height: var(--resize-handler-size);
      cursor: ns-resize;
    }
    &.corner {
      width: var(--resize-handler-size);
      height: var(--resize-handler-size);
      &.top.left,
      &.bottom.right {
        cursor: nwse-resize;
      }
      &.top.right,
      &.bottom.left {
        cursor: nesw-resize;
      }
    }
    &.top {
      // top: calc(-1 * var(--resize-handler-size) / 2);
      top: 0;
      // left: 0;
    }
    &.bottom {
      // bottom: calc(-1 * var(--resize-handler-size) / 2);
      bottom: 0;
      // left: 0
    }
    &.left {
      // top: 0;
      // left: calc(-1 * var(--resize-handler-size) / 2);
      left: 0;
    }
    &.right {
      // top: 0;
      right: 0;
      // right: calc(-1 * var(--resize-handler-size) / 2);
    }
  }
}
</style>
