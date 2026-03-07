const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserStats = require('../models/UserStats');

/**
 * GET /api/leaderboard
 * Returns top 10 users ranked by totalScore, with streak from UserStats.
 * Marks isUser when userId query param is supplied.
 */
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;

        // Fetch top 10 by score
        const topUsers = await User.find()
            .sort({ totalScore: -1 })
            .limit(10)
            .select('username avatarInitials totalScore');

        // Batch-fetch streaks from UserStats
        const userIds = topUsers.map(u => u._id.toString());
        const statsArr = await UserStats.find({ userId: { $in: userIds } })
            .select('userId currentStreak');
        const streakMap = {};
        statsArr.forEach(s => { streakMap[s.userId] = s.currentStreak; });

        const leaderboard = topUsers.map((u, i) => ({
            rank: i + 1,
            name: u.username || 'Unknown',
            avatar: u.avatarInitials || u.username.slice(0, 2).toUpperCase(),
            score: u.totalScore,
            streak: streakMap[u._id.toString()] || 0,
            isUser: userId ? u._id.toString() === userId : false,
        }));

        return res.json({ leaderboard });
    } catch (err) {
        console.error('[GET /leaderboard]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;