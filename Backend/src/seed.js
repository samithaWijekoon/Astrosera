// require('dotenv').config();
// const mongoose = require('mongoose');
// const User = require('./models/User');

// const seedData = [
//   { username: "Orion K.", totalScore: 5000, currentStreak: 30, avatarInitials: "OK", unlockedBadges: [] },
//   { username: "Punarjee", totalScore: 4500, currentStreak: 15, avatarInitials: "P", 
//     unlockedBadges: [{ badgeId: "cb1", badgeName: "First Orbit", dateUnlocked: new Date() }] 
//   },
//   { username: "Nova S.", totalScore: 3000, currentStreak: 5, avatarInitials: "NS", unlockedBadges: [] }
// ];

// async function runSeed() {
//   await mongoose.connect(process.env.MONGO_URI);
//   await User.deleteMany({}); // Clears database
//   const users = await User.insertMany(seedData);
//   console.log("✅ Seeded!");
//   console.log("Your Test User ID:", users[1]._id); // Punarjee's ID
//   process.exit();
// }
// runSeed();