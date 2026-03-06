const express = require('express');
const router = express.Router();
const db = require('../services/db');

// POST /api/alerts — subscribe to asteroid approach alert
router.post('/', (req, res) => {
  const { asteroidId, asteroidName, approachDate, isHazardous, userEmail } = req.body;
  if (!asteroidId || !userEmail || !approachDate) {
    return res.status(400).json({ error: 'asteroidId, approachDate, and userEmail are required.' });
  }
  const alert = db.create({
    asteroidId,
    asteroidName,
    approachDate,
    isHazardous: !!isHazardous,
    userEmail: userEmail.toLowerCase().trim(),
    notified: false,
    notifiedAt: null,
  });
  if (!alert) return res.status(409).json({ error: 'Already subscribed to this asteroid approach.' });
  res.status(201).json({ message: 'Alert set!', alert });
});

// GET /api/alerts?email=...
router.get('/', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email is required.' });
  const alerts = db.find({ userEmail: email.toLowerCase() })
    .sort((a, b) => new Date(a.approachDate) - new Date(b.approachDate));
  res.json({ alerts });
});

// GET /api/alerts/check/:asteroidId?email=...
router.get('/check/:asteroidId', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email is required.' });
  const alert = db.findOne({ asteroidId: req.params.asteroidId, userEmail: email.toLowerCase() });
  res.json({ subscribed: !!alert, alert });
});

// DELETE /api/alerts/:asteroidId
router.delete('/:asteroidId', (req, res) => {
  const { email } = req.body;
  const deleted = db.deleteOne({ asteroidId: req.params.asteroidId, userEmail: email?.toLowerCase() });
  if (!deleted) return res.status(404).json({ error: 'Alert not found.' });
  res.json({ message: 'Alert removed.' });
});

module.exports = router;
