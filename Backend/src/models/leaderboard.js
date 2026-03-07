const mongoose = require("mongoose");

const leaderboardSchema = new mongoose.Schema({
  name: String,
  avatar: String,
  score: Number,
  streak: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Leaderboard", leaderboardSchema);