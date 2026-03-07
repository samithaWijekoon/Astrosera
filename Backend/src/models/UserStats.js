const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema(
    {
        badgeId: { type: String, required: true }, // e.g. 'cb1', 'mm2', 'td3'
        started: { type: Date, default: Date.now },
        ended: { type: Date },
        earned: { type: Boolean, default: false },
    },
    { _id: false } // No separate _id per badge subdoc
);

const userStatsSchema = new mongoose.Schema(
    {
        // ─── Identity ──────────────────────────────────────────────────────────
        userId: { type: String, required: true, unique: true },

        // ─── Streak / Interaction tracking ─────────────────────────────────────
        currentStreak: { type: Number, default: 0 },
        totalInteractionDays: { type: Number, default: 0 },
        lastInteractionDate: { type: Date, default: null },

        // ─── Quiz stats ─────────────────────────────────────────────────────────
        quizUnder2MinCount: { type: Number, default: 0 },
        consecutivePassCount: { type: Number, default: 0 },
        lastQuizScore: { type: Number, default: null },
        consecutiveSameScoreCount: { type: Number, default: 0 },
        consecutiveSameScoreDays: { type: Number, default: 0 },
        personalBestScore: { type: Number, default: 0 },
        hasGottenFullMarks: { type: Boolean, default: false },

        // ─── Badges ─────────────────────────────────────────────────────────────
        badges: { type: [badgeSchema], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model('UserStats', userStatsSchema);
