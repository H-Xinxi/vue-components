<script setup lang="tsx">
import { unified } from "unified";
import {
  defineComponent,
  Fragment,
  h,
  onMounted,
  ref,
  shallowRef,
  watch,
  watchEffect,
  type Plugin,
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
import "highlight.js/styles/monokai.min.css";
// Using ES6 import syntax
// Using ES6 import syntax

// Then register the languages you need
const markdown = shallowRef();
const props = defineProps<{
  content: string;
  isStreaming?: boolean;
}>();

const oldContent = ref(props.content);

const isAnimating = ref(false);
const animate = () => {
  const index = Math.max(
    Math.floor((props.content.length - oldContent.value.length) / 60),
    1
  );
  if (!props.isStreaming) {
    oldContent.value = props.content;
    isAnimating.value = false;
    return;
  }
  oldContent.value = props.content.slice(0, oldContent.value.length + index);

  if (oldContent.value.length !== props.content.length) {
    requestAnimationFrame(animate);
    // isAnimating.value = true;
  } else {
    isAnimating.value = false;
  }
};
watch(
  [() => props.content, () => props.isStreaming],
  () => {
    if (isAnimating.value) return;
    if (!props.isStreaming) {
      oldContent.value = props.content;
      return;
    }
    requestAnimationFrame(animate);
    isAnimating.value = true;
  },
  {
    immediate: true,
  }
);
watchEffect(async () => {
  const content = oldContent.value;
  // console.log(fromMarkdown(content));

  const m = await unified()
    .use(remarkParse)
    .use(RemarkMath)
    .use(RemarkGfm)
    .use(RemarkBreaks)
    .use(remarkRehype)
    .use(RehypeKatex)
    .use(RehypeHighlight, {
      // detect: false,

      ignoreMissing: true,
    })
    .use(rehypeReact, {
      // components: {
      //   p: (props, { slots }) => <p>{slots.default()}</p>,
      // },
      elementAttributeNameCase: "html",
      stylePropertyNameCase: "dom",
      ...vueJsxRuntime,
      // jsxs: vueJsxRuntime.jsx
      jsx: (type, props, key) => {
        // console.log('hhh',type,props,key)
        const children = props.children;
        delete props.children;
        props.key = key;
        if (typeof type === "object" || typeof type === "function") {
          // console.log(type)
          return h(type, props, () => children);
        }
        return h(type, props, children);
      },
    })
    .process(content);

  markdown.value = m.result;
});
</script>
<template>
  <div class="stream-markdown-container">
    <component :is="markdown"></component>
  </div>
</template>

<style lang="scss" scoped>
.stream-markdown-container :deep {
  p {
    font-size: 16px;
    margin: 14px 0;
  }
  h3 {
    font-size: 18px;
    line-height: 1.5;
    margin: 18px 0 14px;
  }

  :is(dir, menu, ol, ul) ul {
    list-style-type: circle;
  }

  ul {
    list-style-type: disc;
  }

  ul,
  ol {
    padding-left: 24px;
  }

  :not(pre)>code {
    font-size: 0.875em;
    font-weight: 600;
    font-family: Menlo,"Roboto Mono","Courier New",Courier,monospace,"Inter",sans-serif;
    background-color:  #ececec;
    border-radius: 4px;
    padding: 0.15rem 0.3rem;
  }
}
</style>
