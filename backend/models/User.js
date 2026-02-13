const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: { type: String, enum: ["host", "team"] },
  teamName: String,
  budget: { type: Number, default: 100000000 }, // 10 Cr
});

module.exports = mongoose.model("User", userSchema);

