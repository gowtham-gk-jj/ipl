const mongoose = require("mongoose");

const bidSchema = new mongoose.Schema({
  player: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  amount: Number,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Bid", bidSchema);
