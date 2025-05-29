import { Hono } from "hono";
import {
  appendResponseMessages,
  defaultSettingsMiddleware,
  extractReasoningMiddleware,
  Message,
  streamText,
  UIMessage,
  wrapLanguageModel,
} from "ai";
import { zValidator } from "@hono/zod-validator";
import { createOllama } from "ollama-ai-provider";
import { z } from "zod";
import * as path from "path";
import { writeFile } from "fs/promises";
import { existsSync, mkdirSync } from "fs";

const app = new Hono();
const model = wrapLanguageModel({
  model: createOllama({
    // optional settings, e.g.

    baseURL: "http://127.0.0.1:11434/api",
  })("deepseek-r1:8b"),
  middleware: [
    defaultSettingsMiddleware({
      // tagName: "think",
      settings: {},
      // separator: "\n",
    }),
    extractReasoningMiddleware({
      tagName: "think",
      // separator: "\n",
    }),
  ],
  // middleware: extractReasoningMiddleware({
  //   tagName: "think",
  //   // separator: "\n",
  // }),
});

app.post("/api", async (c) => {
  debugger
  const { messages: _messages, id } = (await c.req!.json()!) as {
    id: string;
    messages: UIMessage[];
  };

  const chatDir = path.join(process.cwd(), ".chats");
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  const chatFilePath = path.join(chatDir, `${id}.json`);
  if (!existsSync(chatFilePath)) await writeFile(chatFilePath, "[]");

  const messages = _messages.map((item) =>
    item.role !== "assistant"
      ? item
      : {
          ...item,
          parts: item.parts.reduce((res, it) => {
            switch (it.type) {
              case "reasoning": {
                // return;
                // (it as ReasoningUIPart)
                it;
                break;
              }
              case "text": {
                const reasoningPart = item.parts.find(
                  (item) => item.type === "reasoning"
                );
                let text = it.text;
                if (reasoningPart) {
                  // reasoningPart.
                  text = `<think>${reasoningPart.reasoning}</think>${text}`;
                }
                it = { ...it, text };
              }
              default:
                res.push(it);
            }
            return res;
          }, [] as typeof item.parts),
        }
  );
  const result = streamText({
    model,

    messages,
    async onFinish({ response }) {
      await saveChat({
        id,
        messages: appendResponseMessages({
          messages,
          responseMessages: response.messages,
        }),
      });
    },
  });

  const response = result.toDataStreamResponse({
    sendReasoning: true,
  });
  return response;
});

async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: Message[];
}): Promise<void> {
  const content = JSON.stringify(messages, null, 2);
  await writeFile(getChatFile(id), content);
}
function getChatFile(id: string): string {
  const chatDir = path.join(process.cwd(), ".chats");
  if (!existsSync(chatDir)) mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${id}.json`);
}
// const route = app.post(
//   "/posts",
//   zValidator(
//     "form",
//     z.object({
//       body: z.string(),
//     })
//   ),
//   (c) => {
//     const validated = c.req.valid("form");
//     // ... use your validated data
//   }
// );
export default app;
