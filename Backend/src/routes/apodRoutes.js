const express = require('express');
const router = express.Router();
const { getOrFetchApod } = require('../services/nasaApod');

/**
 * GET /api/apod
 * Get today's Astronomy Picture of the Day.
 */
router.get('/', async (req, res) => {
    try {
        const result = await getOrFetchApod();
        if (!result) {
            return res.status(503).json({
                error: 'Unable to fetch APOD. Please try again later.',
            });
        }

        res.json({
            title: result.title,
            date: result.date,
            url: result.url,
            hdurl: result.hdurl || null,
            explanation: result.explanation,
            media_type: result.media_type || 'image',
            copyright: result.copyright || null,
        });
    } catch (err) {
        console.error('[APOD] Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch APOD' });
    }
});

module.exports = router;
