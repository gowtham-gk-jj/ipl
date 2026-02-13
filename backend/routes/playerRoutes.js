const express = require("express");
const Player = require("../models/Player");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/* ADD PLAYER */
router.post("/", protect, authorize("host"), async (req, res) => {
  const player = await Player.create(req.body);
  res.json(player);
});

/* GET PLAYERS */
router.get("/", async (req, res) => {
  const players = await Player.find().populate("soldTo");
  res.json(players);
});

module.exports = router;
