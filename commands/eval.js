require('dotenv').config()
const Discord = require("discord.js");
const fs = require("fs");
const fetch = require("node-fetch")
let { DEVS_ID } = process.env
DEVS_ID = DEVS_ID.split(',')
const { MessageAttachment, MessageEmbed, Permissions } = Discord;
const EventEmitter = require("events");
const util = require("util");
const clean = require("../clean.js")
const tmp = require('os').tmpdir()
module.exports = {
  args: true, //either boolean or number
  name: "eval",
  aliases: ["run", "execute"],
  cooldown: 0.1,
  description: "Execute code (bot developers only)",
  usage: "<code>",
  execute: async (message, args) => {
    if (!DEVS_ID.includes(message.author.id)) return;
    const fav = await message.client.users.fetch("400581909912223744")
    let reaction;
     if (message.guild && message.channel.permissionsFor(message.guild.me).serialize().ADD_REACTIONS) await message.react("📝")
    try {
      const client = message.client;
      const code = args.join(" ");
      let evaled = await eval(code)
  
          if (typeof evaled !== "string") evaled = util.inspect(evaled,{depth:4});

          if (clean(evaled).length < 1980)
            message.channel.send(clean(evaled), {
              code: "xl"
            });
          fs.writeFileSync(`${tmp}/no-fortnite/result.log`, clean(evaled));
          if (message.guild && message.channel.permissionsFor(message.guild.me).serialize().ATTACH_FILES) message.channel
            .send(new MessageAttachment(`${tmp}/no-fortnite/result.log`))
            .then(() => {
              if (reaction) reaction.remove();
              message.react("✅");
            })
            .catch(error => {
              message.channel.send(
                `\`ERROR\` \`\`\`xl\n${clean(error)}\n\`\`\``
              );
              if (reaction) reaction.remove();
              message.react("❌");
            });
    } catch (err) {
      message.channel.send(
        `\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``
      );
      if (reaction) reaction.remove();
      message.react("❌");
    }
  }
};
