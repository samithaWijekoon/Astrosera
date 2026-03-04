const express = require('express');
const router = express.Router();
const { uploadQuizExcel } = require('../controllers/quizController');
const { admin } = require('../middleware/adminMiddleware');
// You will need your protect middleware here as well to verify the token
// const { protect } = require('../middleware/authMiddleware'); 

// The route: POST /api/quiz/upload
router.post('/upload', admin, uploadQuizExcel);

module.exports = router;