<script setup lang="tsx">
import { unified } from "unified";
import {
  defineComponent,
  Fragment,
  h,
  onMounted,
  ref,
  shallowRef,
  watchEffect,
} from "vue";
import remarkParse from "remark-parse";
import rehypeReact from "rehype-react";
import remarkRehype from "remark-rehype";
import * as vueJsxRuntime from "vue/jsx-runtime";
import "katex/dist/katex.min.css";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import RehypeHighlight from "rehype-highlight";
// import { stream } from "unified-stream";
import { Readable } from "https://esm.sh/node/stream.mjs";
import { stream } from "https://esm.sh/unified-stream@3?bundle";
import CustomP from "./custom-p.vue";
const markdown = shallowRef();
const props = defineProps<{
  content: string;
}>();
watchEffect(async () => {
  const content = props.content;
  const m = await unified()
    .use(remarkParse)
    .use(RemarkMath)
    .use(RemarkGfm)
    .use(RemarkBreaks)
    .use(remarkRehype)
    .use(RehypeKatex)
    .use(RehypeHighlight)
    .use(rehypeReact, {
    
      components: {
        p: (props,{slots}) => <p >{slots.default()}</p>,
      },
      elementAttributeNameCase: "html",
      stylePropertyNameCase: "dom",
      ...vueJsxRuntime,
      // jsxs: vueJsxRuntime.jsx
      jsx: (type, props, key) => {
        // console.log('hhh',type,props,key)
        const children = props.children;
        delete props.children;
        props.key = key
        if (typeof type === "object" || typeof type === 'function') {
          // console.log(type)
          return h(type, props, () => children);
        } 
        return h(type,props, children);
      },
    })
    .process(content);

  markdown.value = m.result;
});
const markdownCom = () => {
  return markdown.value;
};
</script>
<template>
  <component :is="markdown"></component>
</template>

<style lang="scss" scoped></style>
