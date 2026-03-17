const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, googleAuth, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/users', getAllUsers);
router.put('/profile', protect, updateProfile);

module.exports = router;
