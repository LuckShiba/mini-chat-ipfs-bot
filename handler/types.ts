import type Handler from "./handler";
import type ChatClient from "../client";

export type CommandClass = new (
  client: ChatClient,
  nickname: string,
  args: string[]
) => BaseCommand;

export interface CommandData {
  commandNames: string[];
  cmdClass: CommandClass;
}

export class HelpData {
  description?: string;
  visible?: boolean;
  module?: string;
  usage?: string[];
}

export abstract class BaseCommand {
  msg!: string;
  nickname!: string;
  args!: string[];
  handler!: Handler;
  send!: (msg: string) => Promise<void>;

  abstract execute(): void;
}
