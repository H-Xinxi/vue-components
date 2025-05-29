import type { Directive } from "vue";

export const vFocus: Directive = {
  mounted(el: HTMLElement) {
    const inputEl = el.querySelector('input, textarea') as HTMLInputElement
    inputEl.focus();
  },
  
};

// export const vClickOutside:Directive = {

// }
