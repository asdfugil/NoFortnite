const { exec } = require("child_process");
const Discord = require("discord.js");
const fs = require("fs");
const devsID = process.env.DEVS_ID.split(",")
const { MessageAttachment, MessageEmbed, Permissions } = Discord;
const EventEmitter = require("events");
const clean = require("../clean.js")
module.exports = {
  args: true, //either boolean or number
  name: "exec",
  aliases: ["$","bash"],
  cooldown: 0.1,
  description: "Run bash or command on terminal (bot developers only)",
  usage: "<terminal-command>",
  execute: async (message, args) => {
    if (!devsID.includes(message.author.id)) return;
   const mu = Date.now()
   exec(args.join(" "),(error,stdout,stderr) => {
     const time = Date.now() - mu
     const embed = new MessageEmbed()
      if (stdout) {
        fs.writeFileSync("/tmp/stdout.log",stdout)
          embed
          .setColor("#00ff00")
          .setTitle("Output")
           if (clean(stdout).length < 2010)embed.setDescription("```bash\n" + clean(stdout)+"\n```");
          embed.setFooter(`${time}ms`)
          if (message.guild && message.channel.permissionsFor(message.guild.me).serialize().ATTACH_FILES) embed.attachFiles(["/tmp/stdout.log"])
          return message.channel.send(embed)
      } else if (stderr) {
        fs.writeFileSync("/tmp/stderr.log",stdout)
        embed
        .setColor("#ff0000")
        .setTitle("Error")
           if (clean(stderr).length < 2010)embed.setDescription("```bash\n" + (clean(stderr) || "# Command execution failed and returned no output") +"\n```");
        embed.setFooter(`${time}ms`)
        if (message.guild && message.channel.permissionsFor(message.guild.me).serialize().ATTACH_FILES) embed.attachFiles(["/tmp/stderr.log"])
        return message.channel.send(embed)
      } else {
        embed
        .setColor("#00ff00")
        .setTitle("Output")
        .setDescription("```bash\n# Command executed successfully but returned no output\n```")
        .setFooter(`${time}ms`)
        return message.channel.send(embed)
      }
   })
  }
};
