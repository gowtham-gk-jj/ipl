const express = require("express");
const router = express.Router();
const Player = require("../models/Player");

// Team-wise bought players report
router.get("/export-team-players", async (req, res) => {
  try {
    const players = await Player.find({
      soldTo: { $ne: null }   // Only sold players
    }).populate("soldTo", "teamName");

    let csv = "Team Name,Player Name,Category,Bought Price\n";

    players.forEach(player => {
      csv += `"${player.soldTo?.teamName}","${player.name}","${player.category}",${player.soldPrice}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=team_bought_players_report.csv"
    );

    res.status(200).send(csv);

  } catch (error) {
    console.error("Export Error:", error);
    res.status(500).json({ message: "Export failed" });
  }
});

module.exports = router;