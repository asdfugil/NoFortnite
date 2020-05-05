const Keyv = require("keyv")
const log_channels = new Keyv("sqlite://.data/database.sqlite", { namespace:"log_cahnnels" })
module.exports = {
    name:"set-log-channel",
    description:"set the channel to post logs,use $NONE to delete it.",
    info:"If this is not set the bot will post logs to a channel named no-fortnite-logs if it exists",
    usage:"<channel|none>",
    async execute(message,args) {
        if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("You need the manage server permission to perform this command.")
        if (args.join(" ").toLowerCase() === "none") {
            log_channels.delete(message.guild.id) 
            .then(() => message.channel.send("Log channel setting deleted"))
            return
        }
        const channel = message.guild.channels.cache.find(x => args.join(" ").includes(x.id) || args.join(" ").includes(x.name))
        if (!channel) return message.reply("I cannot find that channel.")
        if (channel.type !== 'text') message.reply("That channel is not a text channel.")
        log_channels.set(message.guild.id,channel.id)
        .then(() => message.channel.send(channel + " will be used for logging."))
    }
}
