module.exports = {
  name: "invite",
  description: "Get the bot invite",
  async execute(message) {
    message.channel.send(await message.client.generateInvite(379972))
  }
};
