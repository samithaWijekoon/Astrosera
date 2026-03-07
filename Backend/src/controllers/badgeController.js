



// const User = require('../models/User');

// // --- 1. THE BADGE BLUEPRINTS ---
// const BADGE_BLUEPRINTS = {
//     combo: [
//         { id: "cb1", image: "/images/badges/cb1.png", name: "First Orbit", desc: "Complete your first combo day", color: "#a855f7" },
//         { id: "cb2", image: "/images/badges/cb1.png", name: "Stable Orbit", desc: "Maintain a 3-day combo streak", color: "#06b6d4" },
//         { id: "cb3", image: "/images/badges/cb1.png", name: "Week Warrior", desc: "Achieve a 7-day combo streak", color: "#8b5cf6" },
//         { id: "cb4", image: "/images/badges/cb1.png", name: "Rising Constellation", desc: "Hit a 14-day combo streak", color: "#eab308" },
//         { id: "cb5", image: "/images/badges/cb1.png", name: "Solar Pathfinder", desc: "Complete a full 30-day combo", color: "#10b981" }
//     ],
//     mission: [
//         { id: "mm1", image: "/images/badges/cb1.png", name: "Light Speed", desc: "Finish a quiz under 2 minutes for the first time.", color: "#10b981" },
//         { id: "mm2", image: "/images/badges/cb1.png", name: "Photon Mind", desc: "Finish quizzes under 2 minutes 3 times.", color: "#f59e0b" },
//         { id: "mm3", image: "/images/badges/cb1.png", name: "Nova Burst", desc: "Finish quizzes under 2 minutes 5 times.", color: "#6366f1" },
//         { id: "mm4", image: "/images/badges/cb1.png", name: "Solar Flare", desc: "Get full marks for the first time in a quiz.", color: "#84cc16" },
//         { id: "mm5", image: "/images/badges/cb1.png", name: "Mission Legend", desc: "Pass 5 times in quizzes without failing.", color: "#ec4899" },
//         { id: "mm6", image: "/images/badges/cb1.png", name: "Mission Commander", desc: "Pass 10 times in quizzes without failing.", color: "#84cc16" },
//         { id: "mm7", image: "/images/badges/cb1.png", name: "Boss Mission", desc: "Pass 20 times in quizzes without failing.", color: "#10b981" },
//         { id: "mm8", image: "/images/badges/cb1.png", name: "Stable Orbit", desc: "Get the same score 3 times in a row.", color: "#f59e0b" },
//         { id: "mm9", image: "/images/badges/cb1.png", name: "Twin Signal", desc: "Get the same score for 2 consecutive days.", color: "#6366f1" },
//         { id: "mm10", image: "/images/badges/cb1.png", name: "Supernova Growth", desc: "Get a new personal best in a quiz.", color: "#ec4899" }
//     ],
//     totalDays: [
//         { id: "td1", icon: "🌅", name: "Day One", desc: "Your first day on AstroSera", color: "#fb923c" },
//         { id: "td2", icon: "📅", name: "Week In", desc: "7 total days logged", color: "#22c55e" },
//         { id: "td3", icon: "🗓️", name: "Two Weeks", desc: "14 total days logged", color: "#06b6d4" },
//         { id: "td4", icon: "🏅", name: "30 Days Strong", desc: "30 total days logged", color: "#a855f7" },
//         { id: "td5", icon: "🎖️", name: "Centurion", desc: "100 total days logged", color: "#eab308" }
//     ]
// };

// function stripTime(date) {
//     if (!date) return 0;
//     return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
// }

// // --- 2. GET DASHBOARD DATA (For React Page Load) ---
// async function getDashboardData(loggedInUserId) {
//     try {
//         const user = await User.findById(loggedInUserId);
//         if (!user) throw new Error("User not found");

//         const topUsers = await User.find().sort({ totalScore: -1 }).limit(10);
//         const leaderboard = topUsers.map((u, index) => ({
//             rank: index + 1,
//             name: u.username || "Unknown Astro",
//             avatar: u.avatarInitials,
//             score: u.totalScore,
//             streak: u.currentStreak,
//             isUser: u._id.toString() === loggedInUserId
//         }));

