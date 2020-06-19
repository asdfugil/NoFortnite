#!/usr/bin/env node
require('dotenv').config()
const { ShardingManager } = require('discord.js')
const manager = new ShardingManager("./bot.js", { token: process.env.BOT_TOKEN })
manager.spawn()
manager.on('launch',shard => console.log("Launched shard " + shard.id))
process.on("unhandledRejection",(error,promise) => {
  console.error(error)
  if (error.message === "<#Response>") process.exit(1)
})