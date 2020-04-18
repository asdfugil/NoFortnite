const { MessageEmbed, version,Message } = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
module.exports = {
  name: "stats",
  aliases: ["statistics", "botinfo", "botstats"],
  description: "Display bot statisics",
  cooldown: 20,
/**
 * @param { Message } message
 */
  execute: async (message, args) => {   
    const client = message.client;
    const duration = moment
      .duration(client.uptime)
      .format(" D [days], H [hrs], m [mins], s [secs]");
    const processDuration = moment
      .duration(process.uptime()*1000)
      .format(" D [days], H [hrs], m [mins], s [secs]");
    const servers = await client.shard.broadcastEval("this.guilds.cache.size");
    const users = await client.shard.broadcastEval("this.users.cache.size");
    const channels = await client.shard.broadcastEval("this.channels.cache.size");
    const rssUsage = await client.shard.broadcastEval(
      "process.memoryUsage().rss/1024/1024"
    );
    const heapUsage = await client.shard.broadcastEval(
      "process.memoryUsage().heapUsed/1024/1024"
    );
    const statsEmbed = new MessageEmbed()
      .setColor("#363A3F")
      .setAuthor("Statistics", "https://i.imgur.com/7hCWXZk.png")
      .setTitle(`${client.user.username}'s stats`)
      .setDescription(
        "Contains essential information regarding our service and bot information."
      )
      .setThumbnail(client.user.displayAvatarURL)
      .addField("Client Uptime", `${duration}`, true)
    .addField("Process Uptime",`${processDuration}`,true)
      .addField("Shards", `${client.shard.count}`, true)
      .addField(
        "Servers",
        `${servers.reduce((previous, count) => previous + count, 0)}`,
        true
      )
      .addField(
        "Channels",
        `${channels.reduce((previous, count) => previous + count, 0)}`,
        true
      )
      .addField(
        "Cached Users",
        `${users.reduce((previous, count) => previous + count, 0)}`,
        true
      )
      .addField("Discord.js Version", `${version}`, true)
      .addField("NodeJS Version", `${process.version}`, true)
      .addField("Websocket Ping", `${Math.round(client.ws.ping)}ms`, true)
      .addField(
        "Memory Usage",
        `${rssUsage
          .reduce((previous, count) => previous + count, 0)
          .toFixed(2)} MB RSS\n${heapUsage
          .reduce((previous, count) => previous + count, 0)
          .toFixed(2)} MB Heap`,
        true
      )
      .setFooter(client.user.tag, client.user.displayAvatarURL);
    message.channel.send(statsEmbed);
  }
};
