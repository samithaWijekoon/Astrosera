require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const rateLimit = require('express-rate-limit');
const asteroidsRouter = require('./routes/asteroids');
const alertsRouter    = require('./routes/alerts');
const { startCronJob } = require('./services/notificationService');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 150 }));

app.use('/api/asteroids', asteroidsRouter);
app.use('/api/alerts',    alertsRouter);
app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Asteroid Tracker API → http://localhost:${PORT}`);
  console.log(`💾 JSON file DB (no MongoDB needed)`);
  startCronJob();
});
