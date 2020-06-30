const { Client,Message } = require('discord.js')
module.exports.Command = class {
    /**
     * @param { Client } client The client that instantiated this
     * @param { function } execute The function to be invoked when the command is executed
     * @param { Object } commandData 
     * @param { string } commandData.name The name of the command 
     * @param { string[]? } commandData.aliases The aliases of this command
     * @param { string? } commandData.description command description
     * @param { string? } commandData.info Detailed information about the command
     */
    constructor(client,{ 
        name,
        aliases,
        description,
        info,
        nsfw,
        args,
        cooldown,
        usage,
        execute 
    }) {
        Object.defineProperty(this, "client", {
            enumerable: false,
            writable: true,
            value:client
        });
        this.name = name
        this.id = name
        this.aliases = aliases
        this.description = description
        this.info = info
        this.nsfw = nsfw
        this.cooldown = cooldown
        this.args = args
        this.usage = usage
        this.execute = execute
        }
}