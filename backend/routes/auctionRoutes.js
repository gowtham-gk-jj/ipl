const express = require("express");
const Player = require("../models/Player");
const Team = require("../models/Team");
const AuctionHistory = require("../models/AuctionHistory");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/* ================= HOST CONFIRM SOLD ================= */
router.post(
  "/sold/:id",
  protect,
  authorize("host", "admin"),
  async (req, res) => {
    try {
      const { amount, teamId } = req.body;

      // ✅ Validation
      if (!amount || !teamId) {
        return res.status(400).json({
          message: "Please select team and amount",
        });
      }

      const player = await Player.findById(req.params.id);
      if (!player) {
        return res.status(404).json({
          message: "Player not found",
        });
      }

      // ✅ Prevent double sell
      if (player.isSold) {
        return res.status(400).json({
          message: "Player already sold",
        });
      }

      const team = await Team.findById(teamId).populate("owner");
      if (!team) {
        return res.status(404).json({
          message: "Team not found",
        });
      }

      // ✅ Check purse
      if (team.remainingPurse < amount) {
        return res.status(400).json({
          message: "Insufficient purse",
        });
      }

      /* ================= UPDATE PLAYER ================= */
      player.isSold = true;
      player.soldPrice = amount;
      player.soldTo = team._id;
      await player.save();

      /* ================= UPDATE TEAM ================= */
      if (!team.players) team.players = [];

      team.players.push(player._id);
      team.remainingPurse -= amount;
      team.playerCount = team.players.length;

      await team.save();

      /* ================= SAVE HISTORY ================= */
      await AuctionHistory.create({
        player: player._id,
        team: team._id,
        host: req.user._id,
        soldPrice: amount,
      });

      /* ================= 🔥 LIVE SOCKET UPDATE ================= */
      const io = req.app.get("io");

      if (io) {
        io.to(team.owner._id.toString()).emit("playerSold", {
          player,
        });
      }

      res.status(200).json({
        message: "Player Sold Successfully",
      });

    } catch (err) {
      console.error("Auction Sold Error:", err);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);


/* ================= MARK UNSOLD ================= */
router.post(
  "/unsold/:id",
  protect,
  authorize("host", "admin"),
  async (req, res) => {
    try {
      const player = await Player.findById(req.params.id);

      if (!player) {
        return res.status(404).json({
          message: "Player not found",
        });
      }

      player.isSold = false;
      player.soldPrice = 0;
      player.soldTo = null;

      await player.save();

      res.status(200).json({
        message: "Player marked as Unsold",
      });

    } catch (err) {
      console.error("Unsold Error:", err);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);
/* ================= GET NEXT PLAYER ================= */
router.get(
  "/next-player",
  protect,
  authorize("host", "admin"),
  async (req, res) => {
    try {
      const nextPlayer = await Player.findOne({ isSold: false })
        .sort({ createdAt: 1 });

      if (!nextPlayer) {
        return res.status(200).json({
          message: "Auction Finished",
        });
      }

      res.status(200).json(nextPlayer);

    } catch (err) {
      console.error("Next Player Error:", err);
      res.status(500).json({
        message: "Server Error",
      });
    }
  }
);

module.exports = router;
