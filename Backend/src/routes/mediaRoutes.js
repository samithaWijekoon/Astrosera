const express = require('express');
const router = express.Router();
const { searchNasaMedia, resolveVideoUrl } = require('../services/nasaMedia');

/**
 * GET /api/media
 * Search NASA Image & Video Library.
 */
router.get('/', async (req, res) => {
    try {
        const q = req.query.q || 'space';
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const mediaType = req.query.media_type || '';

        const result = await searchNasaMedia(q, mediaType || null, page, 20);

        const items = result.items.map((item, idx) => ({
            id: idx + 1 + (page - 1) * 20,
            type: item.media_type,
            title: item.title,
            thumbnail: item.thumbnail,
            videoUrl: item.video_url || null,
            nasaId: item.nasa_id || null,
        }));

        res.json({
            items,
            total: result.total_hits,
            page,
        });
    } catch (err) {
        console.error('[Media] Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch media' });
    }
});

/**
 * GET /api/media/video/:nasaId
 * Resolve the actual mp4 URL for a NASA video.
 */
router.get('/video/:nasaId', async (req, res) => {
    try {
        const url = await resolveVideoUrl(req.params.nasaId);
        res.json({ videoUrl: url });
    } catch (err) {
        console.error('[Media] Video resolve error:', err.message);
        res.json({ videoUrl: null });
    }
});

module.exports = router;
