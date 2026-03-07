const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        
        // --- MEMBER 05 (Role & Permissions) ---
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'student',
        },

        // --- GAMIFICATION & LEADERBOARD (Member 01/02) ---
        totalScore: { type: Number, default: 0 },
        totalPoints: { type: Number, default: 0 }, // Synced both naming styles
        avatarInitials: { type: String, default: 'U' },
        activeDates: [{ type: Date }],
        
        // --- ANALYTICS (Member 05) ---
        streakCount: { type: Number, default: 0 },
        lastQuizDate: { type: Date },
    },
    { timestamps: true }
);

// Password verification method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encryption and Avatar Logic before saving
userSchema.pre('save', async function (next) {
    // 1. Only hash the password if it's new or modified
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    // 2. Auto-set avatar initials from username if still default
    if (this.username && (this.avatarInitials === 'U' || !this.avatarInitials)) {
        this.avatarInitials = this.username.slice(0, 2).toUpperCase();
    }
    
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;