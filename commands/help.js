require("dotenv").config()
const prefix = process.env.PREFIX;
const Keyv = require("keyv");
const prefixs = new Keyv("sqlite://.data/database.sqlite", {
  namespace: "prefixs"
});
const { Message } = require('discord.js')
module.exports = {
  name: "help",
  description: "Obtain help/link to support server",
  aliases: ["commands","man"],
  usage: "[command name]",
  cooldown: 5,
  execute: async (message, args) => {
    const data = [];
    const commands = message.client.commands.cache

    if (!args.length) {
      data.push("**Command count:** " + commands.size);
      data.push("Here's a list of all my commands:");
      data.push(
        commands
          .map(command => {
           if (!command.hidden) return "`" +
              command.name +
              "` -- " +
              (command.description || "**Documentation missing.**")
            else return "*(hidden command placeholder)*"
          })
          .join("\n")
      );
      data.push(
        `\nYou can send \`${prefix}help [command name]\` to get info on a specific command!`
      );
      data.push("\n\n**Support Server:**" + process.env.SUPPORT_LINK)
      data.push('\n**Note:** Fortnite detection is disabled in bot lists to reduce bot loads')
      return message.channel.send(data, { split: true, disableEveryone: true });
    }
    const name = args[0].toLowerCase();
    const command =
      commands.get(name) ||
      commands.find(c => c.aliases && c.aliases.includes(name));

    if (!command) {
      return message.reply("that's not a valid command!");
    }
    if (command.nsfw) data.push("⚠️NSFW Command⚠️")
    data.push(`**Name:** ${command.name}`);

    if (command.aliases)
      data.push(`**Aliases:** ${command.aliases.join(", ")}`);
    if (command.description)
      data.push(`**Description:** ${command.description}`);
    if (command.usage)
      data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);
    if (command.cooldown)
      data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
    if (command.info) data.push(`**Additional Info:**${command.info}`);
    message.channel.send(data, { split: true });
  }
};
