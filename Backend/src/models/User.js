const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: {
            type: String,
            required: true,
            validate: {
                validator: function (v) {
                    // Skip validation if it's an already hashed password
                    if (v && v.startsWith('$2')) return true;
                    return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(v);
                },
                message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one number, and one special character.'
            }
        },
        role: {
            type: String,
            enum: ['student', 'admin'],
            default: 'student',
        },
        totalScore: { type: Number, default: 0 },
        avatarInitials: { type: String },
        streakCount: { type: Number, default: 0 },
        lastQuizDate: { type: Date },
        // --- UNION MERGE: Keeping both sets of fields ---
        activeDates: { type: [Date], default: [] }, // From Friend
        isVerified: { type: Boolean, default: false }, // From Main
        otpCode: { type: String, default: null },      // From Main
    },
    { timestamps: true }
);

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    if (this.password && this.password.startsWith('$2')) {
        return await bcrypt.compare(enteredPassword, this.password);
    }
    return enteredPassword === this.password;
};

// Fixed Pre-save Middleware
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10);
            this.password = await bcrypt.hash(this.password, salt);
        } catch (error) {
            return next(error);
        }
    }

    if (this.username && !this.avatarInitials) {
        this.avatarInitials = this.username.slice(0, 2).toUpperCase();
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;