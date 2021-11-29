import { EventEmitter } from "events";
import EventStore from "orbit-db-eventstore";

export interface MessagePayload {
  msg: string;
  nickname: string;
}

declare interface ChatClient {
  on(event: "message", listener: (payload: MessagePayload) => void): this;
}

class ChatClient extends EventEmitter {
  constructor(public nickname: string, private db: EventStore<MessagePayload>) {
    super();

    db.events.on("replicated", () => {
      this.emit(
        "message",
        db.iterator({ limit: 1 }).collect()[0].payload.value
      );
    });
  }

  async send(msg: string) {
    await this.db.add({ msg, nickname: this.nickname });
  }
}

export default ChatClient;
