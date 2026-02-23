// const express = require('express');
// const router = express.Router();
// const { processQuizGamification, getDashboardData } = require('../controllers/badgeController');

// // URL for React to fetch all profile data
// router.get('/dashboard/:userId', async (req, res) => {
//     const result = await getDashboardData(req.params.userId);
//     if (result.success) {
//         res.json(result);
//     } else {
//         res.status(400).json(result);
//     }
// });

// // URL for React to submit a finished quiz
// router.post('/finish-quiz', async (req, res) => {
//     const { userId, currentScore, maxPossibleScore, timeTakenSeconds, isPassed } = req.body;
//     const result = await processQuizGamification(userId, currentScore, maxPossibleScore, timeTakenSeconds, isPassed);
    
//     if (result.success) {
//         res.json({ success: true, badges: result.userBadges });
//     } else {
//         res.status(400).json({ success: false, error: result.error });
//     }
// });

// module.exports = router;