import type { UIMessage } from "ai";
import { nanoid } from "nanoid";
import { isReactive, isRef, type Ref } from "vue";

export class Session {
  id: string;
  title: string; // session title
  messages: UIMessage[]; // messages 来自 ai-sdk
  createdTime: number; // session 创建时间
  sessionList: SessionList; // 此 session 所属的 session list
  isNewSession?: boolean; // 是否是新建会话
  constructor(args: {
    id: string;
    title: string;
    messages: UIMessage[];
    sessionList: SessionList;
    isNewSession?: boolean;
  }) {
    this.id = args.id;
    this.messages = args.messages;
    this.title = args.title;
    this.createdTime = Date.now();
    this.sessionList = args.sessionList;
    if (args.isNewSession) this.isNewSession = args.isNewSession;
  }

  // 从 session list 中删除此 session
  delete() {
    // const index =
    this.sessionList.deleteSession(this);
  }

  // 创建 session
  create(session: {
    title?: string;
    messages?: Ref<UIMessage[]> | UIMessage[];
  }) {
    if (!this.isNewSession) {
      throw new Error("当前 session 不是 newSession");
    }
    delete this.isNewSession;
    this.update(session);
    this.sessionList.createEmptySession();
  }

  // 更新
  update(session: {
    title?: string;
    messages?: Ref<UIMessage[]> | UIMessage[];
  }) {
    session.title && (this.title = session.title);
    if (session.messages && isRef(session.messages) && !isReactive(this)) {
      throw new Error("messages 传入 ref 时, sessionList[0] 必须为 reactive.");
    }
    session.messages && (this.messages = session.messages as UIMessage[]);
  }
}

export class SessionList extends Array<Session> {
  // 第一条数据是空 Session，用于创建新会话
  get emptySession() {
    return this[0];
  }
  createEmptySession() {
    this.unshift(
      new Session({
        id: nanoid(),
        title: "",
        messages: [],
        sessionList: this,
        isNewSession: true,
      })
    );
  }
  createSession({
    title,
    messages,
  }: {
    title: string;
    messages: Ref<UIMessage[]> | UIMessage[];
  }) {
    this[0].title = title;
    this[0].createdTime = Date.now();
    if (isRef(messages) && !isReactive(this[0])) {
      throw new Error("messages 传入 ref 时, sessionList[0] 必须为 reactive.");
    }
    this[0].messages = messages as UIMessage[];
    this.createEmptySession();
  }
  deleteSession(session: Session) {
    const index = this.findIndex((item) => item.id === session.id);
    if (index === -1) {
      throw new Error("sessionList 中没有指定 session");
    }
    this.splice(index, 1);
  }
}
