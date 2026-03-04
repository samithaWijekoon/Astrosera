const express = require('express');
const router = express.Router();
// Import the logic from the controller
const { uploadQuizExcel, getQuizzes, clearQuizzes } = require('../controllers/quizController');
// Import security middlewares
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Path: POST /api/quiz/upload
router.post('/upload', protect, admin, uploadQuizExcel);

// Path: GET /api/quiz
router.get('/', protect, getQuizzes);

// Path: DELETE /api/quiz/clear
router.delete('/clear', protect, admin, clearQuizzes);

module.exports = router;