const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        // Leaderboard & profile
        totalScore: { type: Number, default: 0 },
        avatarInitials: { type: String, default: 'U' },
        // Calendar – every unique day the user interacts
        activeDates: [{ type: Date }],
    },
    { timestamps: true }
);

userSchema.methods.matchPassword = async function (entered) {
    return await bcrypt.compare(entered, this.password);
};

userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    // Auto-set avatar initials from username if not set
    if (this.username && this.avatarInitials === 'U') {
        this.avatarInitials = this.username.slice(0, 2).toUpperCase();
    }
});

module.exports = mongoose.model('User', userSchema);