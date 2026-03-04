const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes'); // Added for Member 05
require('dotenv').config();
const fileUpload = require('express-fileupload');
const quizRoutes = require('./routes/quizRoutes');


connectDB();

const app = express();
app.use(express.json());

console.log("FRONTEND_URI:", process.env.FRONTEND_URI);

app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigin = process.env.FRONTEND_URI;
        console.log("Request Origin:", origin, "| Allowed Origin:", allowedOrigin);

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (origin === allowedOrigin || origin === allowedOrigin + '/') {
            return callback(null, true);
        } else {
            console.error("CORS Error: Origin not allowed");
            return callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Route Middlewares
app.use('/api/quiz', quizRoutes);
app.use(fileUpload());
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes); // Added for Member 05

app.get('/', (req, res) => {
    res.send('🚀 Express server is running');
});

module.exports = app;