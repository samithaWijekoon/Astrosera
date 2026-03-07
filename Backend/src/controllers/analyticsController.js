const User = require('../models/User');

// @desc    Get all stats for dashboard
// @route   GET /api/analytics/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: 'student' });
        const totalAdmins = await User.countDocuments({ role: 'admin' });

        // We can add more stats here later (like total quiz attempts)
        res.json({
            success: true,
            stats: {
                totalUsers,
                totalAdmins,
                totalAccounts: totalUsers + totalAdmins
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error fetching stats' });
    }
};

module.exports = { getDashboardStats };