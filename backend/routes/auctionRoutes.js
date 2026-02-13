const express = require("express");
const Player = require("../models/Player");
const Team = require("../models/Team");
const Bid = require("../models/Bid");

const router = express.Router();

/* FINALIZE PLAYER */
router.post("/finalize/:playerId", async (req, res) => {
  const player = await Player.findById(req.params.playerId);
  const team = await Team.findById(player.soldTo);

  team.remainingPurse -= player.soldPrice;
  team.playersBought.push(player._id);

  await team.save();

  player.isSold = true;
  await player.save();

  res.json({ message: "Player sold successfully" });
});

module.exports = router;
