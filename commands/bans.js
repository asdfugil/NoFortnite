const Keyv = require("keyv")
const stats = new Keyv("sqlite://.data/database.sqlite", { namespace: "stats" })
module.exports = {
    name:"bans",
    aliases:["bancount","ban-count"],
    description:"Shows how many people have been banned for playing Fortnite in this server.",
    guildOnly:true,
    async execute(message) { message.channel.send(`**${await stats.get(message.guild.id + "-ban-count") || 0}** people/person have/has been banned for playing Fortnite in this server`) }
}