//         const currentMonth = new Date().getMonth();
//         const currentYear = new Date().getFullYear();
//         const activeDaysThisMonth = user.activeDates
//             .filter(d => d.getMonth() === currentMonth && d.getFullYear() === currentYear)
//             .map(d => d.getDate());

//         return { 
//             success: true, 
//             userData: user,
//             blueprints: BADGE_BLUEPRINTS,
//             leaderboard: leaderboard,
//             activeDaysThisMonth: [...new Set(activeDaysThisMonth)]
//         };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// // --- 3. PROCESS QUIZ GAMIFICATION ---
// async function processQuizGamification(userId, currentScore, maxPossibleScore, timeTakenSeconds, isPassed) {
//     try {
//         const user = await User.findById(userId);
//         if (!user) throw new Error("User not found");

//         const today = new Date();
//         const todayStripped = stripTime(today);
//         const yesterdayStripped = todayStripped - (24 * 60 * 60 * 1000);

//         const unlockBadge = (badgeId, badgeName, startDate = null) => {
//             const alreadyHas = user.unlockedBadges.some(b => b.badgeId === badgeId);
//             if (!alreadyHas) {
//                 user.unlockedBadges.push({ badgeId, badgeName, dateStarted: startDate, dateUnlocked: today });
//             }
//         };

//         // Update score and active dates
//         user.totalScore += currentScore;
//         const hasPlayedToday = user.activeDates.some(d => stripTime(d) === todayStripped);
//         if (!hasPlayedToday) user.activeDates.push(today);

//         // 1. Total Days Logic
//         const lastInteractionStripped = stripTime(user.lastInteractionDate);
//         if (lastInteractionStripped !== todayStripped) {
//             user.totalDaysInteracted += 1;
//             user.lastInteractionDate = today;
//             if (user.totalDaysInteracted >= 1) unlockBadge("td1", "Day One");
//             if (user.totalDaysInteracted >= 7) unlockBadge("td2", "Week In");
//             if (user.totalDaysInteracted >= 14) unlockBadge("td3", "Two Weeks");
//             if (user.totalDaysInteracted >= 30) unlockBadge("td4", "30 Days Strong");
//             if (user.totalDaysInteracted >= 100) unlockBadge("td5", "Centurion");
//         }

//         // 2. Combo Days Logic
//         const lastQuizStripped = stripTime(user.lastQuizDate);
//         if (!user.lastQuizDate || lastQuizStripped < yesterdayStripped) {
//             user.currentStreak = 1;
//             user.streakStartDate = today;
//         } else if (lastQuizStripped === yesterdayStripped) {
//             user.currentStreak += 1;
//         }

//         if (user.currentStreak >= 1) unlockBadge("cb1", "First Orbit", user.streakStartDate);
//         if (user.currentStreak >= 3) unlockBadge("cb2", "Stable Orbit", user.streakStartDate);
//         if (user.currentStreak >= 7) unlockBadge("cb3", "Week Warrior", user.streakStartDate);
//         if (user.currentStreak >= 14) unlockBadge("cb4", "Rising Constellation", user.streakStartDate);
//         if (user.currentStreak >= 30) unlockBadge("cb5", "Solar Pathfinder", user.streakStartDate);

//         // 3. Mission Master Logic
//         if (timeTakenSeconds < 120) {
//             user.fastQuizCount += 1;
//             if (user.fastQuizCount >= 1) unlockBadge("mm1", "Light Speed");
//             if (user.fastQuizCount >= 3) unlockBadge("mm2", "Photon Mind");
//             if (user.fastQuizCount >= 5) unlockBadge("mm3", "Nova Burst");
//         }

//         if (currentScore === maxPossibleScore) unlockBadge("mm4", "Solar Flare");

