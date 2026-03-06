const express = require('express');
const router = express.Router();
const nasa = require('../services/nasaService');

// GET /api/asteroids/feed?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get('/feed', async (req, res, next) => {
  try {
    const { start, end } = req.query;
    const data = await nasa.getFeed(start, end);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/asteroids/upcoming?days=7
router.get('/upcoming', async (req, res, next) => {
  try {
    const days = Math.min(parseInt(req.query.days) || 7, 7); // NASA max 7 days
    const data = await nasa.getUpcoming(days);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/asteroids/browse?page=0&size=20
router.get('/browse', async (req, res, next) => {
  try {
    const { page, size } = req.query;
    const data = await nasa.browse(parseInt(page) || 0, parseInt(size) || 20);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// GET /api/asteroids/:id
router.get('/:id', async (req, res, next) => {
  try {
    const data = await nasa.getAsteroidById(req.params.id);
    res.json(data);
  } catch (err) {
    if (err.response?.status === 404) return res.status(404).json({ error: 'Asteroid not found' });
    next(err);
  }
});

module.exports = router;
