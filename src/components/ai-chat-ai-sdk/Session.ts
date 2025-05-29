import type {
  TextUIPart,
  ToolInvocationUIPart,
  SourceUIPart,
  FileUIPart,
  StepStartUIPart,
  ReasoningUIPart,
  ChatRequestOptions,
  CreateMessage,
  Message as AISDKMessage,
} from "@ai-sdk/ui-utils";
import type { Attachment, JSONValue, UIMessage } from "ai";
import { nanoid } from "nanoid";
import {
  EffectScope,
  effectScope,
  isReactive,
  isRef,
  ref,
  toValue,
  watch,
  watchEffect,
  type UnwrapRef,
  type Ref,
  toRefs,
  onWatcherCleanup,
  computed,
  reactive,
} from "vue";
import { type UseChatHelpers } from "@ai-sdk/vue";
// import { computed } from "@vue/reactivity";

export class SessionInfo {
  id: string;
  title: string;
  createdAt: number;
}

export class Chat {
  #streamMessage = ref<UIMessage | null>(null);
  constructor(options: UseChatHelpers) {
    Object.assign(
      this,

      options
    );

    this.messages = computed(() => {
      const originMessages = toValue(options.messages);
      const status = toValue(options.status.value);

      if (status === "streaming") {
        const messages = originMessages.slice(0, originMessages.length - 1);
        const streamMessage = toValue(this.#streamMessage);
        if (!streamMessage) throw new Error();
        messages.push(streamMessage as any);
        return messages;
      } else {
        return originMessages;
      }
    }) as any;
    watch(options.status, (status) => {
      let scope: EffectScope | null = null as EffectScope | null;
      onWatcherCleanup(() => {
        if (scope) {
          scope.stop();
          scope = null;
        }
        if (status === "streaming") {
          if (this.#streamMessage.value) {
            // this.#streamMessage.value.reasoningDuration =
            //   Date.now() - this.#streamMessage.value.reasoningStartAt;
            this.#streamMessage.value.partStatus = ref("completed");
            Object.assign(
              options.messages.value.at(-1)!,
              this.#streamMessage.value
            );
          }
          this.#streamMessage.value = null;
        }
      });
      switch (status) {
        case "streaming": {
          this.#streamMessage.value = options.messages.value.at(-1)!;
          // this.#streamMessage.value.reasoningStartAt = Date.now();
          this.#streamMessage.value.partStatus = computed(() => {
            return this.#streamMessage.value?.parts.at(-1)?.type;
          });
          scope = effectScope();
          scope.run(() => {
            watch(
              () => options.messages.value.at(-1),
              (lastmessage) => {
                if (!lastmessage) throw new Error();
                if (!this.#streamMessage.value) throw Error();
                Object.assign(this.#streamMessage.value, lastmessage);
              }
            );

            watch(
              () => this.#streamMessage.value.partStatus,
              (partStatus) => {
                let reasoningStartAt;
                if (partStatus === "reasoning") {
                  reasoningStartAt = Date.now();
                }
                onWatcherCleanup(() => {
                  if (partStatus === "reasoning") {
                    this.#streamMessage.value.reasoningDuration =
                      Date.now() - reasoningStartAt;
                  }
                });
              }
            );
          });
          break;
        }
      }
    });
  }
}
export interface Chat extends UnwrapRef<UseChatHelpers> {
  messages: Message[];
}

export class Message {
  constructor(message: UIMessage) {
    Object.assign(this, message);
  }

  update(message: UIMessage) {
    Object.assign(this, message);
  }
}
export interface Message extends UIMessage {}

export class AssistantMessage extends Message {
  role = "assistant" as const;

  status: "started" | "reasoning" | "answering" | "completed";

  reasoningStartTime: number = 0;
  reasoningDuration?: number;
  constructor(
    message: UIMessage,
    status?: Ref<"error" | "submitted" | "streaming" | "ready">
  ) {
    super(message);
    if (status) {
      this.status = "started";

      const scope = effectScope();
      scope.run(() => {
        watch(status, (status) => {
          switch (status) {
            case "error":
            case "ready": {
              this.status = "completed";
              scope.stop();
            }
          }
        });
      });
    } else {
      this.status = "completed";
    }
  }
  update(message: UIMessage) {
    super.update(message);
    if (
      this.status === "started" &&
      message.parts.find((item) => item.type === "reasoning")
    ) {
      this.status = "reasoning";
      this.reasoningStartTime = Date.now();
      const disWatch = watch(
        () => this.status,
        (status) => {
          this.reasoningDuration = Date.now() - this.reasoningStartTime;
          disWatch();
        }
      );
    }
    if (
      (this.status === "started" || this.status === "reasoning") &&
      message.parts.find((item) => item.type === "text")
    ) {
      this.status = "answering";
    }
  }
}
