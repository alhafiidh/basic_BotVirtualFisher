const express = require("express");
const axios = require("axios");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());

// Simpan status mining
let miningStatus = { isRunning: false, currentOre: "Basalt Rock" };

// Discord Bot Setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.login(process.env.DISCORD_BOT_TOKEN);

client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!start")) {
    miningStatus.isRunning = true;
    miningStatus.currentOre = message.content.split(" ")[1] || "Basalt Rock";
    message.reply(`🚀 Mining started! Target ore: ${miningStatus.currentOre}`);
  }

  if (message.content === "!stop") {
    miningStatus.isRunning = false;
    message.reply("🛑 Mining stopped!");
  }

  if (message.content.startsWith("!ore")) {
    miningStatus.currentOre = message.content.split(" ")[1] || "Basalt Rock";
    message.reply(`🎯 Ore target changed to: ${miningStatus.currentOre}`);
  }
});

// API untuk Roblox Script
app.get("/", (req, res) => {
  res.json({ miningStatus });
});

app.post("/mining-status", (req, res) => {
  console.log("Mining status:", req.body);
  res.send({ ok: true });
});

app.post("/gold-update", (req, res) => {
  console.log("Gold update:", req.body);
  res.send({ ok: true });
});

app.post("/ore-update", (req, res) => {
  console.log("Ore update:", req.body);
  res.send({ ok: true });
});

app.post("/ore-notify", async (req, res) => {
  console.log("Rare ore notification:", req.body);
  try {
    await axios.post(process.env.DISCORD_WEBHOOK_URL, {
      content: `${req.body.username} got ${req.body.message}`
    });
  } catch (err) {
    console.error("Webhook error:", err.message);
  }
  res.send({ ok: true });
});

module.exports = app;
