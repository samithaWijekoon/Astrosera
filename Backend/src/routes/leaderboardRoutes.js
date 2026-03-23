const express = require('express');
const router = express.Router();
const User = require('../models/User');
const UserStats = require('../models/UserStats');
const mongoose = require('mongoose');

/**
 * GET /api/leaderboard
 * Returns top 10 users ranked by totalScore, with streak from UserStats.
 * Marks isUser when userId query param is supplied.
 */
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        // Validate userId is a proper ObjectId to avoid CastError
        const validUserId = userId && mongoose.isValidObjectId(userId) ? userId : null;

        // Fetch top 10 by score
        const topUsers = await User.find()
            .sort({ totalScore: -1 })
            .limit(10)
            .select('username avatarInitials totalScore _id');

        // Batch-fetch streaks from UserStats
        const userIds = topUsers.map(u => u._id.toString());
        const statsArr = await UserStats.find({ userId: { $in: userIds } })
            .select('userId currentStreak');
        const streakMap = {};
        statsArr.forEach(s => { streakMap[s.userId] = s.currentStreak; });

        const leaderboard = topUsers.map((u, i) => ({
            rank: i + 1,
            name: u.username || 'Unknown',
            avatar: u.avatarInitials || (u.username ? u.username.slice(0, 2).toUpperCase() : '??'),
            score: u.totalScore || 0,
            streak: streakMap[u._id.toString()] || 0,
            isUser: validUserId ? u._id.toString() === validUserId : false,
        }));

        // Optional: include current user rank even if not in top 10
        let currentUser = null;
        if (validUserId && !leaderboard.some(e => e.isUser)) {
            const me = await User.findById(validUserId).select('username avatarInitials totalScore _id');
            if (me) {
                const [myStats, higherCount] = await Promise.all([
                    UserStats.findOne({ userId: validUserId }).select('currentStreak'),
                    User.countDocuments({ totalScore: { $gt: me.totalScore || 0 } }),
                ]);

                currentUser = {
                    rank: higherCount + 1,
                    name: me.username || 'Unknown',
                    avatar: me.avatarInitials || (me.username ? me.username.slice(0, 2).toUpperCase() : '??'),
                    score: me.totalScore || 0,
                    streak: myStats?.currentStreak || 0,
                    isUser: true,
                };
            }
        }

        return res.json({
            success: true,
            leaderboard,
            currentUser,
        });
    } catch (err) {
        console.error('[GET /leaderboard]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;