import { BaseCommand, Command, HelpInfo, HelpData } from "../handler";

const prefix = process.env.PREFIX || "?";

@Command("help", "ajuda", "commands")
@HelpInfo({
  module: "Utils",
  description: "Show the commands",
  usage: ["", "{command}"],
})
class Help extends BaseCommand {
  async execute(): Promise<void> {
    let msg;
    if (this.args.length === 0) {
      msg = this.showAllCommands();
    } else {
      msg = this.showCommandInfo();
    }

    await this.send("\n" + msg);
  }

  showCommandInfo(): string {
    const cmd = this.handler.commands.find(
      (x) => x.commandNames.findIndex((name) => name === this.args[0]) !== -1
    );
    let hasCmd = true;
    let cmdMetadata: HelpData;
    if (cmd === undefined) {
      hasCmd = false;
    }

    if (!hasCmd) {
      return "Command not found.";
    }

    cmdMetadata = Reflect.getMetadata(
      "command:help",
      cmd?.cmdClass!
    ) as HelpData;

    if (cmdMetadata == null) {
      cmdMetadata = new HelpData();
    }

    if (cmdMetadata.visible === false) {
      hasCmd = false;
    }
    let out = cmd?.commandNames[0] as string;

    out += ": " + cmdMetadata.description;

    if (cmdMetadata?.usage == null) {
      cmdMetadata.usage = [""];
    }

    let usages: string[] = [];
    for (const argusage of cmdMetadata?.usage) {
      usages.push(prefix + (cmd?.commandNames[0] as string) + " " + argusage);
    }

    out += "\n\nUsage: " + usages.join(" | ");

    if (cmd?.commandNames !== undefined && cmd?.commandNames.length > 1) {
      let aliases: string[] = [];
      cmd?.commandNames.forEach((alias) => {
        aliases.push(alias);
      });
      out += "\nAliases: " + aliases.join(" | ");
    }

    return out;
  }

  showAllCommands(): string {
    let out = `Commands:\nUse '${prefix}help {command name}' for more info.\n`;

    const commandModules: CommandModules[] = [];

    for (const cmd of this.handler.commands) {
      let helpData = Reflect.getMetadata(
        "command:help",
        cmd.cmdClass!
      ) as HelpData;

      if (helpData === undefined) {
        helpData = new HelpData();
      }

      if (helpData.visible === false) {
        continue;
      }

      helpData.module = helpData.module ?? "Default";

      const moduleIndex = commandModules.findIndex(
        (x) => x.module === helpData.module
      );

      if (moduleIndex === -1) {
        commandModules.push({
          module: helpData.module,
          commands: [cmd.commandNames[0]],
        });
      } else {
        commandModules[moduleIndex].commands.push(cmd.commandNames[0]);
      }
    }

    const data = [];

    for (const module of commandModules) {
      let cmdsname = "";

      module.commands.forEach((cmd) => {
        cmdsname += "'" + cmd + "' ";
      });

      data.push(`${module.module}: ${cmdsname}`);
    }

    out += "\n" + data.join("\n");
    return out;
  }
}

interface CommandModules {
  module: string;
  commands: string[];
}

export default Help;
