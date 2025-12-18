const express = require("express");
const app = express();

app.use(express.json());

let miningStatus = { isRunning: false, currentOre: "Basalt Rock" };

app.get("/", (req, res) => {
  res.json({ miningStatus });
});

app.post("/mining-status", (req, res) => {
  console.log("Mining status:", req.body);
  res.send({ ok: true });
});

module.exports = app;
