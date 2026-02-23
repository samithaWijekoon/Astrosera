// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const userSchema = mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     email: {
//         type: String,
//         required: true,
//         unique: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
// }, {
//     timestamps: true,
// });

// // Match user entered password to hashed password in database
// userSchema.methods.matchPassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

// // Encrypt password using bcrypt
// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;






















// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: String,
//   email: String,
  
//   // Leaderboard & Profile
//   totalScore: { type: Number, default: 0 }, 
//   avatarInitials: { type: String, default: "U" },

//   // Calendar
//   activeDates: [{ type: Date }], // Stores every day they interact

//   // Combo Days
//   currentStreak: { type: Number, default: 0 },
//   streakStartDate: { type: Date, default: null },
//   lastQuizDate: { type: Date, default: null },

//   // Total Days
//   totalDaysInteracted: { type: Number, default: 0 },
//   lastInteractionDate: { type: Date, default: null },

//   // Mission Master
//   fastQuizCount: { type: Number, default: 0 }, 
//   currentPassStreak: { type: Number, default: 0 }, 
//   currentScoreStreak: { type: Number, default: 0 }, 
//   lastQuizMark: { type: Number, default: null }, 
//   highestQuizMark: { type: Number, default: 0 }, 

//   // Badges Array
//   unlockedBadges: [{
//     badgeId: String,       
//     badgeName: String,
//     dateStarted: Date,
//     dateUnlocked: Date
//   }]
// });

// module.exports = mongoose.model('User', userSchema);