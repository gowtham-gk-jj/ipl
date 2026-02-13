const express = require("express");
const Team = require("../models/Team");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/* CREATE TEAM */
router.post(
  "/",
  protect,
  authorize("admin", "host", "superadmin"), // 👈 Added "admin"
  async (req, res) => {
    try {
      const { name, budget } = req.body;

      const team = await Team.create({
        name,
        budget,
        remainingPurse: budget,
        playerCount: 0
      });

      res.status(201).json(team);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

/* GET ALL TEAMS */
router.get("/", protect, async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
