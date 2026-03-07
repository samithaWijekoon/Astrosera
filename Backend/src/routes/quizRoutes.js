const express = require('express');
const router = express.Router();
// Import the logic from the controller
const { uploadQuizExcel, getQuizzes, clearQuizzes } = require('../controllers/quizController');
// Import security middlewares
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Path: POST /api/quiz/upload
// Used by Member 05 to upload the test 01 Astrosera.xlsx file
router.post('/upload', protect, admin, uploadQuizExcel);

// Path: GET /api/quiz
// Used to fetch all 100 questions for the Analytics Dashboard
router.get('/', protect, getQuizzes);

// Path: DELETE /api/quiz/clear
// Used to wipe the database if you need to re-upload the Excel sheet
router.delete('/clear', protect, admin, clearQuizzes);

module.exports = router;