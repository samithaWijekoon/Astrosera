const ScrapeMeta = require('../models/ScrapeMeta');
const { scrapeNasaFeeds } = require('./nasaScraper');

const NEWS_CACHE_DURATION = 3600 * 1000; // 1 hour in ms
let isRefreshing = false;

/**
 * Check if news is stale (>1 hour since last scrape) and re-scrape if needed.
 * Uses a simple boolean lock to prevent concurrent scrapes.
 */
async function refreshNewsIfStale() {
    if (isRefreshing) return 0;

    try {
        isRefreshing = true;

        const meta = await ScrapeMeta.findOne().sort({ lastScrapedAt: -1 });
        const staleThreshold = new Date(Date.now() - NEWS_CACHE_DURATION);

        if (meta && meta.lastScrapedAt && meta.lastScrapedAt > staleThreshold) {
            return 0; // Still fresh
        }

        return await scrapeNasaFeeds();
    } catch (err) {
        console.error('[NewsCache] Error refreshing:', err.message);
        return 0;
    } finally {
        isRefreshing = false;
    }
}

module.exports = { refreshNewsIfStale };
