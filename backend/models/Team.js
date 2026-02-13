const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  budget: { type: Number, default: 100000000 },
  remainingPurse: { type: Number, default: 100000000 },
  playersBought: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }]
});

module.exports = mongoose.model("Team", teamSchema);
