// /// <reference path="ai" />
import {
  TextUIPart,
  ReasoningUIPart as OriginReasoningUIPart,
  ToolInvocationUIPart,
  SourceUIPart,
  FileUIPart,
  StepStartUIPart,
  Message,
  UIMessage,
} from "@ai-sdk/ui-utils";
import "ai";
/// re

declare module "@ai-sdk/ui-utils" {
  // type UIMessage
  // import('ai')
  // import {type UIMessage as OriginUIMessage} from 'ai'
  // import OriginUIMessage =
  // type A = import('ai').UIMessage
  // type B = UIMessage
  export type ReasoningUIPart = {
    type: "reasoning";
    isReasoning?: boolean;
    reasoningDuration?: number,
    reasoningStartTime?:number,
    /**
     * The reasoning text.
     */
    reasoning: string;
    details: Array<
      | {
          type: "text";
          text: string;
          signature?: string;
        }
      | {
          type: "redacted";
          data: string;
        }
    >;
  };
  //   type a = ReasoningUIPart['isReasoning']
  export type UIMessage = Message & {
    /**
     * The parts of the message. Use this for rendering the message in the UI.
     *
     * Assistant messages can have text, reasoning and tool invocation parts.
     * User messages can have text parts.
     */
    parts: Array<
      | TextUIPart
      | ReasoningUIPart
      | ToolInvocationUIPart
      | SourceUIPart
      | FileUIPart
      | StepStartUIPart
    >;
  };
}

declare module "ai" {
  export { UIMessage };
}
