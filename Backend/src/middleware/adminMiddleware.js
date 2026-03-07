const admin = (req, res, next) => {
    // Check if user exists and if the role is 'admin'
    if (req.user && req.user.role === 'admin') {
        next(); // You are an admin, proceed to upload
    } else {
        // This is the error you are seeing
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { admin };