<script setup lang="ts">
import AiChat from '@/components/ai-chat/ai-chat.vue';
import { useDeepSeek } from '@/hooks/use-deep-seek';

const deepSeekServices = useDeepSeek()


function conversation() {
    deepSeekServices.query([{role: 'user', content: '1+1'}])
}
// import OpenAI from "openai";

// const openai = new OpenAI({
//   baseURL:
//     window.location.origin + "/ai-chat-api/v1",
//   apiKey: "ZmU3OGRmZGFhOTBjNTlhNTc1NTdhZjJmNjgyNjg2ZDMwNDY3OWNjZg==",
//   dangerouslyAllowBrowser: true
// });
// // const openai = new OpenAI({
// //     baseURL: 'https://api.deepseek.com',
// //     apiKey: 'sk-b783e453701f4cd5884c2aa84a2bbd31'
// // });

// async function conversation() {
//   const completion = await openai.chat.completions.create({
//     messages: [
//       { role: "system", content: "You are a helpful assistant." },
//       { role: "user", content: "hello" },
//     ],
//     model: "DeepSeek-R1-Distill-Qwen-7B",
//     stream: true,
//   });
//   for await (let chunk of completion) {
//     console.log("chunk", chunk);
//   }
//   // console.log(completion.choices[0].message.content);
// }


</script>

<template>
  <AiChat class="w-screen h-screen"></AiChat>
</template>

<style scoped></style>
