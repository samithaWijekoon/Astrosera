const express = require('express');
const router  = express.Router();
const nasa    = require('../services/nasaService');

router.get('/feed', async (req, res) => {
  try {
    const { start, end } = req.query;
    const data = await nasa.getFeed(start, end);
    res.json(data);
  } catch (err) {
    const status = err.response?.status === 429 ? 429 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const data = await nasa.getUpcoming(days);
    res.json(data);
  } catch (err) {
    const status = err.response?.status === 429 ? 429 : 500;
    res.status(status).json({ error: err.message });
  }
});

router.get('/browse', async (req, res) => {
  try {
    const { page = 0, size = 20 } = req.query;
    const data = await nasa.browse(parseInt(page), parseInt(size));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await nasa.getAsteroidById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
