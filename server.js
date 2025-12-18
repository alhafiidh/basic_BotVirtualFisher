// Install dulu: npm install express body-parser axios discord.js

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(bodyParser.json());

// ====== Discord Bot Setup ======
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Simpan status mining
let miningStatus = { isRunning: false, currentOre: "Basalt Rock" };

// Login bot pakai token dari environment variable
client.login(process.env.DISCORD_BOT_TOKEN);

client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

// Baca command dari channel Discord
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

// ====== API untuk Roblox Script ======

// Status mining
app.post("/mining-status", (req, res) => {
  console.log("Mining status update:", req.body);
  res.send({ ok: true });
});

// Update gold
app.post("/gold-update", (req, res) => {
  console.log("Gold update:", req.body);
  res.send({ ok: true });
});

// Update ores
app.post("/ore-update", (req, res) => {
  console.log("Ore update:", req.body);
  res.send({ ok: true });
});

// Rare ore notification → forward ke Discord channel via webhook
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

// Endpoint untuk Roblox script membaca command
app.get("/", (req, res) => {
  res.json({ miningStatus });
});

// Jalankan server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 API running on port ${PORT}`));