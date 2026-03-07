const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analyticsController');
const { admin } = require('../middleware/adminMiddleware');
// Note: You might need to import your 'protect' middleware here once it's ready

router.get('/stats', admin, getDashboardStats);

module.exports = router;