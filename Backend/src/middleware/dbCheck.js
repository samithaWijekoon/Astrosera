const mongoose = require('mongoose');

const requireDB = (req, res, next) => {
    // readyState 1 means connected
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({ error: "Database unavailable" });
    }
    next();
};

module.exports = requireDB;
