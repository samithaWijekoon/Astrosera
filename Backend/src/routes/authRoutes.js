const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers, googleAuth } = require('../controllers/authController');

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/users', getAllUsers);

module.exports = router;
