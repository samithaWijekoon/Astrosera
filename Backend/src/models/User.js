const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // --- NEW FIELDS FOR MEMBER 05 (Analytics) & MEMBER 04 (Quiz) ---
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student', // Everyone starts as a student
    },
    totalPoints: {
        type: Number,
        default: 0,
    },
    streakCount: {
        type: Number,
        default: 0,
    },
    lastQuizDate: {
        type: Date,
    }
}, {
    timestamps: true,
});

// Keep your existing password matching logic
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Keep your existing encryption logic
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;