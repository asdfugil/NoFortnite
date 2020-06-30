const Keyv = require("keyv")
const { performance } = require("perf_hooks")
const ping = new Keyv("sqlite://.data/database.sqlite",{namespace:"ping"})
module.exports = {
    name: 'ping',
    description: 'returns latency',
    aliases: ['pong'],
    cooldown: 3,
    execute:async function (message, args) {
        message.channel.send(`Pinging...`).then(async m => {
          const now = performance.now()
         await ping.get("test")
          const read = performance.now()
            m.edit(
                `
                ========PONG!=========
• Message round trip                        :: ${Math.round(Date.now() - m.createdTimestamp - read + now)} ms 
• Discord API heartbeat                     :: ${Math.round(message.client.ws.ping)} ms
• Database (read)                           :: ${(read - now).toFixed(2)} ms`,       
                { code: "asciidoc" }
            );
        });
    }
}