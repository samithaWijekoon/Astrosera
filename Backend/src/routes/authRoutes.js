const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyOtp, resendOtp, getAllUsers, googleAuth, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', registerUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/users', getAllUsers);
router.put('/profile', protect, updateProfile);

module.exports = router;