//         if (isPassed) {
//             user.currentPassStreak += 1;
//             if (user.currentPassStreak >= 5) unlockBadge("mm5", "Mission Legend");
//             if (user.currentPassStreak >= 10) unlockBadge("mm6", "Mission Commander");
//             if (user.currentPassStreak >= 20) unlockBadge("mm7", "Boss Mission");
//         } else {
//             user.currentPassStreak = 0; 
//         }

//         if (user.lastQuizMark !== null && user.lastQuizMark === currentScore) {
//             user.currentScoreStreak += 1; 
//             if (user.currentScoreStreak >= 3) unlockBadge("mm8", "Stable Orbit");
//             if (lastQuizStripped === yesterdayStripped) unlockBadge("mm9", "Twin Signal");
//         } else {
//             user.currentScoreStreak = 1; 
//         }

//         if (user.lastQuizMark !== null && currentScore > user.highestQuizMark) {
//             unlockBadge("mm10", "Supernova Growth");
//         }
//         if (currentScore > user.highestQuizMark) user.highestQuizMark = currentScore;

//         user.lastQuizMark = currentScore;
//         user.lastQuizDate = today;

//         await user.save();
//         return { success: true, userBadges: user.unlockedBadges };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// module.exports = { processQuizGamification, getDashboardData };





























































// const User = require('../models/User');

// // --- 1. THE BADGE BLUEPRINTS ---
// // These are the "templates" sent to the frontend to show all possible badges
// const BADGE_BLUEPRINTS = {
//     combo: [
//         { id: "cb1", image: "/images/badges/cb1.png", name: "First Orbit", desc: "Complete your first combo day", color: "#a855f7" },
//         { id: "cb2", image: "/images/badges/cb1.png", name: "Stable Orbit", desc: "Maintain a 3-day combo streak", color: "#06b6d4" },
//         { id: "cb3", image: "/images/badges/cb1.png", name: "Week Warrior", desc: "Achieve a 7-day combo streak", color: "#8b5cf6" },
//         { id: "cb4", image: "/images/badges/cb1.png", name: "Rising Constellation", desc: "Hit a 14-day combo streak", color: "#eab308" },
//         { id: "cb5", image: "/images/badges/cb1.png", name: "Solar Pathfinder", desc: "Complete a full 30-day combo", color: "#10b981" }
//     ],
//     mission: [
//         { id: "mm1", image: "/images/badges/cb1.png", name: "Light Speed", desc: "Finish a quiz under 2 minutes for the first time.", color: "#10b981" },
//         { id: "mm2", image: "/images/badges/cb1.png", name: "Photon Mind", desc: "Finish quizzes under 2 minutes 3 times.", color: "#f59e0b" },
//         { id: "mm3", image: "/images/badges/cb1.png", name: "Nova Burst", desc: "Finish quizzes under 2 minutes 5 times.", color: "#6366f1" },
//         { id: "mm4", image: "/images/badges/cb1.png", name: "Solar Flare", desc: "Get full marks for the first time in a quiz.", color: "#84cc16" },
//         { id: "mm5", image: "/images/badges/cb1.png", name: "Mission Legend", desc: "Pass 5 times in quizzes without failing.", color: "#ec4899" },
//         { id: "mm6", image: "/images/badges/cb1.png", name: "Mission Commander", desc: "Pass 10 times in quizzes without failing.", color: "#84cc16" },
//         { id: "mm7", image: "/images/badges/cb1.png", name: "Boss Mission", desc: "Pass 20 times in quizzes without failing.", color: "#10b981" },
//         { id: "mm8", image: "/images/badges/cb1.png", name: "Stable Orbit", desc: "Get the same score 3 times in a row.", color: "#f59e0b" },
//         { id: "mm9", image: "/images/badges/cb1.png", name: "Twin Signal", desc: "Get the same score for 2 consecutive days.", color: "#6366f1" },
//         { id: "mm10", image: "/images/badges/cb1.png", name: "Supernova Growth", desc: "Get a new personal best in a quiz.", color: "#ec4899" }
//     ],
//     totalDays: [
//         { id: "td1", image: "/images/badges/cb1.png", name: "Comet Spark", desc: "1 week of interaction, first milestone.", color: "#fb923c" },
//         { id: "td2", image: "/images/badges/cb1.png", name: "Orbit Rookie", desc: "2 weeks, keeping the streak alive.", color: "#22c55e" },
//         { id: "td3", image: "/images/badges/cb1.png", name: "Star Voyager", desc: "1 month of daily visits.", color: "#06b6d4" },
//         { id: "td4", image: "/images/badges/cb1.png", name: "Cosmic Trailblazer", desc: "1.5 months, strong streak.", color: "#06b6d4" },
//         { id: "td5", image: "/images/badges/cb1.png", name: "Nebula Explorer", desc: "2 months, exploring consistently.", color: "#06b6d4" },
//         { id: "td6", image: "/images/badges/cb1.png", name: "Solar Navigator", desc: "3 months of daily dedication.", color: "#06b6d4" },
//         { id: "td7", image: "/images/badges/cb1.png", name: "Galaxy Runner", desc: " 4 months, streaking through the stars.", color: "#06b6d4" },
//         { id: "td8", image: "/images/badges/cb1.png", name: "Stellar Commander", desc: "Half a year, commanding the cosmos.", color: "#06b6d4" },
//         { id: "td9", image: "/images/badges/cb1.png", name: "Supernova Legend", desc: "9 months, shining brighter than ever.", color: "#06b6d4" },
//         { id: "td10", image: "/images/badges/cb1.png", name: "Celestial Immortal", desc: "1 year, ultimate streak master.", color: "#06b6d4" },


