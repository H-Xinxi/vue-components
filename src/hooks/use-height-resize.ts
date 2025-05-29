import { ref, type Directive } from "vue";

export const useHeightResize = () => {
  const height = ref(0);

  let resizeObserver: ResizeObserver | null = null;

  const vResize: Directive = {
    mounted(el: HTMLElement) {
      height.value = el.offsetHeight;
      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];

        height.value = entry.borderBoxSize[0].blockSize;
      });
      resizeObserver.observe(el);
    },
    unmounted() {
      resizeObserver?.disconnect();
    },
  };

  return [height, vResize] as const;
};
