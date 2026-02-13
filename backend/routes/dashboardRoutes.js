const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Team = require("../models/Team");

router.get("/admin", async (req, res) => {
  try {
    const totalPlayers = await Player.countDocuments();
    const totalTeams = await Team.countDocuments();

    res.json({
      totalPlayers,
      totalTeams,
      totalRevenue: 0
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
