const express = require("express");
const router = express.Router();

const Team = require("../models/Team");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const bcrypt = require("bcryptjs");

/* ================= CREATE TEAM ================= */
router.post(
  "/",
  protect,
  authorize("admin", "superadmin"),
  async (req, res) => {
    try {
      const { teamName, totalBudget, email, password } = req.body;

      if (!teamName || !totalBudget || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const teamUser = await User.create({
        email,
        password: hashedPassword,
        role: "team",
      });

      const team = await Team.create({
        teamName,
        totalBudget,
        remainingPurse: totalBudget,
        playerCount: 0,
        players: [],
        owner: teamUser._id,
      });

      res.status(201).json(team);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= GET LOGGED-IN TEAM ================= */
router.get(
  "/my-team",
  protect,
  authorize("team"),
  async (req, res) => {
    try {
      const team = await Team.findOne({ owner: req.user._id })
        .populate("players");

      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      res.json({
        teamName: team.teamName,
        totalBudget: team.totalBudget,
        remainingPurse: team.remainingPurse,
        totalSpent: team.totalBudget - team.remainingPurse,
        playersBought: team.playerCount,
        players: team.players
      });

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= GET ALL TEAMS (FIXED) ================= */
router.get(
  "/",
  protect,
  authorize("host", "admin", "superadmin"),
  async (req, res) => {
    try {
      const teams = await Team.find()
        .select("teamName remainingPurse totalBudget playerCount");

      res.json(teams);
    } catch (err) {
      console.error("Get Teams Error:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= UPDATE TEAM ================= */
router.put(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  async (req, res) => {
    try {
      const team = await Team.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      res.json(team);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= DELETE TEAM ================= */
router.delete(
  "/:id",
  protect,
  authorize("admin", "superadmin"),
  async (req, res) => {
    try {
      await Team.findByIdAndDelete(req.params.id);
      res.json({ message: "Team deleted" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
