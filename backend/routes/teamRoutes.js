const express = require("express");
const Team = require("../models/Team");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

/* CREATE TEAM */
router.post("/", protect, authorize("host", "superadmin"), async (req, res) => {
  const { teamName, ownerId, budget } = req.body;

  const team = await Team.create({
    teamName,
    owner: ownerId,
    budget,
    remainingPurse: budget
  });

  res.json(team);
});

/* GET ALL TEAMS */
router.get("/", protect, async (req, res) => {
  const teams = await Team.find().populate("owner");
  res.json(teams);
});

module.exports = router;
