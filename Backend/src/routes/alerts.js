const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const db      = require('../services/db');

router.get('/', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email required' });
  res.json(db.getByEmail(email));
});

router.get('/check/:asteroidId', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email required' });
  const alert = db.findOne({ asteroidId: req.params.asteroidId, email });
  res.json({ subscribed: !!alert, alert: alert || null });
});

router.post('/', (req, res) => {
  const { email, asteroidId, asteroidName, approachDate, missDistKm } = req.body;
  if (!email || !asteroidId) return res.status(400).json({ error: 'email and asteroidId required' });
  const existing = db.findOne({ asteroidId, email });
  if (existing) return res.json(existing);
  const doc = { id: uuidv4(), email, asteroidId, asteroidName, approachDate, missDistKm, status: 'WATCHING', createdAt: new Date().toISOString() };
  db.insert(doc);
  res.status(201).json(doc);
});

router.delete('/:asteroidId', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  db.remove({ asteroidId: req.params.asteroidId, email });
  res.json({ success: true });
});

module.exports = router;
