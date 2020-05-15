//console.log("Starting...");
require("dotenv").config();
const { Client, Collection, BaseManager, Intents } = require("discord.js");
const { Command } = require("./command.js");
const fs = require("fs");
const fortnite_ban = require("./fortnite_ban.js");
const cooldowns = new Collection();
process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at:', p)
});
class CommandManager extends BaseManager {
  constructor(client) {
    super(client, new Array(), Command);
  }
  /**
   * Loads a command
   * @param { string } path ./path/to/comamndFile.js
   */
  load(path) {
    const cmd = require(path);
    return this.add(cmd);
  }
  /**
   * Unload a command
   * @param { string } name name of the command
   */
  unload(name) {
    delete require.cache[require.resolve(`./${name}.js`)];
    this.cache.delete(name);
  }
}
class NoFortniteClient extends Client {
  /**
   * @param { Object } options
   */
  constructor(options) {
    super(options);
    this.commands = new CommandManager(this);
  }
}
const client = new NoFortniteClient({
  partials: ["GUILD_MEMBER", "USER"],
  messageCacheMaxSize:5,
  ws: {
    large_threshold:250,
    intents: new Intents([
      "GUILDS",
      "GUILD_PRESENCES",
      "GUILD_MESSAGES",
      "DIRECT_MESSAGES"
    ])
  }
});
process.on('exit',code => console.error(`Terminated (${code})`))
fs.readdirSync(__dirname + "/commands")
  .filter(file => file.endsWith(".js"))
  .forEach(file => {
    try {
      const cmd = client.commands.load("./commands/" + file);
      // console.log(`Command "${cmd.name}" loaded.`);
    } catch (error) {
      console.log(`Unable to load ${file}, reason:\n${error.stack}`);
    }
  });
client.on("presenceUpdate", fortnite_ban);
client.on("message", async message => {
  if (message.author.bot) return;
  if (
    [`<@${client.user.id}>`, `<@!${client.user.id}>`].includes(message.content)
  )
    return message.channel.send(
      `Hi!My prefix is \`${process.env.PREFIX}\`.\nTo get started type \`${process.env.PREFIX}help\``
    );
  if (!message.content.startsWith(process.env.PREFIX)) return;
  if (
    message.guild &&
    !message.channel.permissionsFor(message.guild.me).serialize().SEND_MESSAGES
  )
    return;
  const args = message.content.split(" ");
  const commandName = args
    .shift()
    .substr(process.env.PREFIX.length)
    .toLowerCase();
  const command =
    client.commands.cache.get(commandName) ||
    client.commands.cache.find(
      cmd => cmd.aliases && cmd.aliases.includes(commandName)
    );
  if (!command) return;
  if (args.length < command.args) {
    let a = "You didn't provide enough arguments";
    if (command.usage)
      a +=
        "\nThe proper usage is `" +
        process.env.PREFIX +
        command.name +
        " " +
        command.usage +
        "`";
    message.reply(a);
  }
  if (command.nsfw && !message.channel.nsfw)
    return message.reply("NSFW commands can only be used in NSFW channels.");
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }
  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  try {
    await command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("there was an error trying to execute that command!");
  }
});
client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag} at ${new Date().toString()}.`);
  client.user.setActivity({
    name: "v2.0.1 | Use " + process.env.PREFIX + "help for help"
  });
  client.owner = await client.users.fetch(process.env.OWNERID);
});
client.login(process.env.BOT_TOKEN)
.catch(() => client.login(process.env.BOT_TOKEN))
.catch(() => client.login(process.env.BOT_TOKEN))
.catch(() => client.login(process.env.BOT_TOKEN))
.catch(() => client.login(process.env.BOT_TOKEN))
.catch(() => client.login(process.env.BOT_TOKEN))