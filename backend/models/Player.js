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

    // ✅ NEW FIELD
    nationality: {
      type: String,
      enum: ["Indian", "Foreign"],
      required: true
    },

    // ✅ NEW FIELD
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
      ref: "Team"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Player", playerSchema);
