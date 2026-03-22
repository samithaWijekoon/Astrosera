const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const gamificationRoutes = require('./routes/gamification');
const analyticsRoutes = require('./routes/analyticsRoutes');
const quizRoutes = require('./routes/quizRoutes');
const fileUpload = require('express-fileupload');
require('dotenv').config();

// Initialize Database
connectDB();

const app = express();

// 1. CORS CONFIGURATION
app.use(cors({
    origin: function (origin, callback) {
        const allowedOrigins = [
            process.env.FRONTEND_URI,
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:5174",
            "http://127.0.0.1:5174"
        ].filter(Boolean);
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. PARSERS & FILE HANDLING
app.use(express.json());
app.use(fileUpload());

// 3. DEBUGGING LOGS
console.log("FRONTEND_URI defined as:", process.env.FRONTEND_URI);

// 4. ROUTE MIDDLEWARES
app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/quiz', quizRoutes);

// --- THE FIX ---
// Since she doesn't have a separate file, her frontend likely calls /api/achievements.
// We map that URL to her gamificationRoutes file.
app.use('/api/achievements', gamificationRoutes);

app.get('/', (req, res) => {
    res.send('🚀 Astrosera API is running with Analytics & Gamification');
});

module.exports = app;