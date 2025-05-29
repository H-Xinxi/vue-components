import {
  type MaybeRefOrGetter,
  watchEffect,
  toValue,
  type Ref,
  watch,
} from "vue";
import { type UIMessage } from "@ai-sdk/vue";

export class Message {
  constructor(message: UIMessage) {
    Object.assign(this, message);
  }
  update(message: UIMessage) {
    Object.assign(this, message);
  }
}
export interface Message extends UIMessage {}

type SessionStatus = "submitted" | "streaming" | "ready" | "error";

export class Session {
  messages: Message[];
  input: string;
  status: SessionStatus;
  answerStatus: "started" | "thinking" | "answering" | "idle";

  constructor(params: {
    messages: Ref<Message[]>;
    input: Ref<string>;
    status: MaybeRefOrGetter<SessionStatus>;
  }) {
    // this.input = toValueparams.input
    this.answerStatus = "idle";
    this.input = params.input as unknown as string;
    this.status = params.status as unknown as SessionStatus;

    watch(this.status as any, () => {
      const lastOriginMessage = toValue(params.messages).at(-1);
      if (!lastOriginMessage) return;
      if (this.status !== "streaming") {
        this.answerStatus = "idle";
      }
      switch (this.status) {
        case "submitted": {
          this.messages.push(new Message(lastOriginMessage));
          break;
        }

        case "streaming": {
          this.messages.push(new Message(lastOriginMessage));
          this.answerStatus = "started";
          break;
        }
      }
    });

    watch(
      () => toValue(params.messages).at(-1),
      (lastOriginMessage) => {
        if (!lastOriginMessage || lastOriginMessage.role !== "assistant")
          return;
        if (this.status !== "streaming") return;

        const lastMessage = this.messages.at(-1);
        if (lastMessage) {
          lastMessage.update(lastOriginMessage);
        }

        if (this.answerStatus === "started") {
          const reasoningPart = lastOriginMessage.parts.find(
            (item) => item.type === "reasoning"
          );
          if (reasoningPart) {
            this.answerStatus = "thinking";
          }
        }
        if (
          this.answerStatus === "started" ||
          this.answerStatus === "thinking"
        ) {
          const textPart = lastOriginMessage.parts.find(
            (item) => item.type === "text"
          );
          if (textPart) {
            this.answerStatus = "answering";
          }
        }
      }
    );
  }
}
