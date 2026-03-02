const express = require("express");
const router = express.Router();
const Player = require("../models/Player");

router.get("/export", async (req, res) => {
  try {
    const players = await Player.find().populate("soldTo", "teamName");

    let csv = "Player Name,Category,Base Price,Sold Price,Team\n";

    players.forEach((player) => {
      csv += `"${player.name}","${player.category}",${player.basePrice},${player.soldPrice || 0},"${player.soldTo?.teamName || "Unsold"}"\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=auction_report.csv"
    );

    res.status(200).send(csv);

  } catch (err) {
    console.error("Export Error:", err);
    res.status(500).json({ message: "Export failed" });
  }
});

module.exports = router;