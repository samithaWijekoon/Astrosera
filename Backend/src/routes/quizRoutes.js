const express = require('express');
const router = express.Router();
const { uploadQuizExcel } = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

// Ensure protect and admin are in this order
router.post('/upload', protect, admin, uploadQuizExcel);

module.exports = router;