const express = require('express');
const router = express.Router();
const UserStats = require('../models/UserStats');
const User = require('../models/User');

// ─── Static badge blueprints (UI metadata only — earned state comes from DB) ──
const BADGE_BLUEPRINTS = {
    combo: [
        { id: 'cb1', image: '/images/badges/cb1.png', name: 'Stable Orbit', desc: 'Keep going, 3-day streak achieved.', color: '#a855f7' },
        { id: 'cb2', image: '/images/badges/cb1.png', name: 'Twin Stars', desc: 'Steady streak, 6 days strong.', color: '#06b6d4' },
        { id: 'cb3', image: '/images/badges/cb1.png', name: 'Rising Constellation', desc: '9 days of consistency shining bright.', color: '#8b5cf6' },
        { id: 'cb4', image: '/images/badges/cb1.png', name: 'Solar Pathfinder', desc: '12 days streak, blazing your path.', color: '#eab308' },
        { id: 'cb5', image: '/images/badges/cb1.png', name: 'Galaxy Runner', desc: '15 days streak, reaching new heights.', color: '#eab308' },
        { id: 'cb6', image: '/images/badges/cb1.png', name: 'Nebula Voyager', desc: '18 days streak, exploring further.', color: '#f97316' },
        { id: 'cb7', image: '/images/badges/cb1.png', name: 'Orbit Master', desc: '21 days streak, mastery in progress.', color: '#eab308' },
        { id: 'cb8', image: '/images/badges/cb1.png', name: 'Cosmic Titan', desc: '24 days streak, strong and unstoppable.', color: '#eab308' },
        { id: 'cb9', image: '/images/badges/cb1.png', name: 'Supernova Force', desc: '27 days streak, bursting with power.', color: '#eab308' },
        { id: 'cb10', image: '/images/badges/cb1.png', name: 'Galactic Legend', desc: '30 days streak, ultimate achievement.', color: '#eab308' },
    ],
    mission: [
        { id: 'mm1', image: '/images/badges/cb1.png', name: 'Light Speed', desc: 'Finish a quiz under 2 minutes for the first time.', color: '#10b981' },
        { id: 'mm2', image: '/images/badges/cb1.png', name: 'Photon Mind', desc: 'Finish quizzes under 2 minutes 3 times.', color: '#f59e0b' },
        { id: 'mm3', image: '/images/badges/cb1.png', name: 'Nova Burst', desc: 'Finish quizzes under 2 minutes 5 times.', color: '#6366f1' },
        { id: 'mm4', image: '/images/badges/cb1.png', name: 'Solar Flare', desc: 'Get full marks for the first time in a quiz.', color: '#84cc16' },
        { id: 'mm5', image: '/images/badges/cb1.png', name: 'Mission Legend', desc: 'Pass 5 times in quizzes without failing.', color: '#ec4899' },
        { id: 'mm6', image: '/images/badges/cb1.png', name: 'Mission Commander', desc: 'Pass 10 times in quizzes without failing.', color: '#84cc16' },
        { id: 'mm7', image: '/images/badges/cb1.png', name: 'Boss Mission', desc: 'Pass 20 times in quizzes without failing.', color: '#10b981' },
        { id: 'mm8', image: '/images/badges/cb1.png', name: 'Stable Signal', desc: 'Get the same score 3 times in a row.', color: '#f59e0b' },
        { id: 'mm9', image: '/images/badges/cb1.png', name: 'Twin Signal', desc: 'Get the same score for 2 consecutive days.', color: '#6366f1' },
        { id: 'mm10', image: '/images/badges/cb1.png', name: 'Supernova Growth', desc: 'Get a new personal best in a quiz.', color: '#ec4899' },
    ],
    totalDays: [
        { id: 'td1', image: '/images/badges/cb1.png', name: 'Comet Spark', desc: '1 week of interaction, first milestone.', color: '#fb923c' },
        { id: 'td2', image: '/images/badges/cb1.png', name: 'Orbit Rookie', desc: '2 weeks, keeping the streak alive.', color: '#22c55e' },
        { id: 'td3', image: '/images/badges/cb1.png', name: 'Star Voyager', desc: '1 month of daily visits.', color: '#06b6d4' },
        { id: 'td4', image: '/images/badges/cb1.png', name: 'Cosmic Trailblazer', desc: '1.5 months, strong streak.', color: '#06b6d4' },
        { id: 'td5', image: '/images/badges/cb1.png', name: 'Nebula Explorer', desc: '2 months, exploring consistently.', color: '#a855f7' },
        { id: 'td6', image: '/images/badges/cb1.png', name: 'Solar Navigator', desc: '3 months of daily dedication.', color: '#eab308' },
        { id: 'td7', image: '/images/badges/cb1.png', name: 'Galaxy Runner', desc: '4 months, streaking through the stars.', color: '#ec4899' },
        { id: 'td8', image: '/images/badges/cb1.png', name: 'Stellar Commander', desc: 'Half a year, commanding the cosmos.', color: '#10b981' },
        { id: 'td9', image: '/images/badges/cb1.png', name: 'Supernova Legend', desc: '9 months, shining brighter than ever.', color: '#f59e0b' },
        { id: 'td10', image: '/images/badges/cb1.png', name: 'Celestial Immortal', desc: '1 year, ultimate streak master.', color: '#84cc16' },
    ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toMidnightUTC(date) {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

function dayDiff(a, b) {
    return Math.round((a - b) / 86_400_000);
}

function fmt(date) {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * GET /api/gamification/dashboard/:userId
 * One-shot endpoint: returns user profile, badges (merged with blueprints),
 * leaderboard, and calendar active days for the current month.
 */
router.get('/dashboard/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const [user, stats, topUsers] = await Promise.all([
            User.findById(userId).select('username avatarInitials totalScore activeDates'),
            UserStats.findOne({ userId }),
            User.find().sort({ totalScore: -1 }).limit(10).select('username avatarInitials totalScore _id'),
        ]);

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Leaderboard
        const statsArr = await UserStats.find({
            userId: { $in: topUsers.map(u => u._id.toString()) }
        }).select('userId currentStreak');
        const streakMap = {};
        statsArr.forEach(s => { streakMap[s.userId] = s.currentStreak; });

        const leaderboard = topUsers.map((u, i) => ({
            rank: i + 1,
            name: u.username || 'Unknown',
            avatar: u.avatarInitials || u.username.slice(0, 2).toUpperCase(),
            score: u.totalScore,
            streak: streakMap[u._id.toString()] || 0,
            isUser: u._id.toString() === userId,
        }));

        // Calendar – active day numbers for current month
        const now = new Date();
        const mon = now.getMonth();
        const yr = now.getFullYear();
        const activeDaysThisMonth = [
            ...new Set(
                (user.activeDates || [])
                    .filter(d => d.getMonth() === mon && d.getFullYear() === yr)
                    .map(d => d.getDate())
            )
        ];

        // Badge merge: blueprint + DB earned status
        const earnedMap = {};
        (stats?.badges || []).forEach(b => {
            if (b.earned) earnedMap[b.badgeId] = b;
        });

        const merge = (blueprints) => blueprints.map(t => {
            const e = earnedMap[t.id];
            return e
                ? { ...t, earned: true, started: fmt(e.started), ended: fmt(e.ended) }
                : { ...t, earned: false, started: '—', ended: '—' };
        });

        const categories = [
            { title: 'Combo Badges', badges: merge(BADGE_BLUEPRINTS.combo) },
            { title: 'Mission Master', badges: merge(BADGE_BLUEPRINTS.mission) },
            { title: 'Total Days', badges: merge(BADGE_BLUEPRINTS.totalDays) },
        ];

        return res.json({
            success: true,
            user: {
                _id: user._id,
                username: user.username,
                avatarInitials: user.avatarInitials,
                totalScore: user.totalScore,
                currentStreak: stats?.currentStreak || 0,
                totalInteractionDays: stats?.totalInteractionDays || 0,
                personalBestScore: stats?.personalBestScore || 0,
            },
            categories,
            leaderboard,
            activeDaysThisMonth,
        });
    } catch (err) {
        console.error('[GET /dashboard]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /api/gamification/my-badges/:userId
 * Returns raw badges array from DB.
 */
router.get('/my-badges/:userId', async (req, res) => {
    try {
        const stats = await UserStats.findOne({ userId: req.params.userId });
        return res.json({ badges: stats ? stats.badges : [] });
    } catch (err) {
        console.error('[GET /my-badges]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * POST /api/gamification/record-interaction
 * Body: { userId, isQuiz, quizScore, timeTakenMs, fullMarks }
 * Also adds score to User.totalScore and records the active date.
 */
router.post('/record-interaction', async (req, res) => {
    try {
        const { userId, isQuiz, quizScore, timeTakenMs, fullMarks } = req.body;
        if (!userId) return res.status(400).json({ error: 'userId is required' });

        let stats = await UserStats.findOne({ userId });
        if (!stats) stats = new UserStats({ userId });

        const today = toMidnightUTC(new Date());

        // ── Streak & interaction-day logic ────────────────────────────────────
        let isNewDay = false;

        if (!stats.lastInteractionDate) {
            isNewDay = true;
            stats.totalInteractionDays = 1;
            stats.currentStreak = 1;
        } else {
            const lastDay = toMidnightUTC(stats.lastInteractionDate);
            const diff = dayDiff(today, lastDay);
            if (diff === 0) {
                isNewDay = false;
            } else if (diff === 1) {
                isNewDay = true;
                stats.totalInteractionDays += 1;
                stats.currentStreak += 1;
            } else {
                isNewDay = true;
                stats.totalInteractionDays += 1;
                stats.currentStreak = 1;
            }
        }

        stats.lastInteractionDate = today;

        // ── Quiz stats ────────────────────────────────────────────────────────
        let achievedNewPB = false;

        if (isQuiz) {
            if (timeTakenMs < 120_000) stats.quizUnder2MinCount += 1;
            if (fullMarks === true) stats.hasGottenFullMarks = true;

            if (quizScore >= 50) {
                stats.consecutivePassCount += 1;
            } else {
                stats.consecutivePassCount = 0;
            }

            if (quizScore === stats.lastQuizScore) {
                stats.consecutiveSameScoreCount += 1;
                if (isNewDay) stats.consecutiveSameScoreDays += 1;
            } else {
                stats.consecutiveSameScoreCount = 1;
                stats.consecutiveSameScoreDays = 1;
            }

            if (quizScore > stats.personalBestScore) {
                stats.personalBestScore = quizScore;
                achievedNewPB = true;
            }

            stats.lastQuizScore = quizScore;
        }

        // ── Badge evaluation ──────────────────────────────────────────────────
        evaluateBadges(stats, achievedNewPB);

        // ── Persist + update User.totalScore & activeDates ────────────────────
        await stats.save();

        if (isQuiz && quizScore) {
            await User.findByIdAndUpdate(userId, {
                $inc: { totalScore: quizScore },
                $set: { streakCount: stats.currentStreak },
                ...(isNewDay ? { $push: { activeDates: today } } : {}),
            });
        } else if (isNewDay) {
            // Non-quiz interaction still counts as an active day
            await User.findByIdAndUpdate(userId, {
                $set: { streakCount: stats.currentStreak },
                $push: { activeDates: today },
            });
        }

        return res.json({ success: true, stats });
    } catch (err) {
        console.error('[POST /record-interaction]', err);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// ─── Badge Evaluation ─────────────────────────────────────────────────────────

function evaluateBadges(stats, achievedNewPB) {
    function awardBadge(badgeId) {
        const existing = stats.badges.find(b => b.badgeId === badgeId);
        if (!existing) {
            stats.badges.push({ badgeId, started: new Date(), ended: new Date(), earned: true });
        } else if (!existing.earned) {
            existing.earned = true;
            existing.ended = new Date();
        }
    }

    // Combo badges (cb1–cb10): streak milestones 3,6,9,12,15,18,21,24,27,30
    [3, 6, 9, 12, 15, 18, 21, 24, 27, 30].forEach((m, i) => {
        if (stats.currentStreak >= m) awardBadge(`cb${i + 1}`);
    });

    // Total days badges (td1–td10): day milestones 7,14,30,45,60,90,120,180,270,365
    [7, 14, 30, 45, 60, 90, 120, 180, 270, 365].forEach((m, i) => {
        if (stats.totalInteractionDays >= m) awardBadge(`td${i + 1}`);
    });

    // Mission badges
    if (stats.quizUnder2MinCount >= 1) awardBadge('mm1');
    if (stats.quizUnder2MinCount >= 3) awardBadge('mm2');
    if (stats.quizUnder2MinCount >= 5) awardBadge('mm3');
    if (stats.hasGottenFullMarks) awardBadge('mm4');
    if (stats.consecutivePassCount >= 5) awardBadge('mm5');
    if (stats.consecutivePassCount >= 10) awardBadge('mm6');
    if (stats.consecutivePassCount >= 20) awardBadge('mm7');
    if (stats.consecutiveSameScoreCount >= 3) awardBadge('mm8');
    if (stats.consecutiveSameScoreDays >= 2) awardBadge('mm9');
    if (achievedNewPB) awardBadge('mm10');
}

module.exports = router;