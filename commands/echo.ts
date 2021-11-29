import { BaseCommand, Command, HelpInfo } from "../handler";

@Command("echo", "say")
@HelpInfo({
  description: "Echoes a message",
  module: "Fun",
  usage: ["{message}"],
})
export default class Ping extends BaseCommand {
  async execute(): Promise<void> {
    if (this.args.length === 0) {
      return await this.send("What is the message?");
    }

    await this.send(this.args.join(" "));
  }
}
