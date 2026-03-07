const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`⚠️  MongoDB not connected: ${error.message}`);
        console.error('   Some features (auth, analytics) may not work without MongoDB.');
    }
};

module.exports = connectDB;
