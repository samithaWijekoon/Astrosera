const express = require('express');
const router = express.Router();
const leaderboardData = require('../data/leaderboard.json');

router.get('/', (req, res) => {
    res.json(leaderboardData);
});

module.exports = router;

// const express = require('express');
// const fs = require('fs');
// const router = express.Router();

// router.get('/', (req, res) => {
//     try {
//         // Read JSON file every time
//         const data = JSON.parse(fs.readFileSync('./data/leaderboard.json', 'utf-8'));
//         res.json(data);
//     } catch (err) {
//         console.error('Error reading leaderboard JSON:', err);
//         res.status(500).json({ error: 'Cannot read leaderboard data' });
//     }
// });

// module.exports = router;