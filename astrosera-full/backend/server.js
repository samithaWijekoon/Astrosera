require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const rateLimit  = require('express-rate-limit');

const asteroidRoutes = require('./routes/asteroids');
const alertRoutes    = require('./routes/alerts');
const { startCron }  = require('./services/notificationService');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || '*' }));
app.use(express.json());

app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.get('/api/health', (_, res) => res.json({ status: 'ok', ts: new Date() }));
app.use('/api/asteroids', asteroidRoutes);
app.use('/api/alerts',    alertRoutes);

app.listen(PORT, () => {
  console.log(`🚀 AstroSera API → http://localhost:${PORT}`);
  console.log(`💾 JSON file DB (no MongoDB needed)`);
  startCron();
  console.log(`⏰ Alert cron started (every 30 min)`);
});
