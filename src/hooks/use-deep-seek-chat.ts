import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { markRaw, reactive, ref, watchEffect, watchSyncEffect } from "vue";

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

export function useDeepSeekChat() {
  function query(messageList: ChatCompletionMessageParam[]) {
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

    const abortController = ref<AbortController | null>(null);
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
      state.value = "thinking";
      think.text = "";
      const thinkStartTime = Date.now();
      for await (let chunk of completion) {
        const chunk_content = chunk.choices[0].delta.content ?? "";
        const reasoning_content =
          chunk.choices[0].delta["reasoning_content" as "content"] ?? "";
        if (state.value === "thinking" && chunk_content.length > 0) {
          state.value = "answering";
          answer.text = "";
          const thinkEndTime = Date.now();
          think.duration = thinkEndTime - thinkStartTime;
        }
        if (state.value === "thinking") {
          think.text += reasoning_content;
        } else if (state.value === "answering") {
          answer.text += chunk_content;
        }
      }
    }
    state.value = "pending";
    queryDeepSeek(messageList)
      .then(() => {
        if (abortController.value?.signal.aborted) {
          state.value = "aborted";
        } else {
          state.value = "compeleted";
        }
      })
      .catch(() => {
        state.value = "aborted";

        console.log("aborded");
      });
    return {
      state,
      answer,
      think,
      abortController,
    };
  }
  return query;
}
