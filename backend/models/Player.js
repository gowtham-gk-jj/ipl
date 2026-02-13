const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema({
  name: String,
  category: {
    type: String,
    enum: ["Batsman", "Bowler", "AllRounder", "WicketKeeper"]
  },
  basePrice: Number,
  soldPrice: Number,
  image: String,
  matches: Number,
  runs: Number,
  isSold: { type: Boolean, default: false },
  soldTo: { type: mongoose.Schema.Types.ObjectId, ref: "Team" }
});

module.exports = mongoose.model("Player", playerSchema);
