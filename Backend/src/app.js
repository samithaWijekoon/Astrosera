const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URI,
    credentials: true
}));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send('🚀 Express server is running');
});

module.exports = app;
