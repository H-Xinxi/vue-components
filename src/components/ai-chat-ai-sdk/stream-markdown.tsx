import { unified } from "unified";
import { defineComponent, Fragment, onMounted, ref } from "vue";
import remarkParse from "remark-parse";
import rehypeReact from "rehype-react";
import remarkRehype from "remark-rehype";
import * as vueJsxRuntime from "vue/jsx-runtime";
export default defineComponent((props, ctx) => {
  const markdown = ref();
  onMounted(async () => {
    const m = await unified()
      .use(remarkParse, { fragment: true })
      .use(remarkRehype)
      .use(rehypeReact, vueJsxRuntime)
      .process("# hsdfsaf");

    markdown.value = m.result;
  });
  return () => markdown.value;
});
