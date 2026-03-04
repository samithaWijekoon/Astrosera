const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const quizRoutes = require('./routes/quizRoutes');
const fileUpload = require('express-fileupload');
require('dotenv').config();

connectDB();

const app = express();

// 1. CORS MUST BE FIRST
app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 2. Parsers
app.use(express.json());
app.use(fileUpload()); // Moved above routes to fix Excel upload

// 3. Debugging logs
console.log("FRONTEND_URI defined as:", process.env.FRONTEND_URI);

// 4. Route Middlewares
app.use('/api/auth', authRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/', (req, res) => {
    res.send('🚀 Express server is running');
});

module.exports = app;