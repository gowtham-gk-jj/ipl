const mongoose = require("mongoose");

const auctionHistorySchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    required: true
  },

  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null   // 🔥 FIXED (removed required)
  },

  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  soldPrice: {
    type: Number,
    required: true
  },

  soldAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("AuctionHistory", auctionHistorySchema);
