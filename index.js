#!/usr/bin/env node
require('dotenv').config()
const { ShardingManager } = require('discord.js')
const manager = new ShardingManager("./bot.js", { token: process.env.BOT_TOKEN })
manager.spawn()
manager.on('launch',shard => console.log("Launched shard " + shard.id))
process.on("unhandledRejection",(error,promise) => {
  console.error("[MANAGER] Unhandled Rejection at:" + error)
  if (error.constructor.name === "Response" && error.status === 429) setTimeout(() => {
    manager.spawn()
  },parseInt(error.headers.get("retry-after"))*1000)
})