//     ]
// };

// /**
//  * Helper to normalize dates to midnight for easy comparison
//  */
// function stripTime(date) {
//     if (!date) return 0;
//     const d = new Date(date);
//     return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
// }

// // --- 2. GET DASHBOARD DATA ---
// // This function sends EVERYTHING to the frontend (User stats, Badge templates, and Leaderboard)
// async function getDashboardData(loggedInUserId) {
//     try {
//         const user = await User.findById(loggedInUserId);
//         if (!user) throw new Error("User not found");

//         const topUsers = await User.find().sort({ totalScore: -1 }).limit(10);
        
//         // Filter active days for the current month calendar
//         const currentMonth = new Date().getMonth();
//         const currentYear = new Date().getFullYear();
//         const activeDaysThisMonth = user.activeDates
//             .filter(d => d.getMonth() === currentMonth && d.getFullYear() === currentYear)
//             .map(d => d.getDate());

//         return { 
//             success: true, 
//             userData: user,
//             blueprints: BADGE_BLUEPRINTS, // Sends the "Grey" badge templates
//             leaderboard: topUsers.map((u, i) => ({
//                 rank: i + 1,
//                 name: u.username || "Unknown Astro",
//                 avatar: u.avatarInitials || "U",
//                 score: u.totalScore,
//                 streak: u.currentStreak,
//                 isUser: u._id.toString() === loggedInUserId
//             })),
//             activeDaysThisMonth: [...new Set(activeDaysThisMonth)]
//         };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// // --- 3. PROCESS QUIZ GAMIFICATION ---
// // This logic runs after a quiz is completed to calculate streaks and unlock badges
// async function processQuizGamification(userId, currentScore, maxPossibleScore, timeTakenSeconds, isPassed) {
//     try {
//         const user = await User.findById(userId);
//         if (!user) throw new Error("User not found");

//         const today = new Date();
//         const todayStripped = stripTime(today);
//         const yesterdayStripped = todayStripped - (24 * 60 * 60 * 1000);

//         const unlockBadge = (badgeId, badgeName, startDate = null) => {
//             const alreadyHas = user.unlockedBadges.some(b => b.badgeId === badgeId);
//             if (!alreadyHas) {
//                 user.unlockedBadges.push({ 
//                     badgeId, 
//                     badgeName, 
//                     dateStarted: startDate, 
//                     dateUnlocked: today 
//                 });
//             }
//         };

