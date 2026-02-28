const admin = (req, res, next) => {
    // req.user is populated by your protect middleware (which you'll use later)
    if (req.user && req.user.role === 'admin') {
        next(); // User is admin, proceed to the dashboard data
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { admin };