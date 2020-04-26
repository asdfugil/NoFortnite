// server.js
// where your node app starts

// init project
require("dotenv").config();
const {
  VOTE_WEBHOOK_ID,
  VOTE_WEBHOOK_TOKEN,
  CLIENT_ID,
  BOT_TOKEN,
  CLIENT_SECRET,
  REDIRECT_URI,
  SCOPES
} = process.env;
const express = require("express");
const { Client, WebhookClient } = require("discord.js");
const Keyv = require("keyv");
const votes = new Keyv("sqlite://.data/database.sqlite", {
  namespace: "votes"
});
const stats = new Keyv("sqlite://.data/database.sqlite", {
  namespace: "stats"
});
const client = new Client();
const fetch = require("node-fetch");
const vote_hook = new WebhookClient(VOTE_WEBHOOK_ID, VOTE_WEBHOOK_TOKEN);
const crypto = require("crypto");
const FormData = require("form-data");
const app = express();
app.disable("x-powered-by");
// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.
require("./index.js");
// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});
app.get("/commands", function(request, response) {
  response.sendFile(__dirname + "/views/commands.html");
});
// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Server listening on port " + listener.address().port);
});
app.get("/api", (_, response) => {
  response.send('"hi"');
});
app.get("/api/v1", (_, response) => {
  response.send('{"version":"1.0"}');
});
app.post("/api/v1/upvote", async (request, response) => {
  const key = request.headers.authorization;
  if (!key) return response.status(401).send('"Please provide the vote key."');
  const hash = crypto
    .createHash("md5")
    .update(key)
    .digest("hex");
  if (hash !== process.env.DBL_KEY_HASH)
    return response.status(401).send('"Incorrect key"');
  if (request.body.type === "upvote") {
    const user = await client.users.fetch(request.body.user);
    vote_hook.send(`${user.tag} (${user.id}) has just voted!`);
  } else {
    vote_hook.send(JSON.stringify(request.body), { code: "json" });
  }
});
app.get("/api/v1/bans", async (request, response) => {
  const count = (await stats.get("global-ban-count")) || 0;
  response.send(count.toString());
});
app.get("/api/v1/join/callback", async (request, response) => {
  const data = new FormData();
  data.append("client_id", CLIENT_ID);
  data.append("client_secret", CLIENT_SECRET);
  data.append("grant_type", "authorization_code");
  data.append("redirect_uri", REDIRECT_URI);
  data.append("scope", SCOPES);
  data.append("code", request.query.code);
  const credintals = await fetch("https://discordapp.com/api/oauth2/token", {
    method: "POST",
    body: data
  }).then(res => res.json());
  console.log(credintals.access_token)
  fetch("https://discordapp.com/api/v7/guilds/651703685595791380/members", {
    method: "PUT",
    headers: {
      authorization: BOT_TOKEN,
      "Content-Type":"application/json"
    },
    body: {
      access_token: `${credintals.access_token}`
    }
  }).then(async res => {
    console.log(await res.text());
    return res.ok ? response.send("true") : response.send("false");
  });
});
client.login(process.env.RANDOM_BOT_TOKEN);