//         // Update score and active dates
//         user.totalScore += currentScore;
//         const hasPlayedToday = user.activeDates.some(d => stripTime(d) === todayStripped);
//         if (!hasPlayedToday) user.activeDates.push(today);

//         // 1. Total Days Logic
//         const lastInteractionStripped = stripTime(user.lastInteractionDate);
//         if (lastInteractionStripped !== todayStripped) {
//             user.totalDaysInteracted += 1;
//             user.lastInteractionDate = today;
            
//             if (user.totalDaysInteracted >= 1) unlockBadge("td1", "Day One");
//             if (user.totalDaysInteracted >= 7) unlockBadge("td2", "Week In");
//             if (user.totalDaysInteracted >= 14) unlockBadge("td3", "Two Weeks");
//             if (user.totalDaysInteracted >= 30) unlockBadge("td4", "30 Days Strong");
//             if (user.totalDaysInteracted >= 100) unlockBadge("td5", "Centurion");
//         }

//         // 2. Combo Days Logic (Streak)
//         const lastQuizStripped = stripTime(user.lastQuizDate);
//         if (!user.lastQuizDate || lastQuizStripped < yesterdayStripped) {
//             user.currentStreak = 1;
//             user.streakStartDate = today;
//         } else if (lastQuizStripped === yesterdayStripped) {
//             user.currentStreak += 1;
//         }

//         if (user.currentStreak >= 1) unlockBadge("cb1", "First Orbit", user.streakStartDate);
//         if (user.currentStreak >= 3) unlockBadge("cb2", "Stable Orbit", user.streakStartDate);
//         if (user.currentStreak >= 7) unlockBadge("cb3", "Week Warrior", user.streakStartDate);
//         if (user.currentStreak >= 14) unlockBadge("cb4", "Rising Constellation", user.streakStartDate);
//         if (user.currentStreak >= 30) unlockBadge("cb5", "Solar Pathfinder", user.streakStartDate);

//         // 3. Mission Master Logic
//         // Speed Badges
//         if (timeTakenSeconds < 120) {
//             user.fastQuizCount += 1;
//             if (user.fastQuizCount >= 1) unlockBadge("mm1", "Light Speed");
//             if (user.fastQuizCount >= 3) unlockBadge("mm2", "Photon Mind");
//             if (user.fastQuizCount >= 5) unlockBadge("mm3", "Nova Burst");
//         }

//         // Perfect Score
//         if (currentScore === maxPossibleScore) unlockBadge("mm4", "Solar Flare");

//         // Passing Streaks
//         if (isPassed) {
//             user.currentPassStreak += 1;
//             if (user.currentPassStreak >= 5) unlockBadge("mm5", "Mission Legend");
//             if (user.currentPassStreak >= 10) unlockBadge("mm6", "Mission Commander");
//             if (user.currentPassStreak >= 20) unlockBadge("mm7", "Boss Mission");
//         } else {
//             user.currentPassStreak = 0; 
//         }

//         // Consistent Scores
//         if (user.lastQuizMark !== null && user.lastQuizMark === currentScore) {
//             user.currentScoreStreak += 1; 
//             if (user.currentScoreStreak >= 3) unlockBadge("mm8", "Stable Orbit");
//             if (lastQuizStripped === yesterdayStripped) unlockBadge("mm9", "Twin Signal");
//         } else {
//             user.currentScoreStreak = 1; 
//         }

//         // Personal Bests
//         if (user.lastQuizMark !== null && currentScore > user.highestQuizMark) {
//             unlockBadge("mm10", "Supernova Growth");
//         }
//         if (currentScore > user.highestQuizMark) user.highestQuizMark = currentScore;

//         user.lastQuizMark = currentScore;
//         user.lastQuizDate = today;

//         await user.save();
//         return { success: true, userBadges: user.unlockedBadges };
//     } catch (error) {
//         return { success: false, error: error.message };
//     }
// }

// module.exports = { processQuizGamification, getDashboardData };