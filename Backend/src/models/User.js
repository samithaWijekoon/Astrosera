const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'student',
        },
        totalScore: { type: Number, default: 0 },
        avatarInitials: { type: String },
        streakCount: { type: Number, default: 0 },
        lastQuizDate: { type: Date },
    },
    { timestamps: true }
);

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    // Check if the stored password was hashed previously (starts with bcrypt's $2 identifier)
    if (this.password && this.password.startsWith('$2')) {
        return await bcrypt.compare(enteredPassword, this.password);
    }
    // Fallback for older users who have plain text passwords in the database
    return enteredPassword === this.password;
};

// Fixed Pre-save Middleware
userSchema.pre('save', async function () {
    // 1. Hash password if it is new or changed
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    // 2. Set initials for Member 04 Leaderboard if not present
    if (this.username && !this.avatarInitials) {
        this.avatarInitials = this.username.slice(0, 2).toUpperCase();
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;