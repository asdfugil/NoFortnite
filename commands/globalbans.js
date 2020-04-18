const Keyv = require("keyv")
const stats = new Keyv("sqlite://.data/database.sqlite", { namespace: "stats" })
module.exports = {
    name:"globalbans",
    aliases:["globalbancount","global-ban-count"],
    description:"Shows how many times the bot has banned Fortnite players.",
    guildOnly:true,
    async execute(message) { message.channel.send(`**${await stats.get("global-ban-count") || 0}** people/person have/has been banned for playing Fortnite.`) }
}