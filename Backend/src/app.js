const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const gamificationRoutes = require('./routes/gamification');
const quizRoutes = require('./routes/quizRoutes');

require('dotenv').config();

connectDB();

const app = express();
app.use(express.json());

console.log('FRONTEND_URI:', process.env.FRONTEND_URI);

app.use(cors({
    origin: function (origin, callback) {
        const allowed = process.env.FRONTEND_URI;
        if (!origin) return callback(null, true);
        if (origin === allowed || origin === allowed + '/') return callback(null, true);
        console.error('CORS blocked:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use('/api/auth', authRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/', (req, res) => res.send('🚀 Astrosera API is running'));

module.exports = app;
