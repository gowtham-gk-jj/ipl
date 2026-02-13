const express = require("express");
const router = express.Router(); // ✅ MUST DEFINE THIS

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
      const { name, budget, email, password } = req.body;

      if (!name || !budget || !email || !password) {
        return res.status(400).json({ message: "All fields required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      // Create team login user
      const teamUser = await User.create({
        email,
        password: hashedPassword,
        role: "team"
      });

      // Create team
      const team = await Team.create({
        teamName: name,              // ✅ match model
        totalBudget: budget,         // ✅ match model
        remainingPurse: budget,
        playerCount: 0,
        owner: teamUser._id
      });


      res.status(201).json(team);

    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* ================= GET ALL TEAMS ================= */
router.get("/", protect, async (req, res) => {
  try {
    const teams = await Team.find().populate("owner");
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* ================= UPDATE TEAM ================= */
router.put("/:id", protect, authorize("admin", "superadmin"), async (req, res) => {
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
});

/* ================= DELETE TEAM ================= */
router.delete("/:id", protect, authorize("admin", "superadmin"), async (req, res) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.json({ message: "Team deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router; // ✅ MUST EXPORT
