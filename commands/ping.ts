import { BaseCommand, Command, HelpInfo } from "../handler";

@Command("ping", "pong")
@HelpInfo({
  description: "Sends a ping",
  module: "Utils",
  usage: ["ping"],
})
export default class Ping extends BaseCommand {
  async execute(): Promise<void> {
    console.log("bom dia");
    await this.send("Pong!");
  }
}
