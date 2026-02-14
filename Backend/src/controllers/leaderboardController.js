const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "../data.json");

const getLeaderboard = (req, res) => {
  const data = JSON.parse(fs.readFileSync(dataPath));
  data.sort((a, b) => b.score - a.score);
  res.json(data);
};

module.exports = { getLeaderboard };