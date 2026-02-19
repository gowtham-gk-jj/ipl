const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    category: {
      type: String,
      enum: ["Batsman", "Bowler", "All-Rounder", "Wicket Keeper"],
      required: true
    },

    nationality: {
      type: String,
      enum: ["Indian", "Foreign"],
      required: true
    },

    capStatus: {
      type: String,
      enum: ["Capped", "Uncapped"],
      required: true
    },

    basePrice: {
      type: Number,
      required: true
    },

    soldPrice: {
      type: Number,
      default: 0
    },

    image: {
      type: String
    },

    matches: {
      type: Number,
      default: 0
    },

    runs: {
      type: Number,
      default: 0
    },

    isSold: {
      type: Boolean,
      default: false
    },

    soldTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null
    },

    auctionedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
