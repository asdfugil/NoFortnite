#!/usr/bin/env node
require('dotenv').config()
const { ShardingManager } = require('discord.js')
const manager = new ShardingManager("./bot.js", { token: process.env.BOT_TOKEN })
manager.spawn()
manager.on('launch',shard => console.log("Launched shard " + shard.id))
