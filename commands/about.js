require("dotenv").config()
const { MessageEmbed,Message } = require("discord.js")
module.exports = {
    name:"about",
    description:"Shows basic bot information",
    cooldown:10,
    /**
     * 
     * @param { Message } message 
     * @param { Array<string> } args 
     */
    async execute(message,args) {
        const { client } = message
        const embed = new MessageEmbed()
        .setColor("#5100ff")
        .setAuthor(`About ${client.user.username}`,client.user.displayAvatarURL({ size:256 , dynamic:true}))
        .setDescription(`${client.user.username} is a bot that automatically bans Fortnite players.
**Version:** v${process.env.BOT_VERSION}
**Made by:** ${client.owner.tag} (${client.owner.id})`)
        message.channel.send(null,{ embed:embed })
    }
}