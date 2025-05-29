import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import {
  markRaw,
  reactive,
  ref,
  shallowRef,
  watch,
  watchEffect,
  watchSyncEffect,
} from "vue";

const openai = new OpenAI({
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",

  apiKey: "sk-653411b8109548618bfe591a57835303",
  dangerouslyAllowBrowser: true,
});
// const openai = new OpenAI({
//     baseURL: 'https://api.deepseek.com',
//     apiKey: 'sk-b783e453701f4cd5884c2aa84a2bbd31'
// });

type QueryDeepSeekState =
  | "idle"
  | "pending"
  | "thinking"
  | "answering"
  | "compeleted"
  | "aborted";

export function useDeepSeek() {
  const queryState = ref<QueryDeepSeekState>("idle");
  const state = ref<QueryDeepSeekState>("idle");
  const thinkFlag = {
    start: "<think>",
    end: "</think>",
  };

  const answer = reactive({
    text: null as string | null,
    html: null as string | null,
  });
  const think = reactive({
    text: null as string | null,
    html: null as string | null,
    duration: null as number | null,
  });

  watchEffect(() => {
    answer.html = answer.text;
  });
  watchEffect(() => {
    think.html = think.text;
  });
  const thinkChunks: string[] = [];
  const answerChunks: string[] = [];

  function smoothAddText(chunks: string[], callback: Function) {
    if (chunks.length === 0) return;
    const allString = chunks.join("");
    const endIndex = Math.max(Math.floor(allString.length / 60), 1);
    const pickedString = allString.slice(0, endIndex);
    const resString = allString.slice(endIndex);
    callback(pickedString, resString);
  }

  const thinkAnimated = ref(false);
  function animationThinkContent() {
    thinkAnimated.value = false;
    state.value = "thinking";

    smoothAddText(thinkChunks, (pickedString, resString) => {
      think.text += pickedString;
      // thinkChunks.splice(0, Infinity, resString ? resString : undefined);
      thinkChunks.length = 0;
      resString && thinkChunks.push(resString);
      // thinkChunks = resString ? [resString] : [];
    });
    if (
      (queryState.value === "answering" ||
        queryState.value === "compeleted" ||
        queryState.value === "aborted") &&
      thinkChunks.length === 0
    ) {
      thinkAnimated.value = true;
      if(queryState.value === 'aborted' && answerChunks.length === 0) {
        state.value = 'aborted'
      }
      // state.value = queryState.value;
      return;
    }
    requestAnimationFrame(animationThinkContent);
  }

  const contentAnimated = ref(false);
  function animationContent() {
    if (!thinkAnimated.value) return requestAnimationFrame(animationContent);

    contentAnimated.value = false;
    state.value = "answering";
    smoothAddText(answerChunks, (pickedString, resString) => {
      answer.text += pickedString;
      answerChunks.length = 0;
      resString && answerChunks.push(resString);
      // answerChunks.splice(0, Infinity, resString ? resString : undefined);
    });
    if (
      (queryState.value === "compeleted" || queryState.value === "aborted") &&
      answerChunks.length === 0
    ) {
      contentAnimated.value = true;
      state.value = queryState.value;
      return;
    }
    requestAnimationFrame(animationContent);
  }

  watch(queryState, () => {
    switch (queryState.value) {
      case "thinking": {
        animationThinkContent();
        break;
      }
      case "answering": {
        animationContent();
        break;
      }
      case "aborted": {
      }
      case "compeleted": {
      }
    }
  });

  // requestAnimationFrame(animationContent);

  const abortController = shallowRef<AbortController | null>(null);
  async function query(messageList: ChatCompletionMessageParam[]) {
    queryState.value = "pending";
    state.value = 'pending'
    await queryDeepSeek(messageList)
      .then(() => {
        if (abortController.value?.signal.aborted) {
          queryState.value = "aborted";
        } else {
          queryState.value = "compeleted";
        }
      })
      .catch(() => {
        queryState.value = "aborted";

        console.log("aborded");
      });
  }

  async function queryDeepSeek(messageList: ChatCompletionMessageParam[]) {
    abortController.value = new AbortController();
    think.duration = null;
    think.text = null;
    answer.text = null;
    const completion = await openai.chat.completions.create(
      {
        messages: messageList,
        model: "deepseek-r1-distill-qwen-1.5b",
        stream: true,
      },
      {
        signal: abortController.value.signal,
      }
    );
    queryState.value = "thinking";
    think.text = "";

    const thinkStartTime = Date.now();
    for await (let chunk of completion) {
      const chunk_content = chunk.choices[0].delta.content ?? "";
      const reasoning_content =
        chunk.choices[0].delta["reasoning_content" as "content"] ?? "";
      if (queryState.value === "thinking" && chunk_content.length > 0) {
        queryState.value = "answering";
        answer.text = "";
        const thinkEndTime = Date.now();
        think.duration = thinkEndTime - thinkStartTime;
      }
      if (queryState.value === "thinking") {
        thinkChunks.push(reasoning_content);
      } else if (queryState.value === "answering") {
        answerChunks.push(chunk_content);
        // answer.text += chunk_content;
      }
    }
    // console.log(completion.choices[0].message.content);
  }

  return {
    state,
    answer,
    think,
    abortController,
    query: markRaw(query),
  };
}
