const express = require('express');
const router = express.Router();
const Article = require('../models/Article');
const { refreshNewsIfStale } = require('../services/newsCache');

/**
 * GET /api/news/trending
 * Fetch exactly the 3 current trending articles.
 */
router.get('/trending', async (req, res) => {
    try {
        const articles = await Article.find({ trending: true })
            .sort({ date: -1, _id: -1 })
            .limit(3)
            .lean();

        const items = articles.map(a => ({
            id: a._id,
            title: a.title,
            summary: a.summary || '',
            fullContent: a.fullContent || a.summary || '',
            source: a.source || 'NASA',
            date: a.date || '',
            category: a.category || 'missions',
            image: a.imageUrl || '',
            url: a.url || '',
            readingTime: a.readingTime || 3,
            trending: a.trending || false,
        }));

        res.json(items);
    } catch (err) {
        console.error('[News] Error fetching trending:', err.message);
        res.status(500).json({ error: 'Failed to fetch trending news' });
    }
});

/**
 * GET /api/news
 * Paginated news feed with category filtering, sorting, and search.
 */
router.get('/', async (req, res) => {
    try {
        // Trigger background refresh if stale (fire-and-forget)
        refreshNewsIfStale().catch(err =>
            console.error('[News] Background refresh error:', err.message)
        );

        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 6));
        const category = req.query.category || 'all';
        const sort = req.query.sort || 'date';
        const search = (req.query.search || '').trim();

        // Build query filter
        const filter = {};

        if (category && category !== 'all') {
            filter.category = category;
        }

        if (search) {
            if (search.length < 3) {
                return res.json({
                    articles: [],
                    total: 0,
                    page,
                    limit,
                    hasMore: false,
                });
            }
            const regex = new RegExp(search, 'i');
            filter.$or = [
                { title: regex },
                { summary: regex },
                { source: regex },
            ];
        }

        // Sorting
        let sortObj;
        if (sort === 'date') {
            sortObj = { date: -1, _id: -1 };
        } else {
            // Relevance: trending first, then by date
            sortObj = { trending: -1, date: -1, _id: -1 };
        }

        const total = await Article.countDocuments(filter);
        const offset = (page - 1) * limit;
        const articles = await Article.find(filter)
            .sort(sortObj)
            .skip(offset)
            .limit(limit)
            .lean();

        const items = articles.map(a => ({
            id: a._id,
            title: a.title,
            summary: a.summary || '',
            fullContent: a.fullContent || a.summary || '',
            source: a.source || 'NASA',
            date: a.date || '',
            category: a.category || 'missions',
            image: a.imageUrl || '',
            url: a.url || '',
            readingTime: a.readingTime || 3,
            trending: a.trending || false,
        }));

        res.json({
            articles: items,
            total,
            page,
            limit,
            hasMore: (offset + limit) < total,
        });
    } catch (err) {
        console.error('[News] Error fetching news:', err.message);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
});

module.exports = router;
