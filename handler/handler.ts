import glob from "glob";
import { CommandData } from "./types";
import _ from "lodash";
import ChatClient from "../client";
import { CommandClass } from ".";

export default class Handler {
  private _commands: CommandData[] = [];

  constructor(client: ChatClient) {
    client.on("message", ({ msg, nickname }) => {
      const prefix = process.env.PREFIX || "?";
      if (!msg.startsWith(prefix)) {
        return;
      }

      const args = msg.slice(prefix.length).split(/ +/);

      const cmd = args.shift()?.toLowerCase();

      if (!cmd) {
        return;
      }

      const command = this.commands.find((c) => c.commandNames.includes(cmd));

      if (!command) {
        return;
      }

      try {
        const { cmdClass } = command;
        const cmdInstance = new cmdClass(client, nickname, args);
        cmdInstance.msg = msg;
        cmdInstance.nickname = nickname;
        cmdInstance.args = args;
        cmdInstance.handler = this;
        cmdInstance.send = client.send.bind(client);
        cmdInstance.execute();
      } catch (error) {
        console.error(error);
      }
    });
  }

  get commands() {
    return this._commands;
  }

  build() {
    this.registerCommands();
  }

  private registerCommands() {
    glob(
      "./commands/**/*.ts",
      {
        absolute: true,
      },
      (err, files) => {
        console.log("To load: " + files.length + " commands.");
        let index = 0;
        for (const file of files) {
          const cmd = require(file).default as CommandClass;

          this._commands.push({
            commandNames: Reflect.getMetadata("command:names", cmd),
            cmdClass: cmd,
          });
          console.log(index + 1 + ": " + file + " loaded.");
          index++;
        }

        console.log("\n");
      }
    );
  }
}
