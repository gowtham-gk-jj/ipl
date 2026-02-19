const express = require("express");
const router = express.Router();
const Player = require("../models/Player");
const Team = require("../models/Team");

router.get("/export", async (req, res) => {
  try {

    const players = await Player.find().populate("soldTo", "teamName");
    const teams = await Team.find();

    let csv = "Player Name,Category,Base Price,Sold Price,Team\n";

    players.forEach(player => {
      csv += `${player.name},${player.category},${player.basePrice},${player.soldPrice || 0},${player.soldTo?.teamName || "Unsold"}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("auction_report.csv");
    return res.send(csv);

  } catch (err) {
    console.error("Export Error:", err);
    res.status(500).json({ message: "Report export failed" });
  }
});

module.exports = router;
