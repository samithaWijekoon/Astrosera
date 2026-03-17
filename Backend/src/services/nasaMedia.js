const axios = require('axios');

const NASA_IMAGES_API_URL = 'https://images-api.nasa.gov';

// In-memory cache with TTL
const mediaCache = {};
const CACHE_TTL = 3600 * 1000; // 1 hour in ms

/**
 * Search NASA Image & Video Library.
 */
async function searchNasaMedia(query = 'space', mediaType = null, page = 1, pageSize = 20) {
    // Rotate default query for variety
    if (query.trim().toLowerCase() === 'space') {
        const dailyKeywords = ['nebula', 'galaxy', 'supernova', 'james webb', 'aurora', 'black hole', 'exoplanet', 'milky way', 'hubble'];
        const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        query = dailyKeywords[dayOfYear % dailyKeywords.length];
    }

    const cacheKey = `${query}_${mediaType}_${page}_${pageSize}`;
    const now = Date.now();

    // Return from cache if valid
    if (mediaCache[cacheKey] && (now - mediaCache[cacheKey].timestamp) < CACHE_TTL) {
        return mediaCache[cacheKey].data;
    }

    const params = { q: query, page, page_size: pageSize };
    if (mediaType && ['image', 'video'].includes(mediaType)) {
        params.media_type = mediaType;
    }

    try {
        const resp = await axios.get(`${NASA_IMAGES_API_URL}/search`, { params, timeout: 15000 });
        const collection = resp.data.collection || {};
        const rawItems = collection.items || [];
        const totalHits = (collection.metadata || {}).total_hits || 0;

        const items = rawItems.map((item, idx) => {
            const itemData = (item.data && item.data[0]) || {};
            const links = item.links || [];

            let thumbnail = '';
            for (const link of links) {
                if (link.rel === 'preview') {
                    thumbnail = (link.href || '').replace('http://', 'https://');
                    break;
                }
            }

            const nasaId = itemData.nasa_id || '';
            const mType = itemData.media_type || 'image';
            let videoUrl = null;
            if (mType === 'video' && nasaId) {
                videoUrl = `${NASA_IMAGES_API_URL}/asset/${nasaId}`;
            }

            return {
                nasa_id: nasaId,
                title: itemData.title || 'Untitled',
                description: (itemData.description || '').substring(0, 300),
                media_type: mType,
                thumbnail,
                video_url: videoUrl,
                date_created: itemData.date_created || '',
                center: itemData.center || '',
            };
        });

        const result = { items, total_hits: totalHits };
        mediaCache[cacheKey] = { timestamp: now, data: result };
        return result;

    } catch (err) {
        console.error(`[NASA Media] Error: ${err.message}`);
        return { items: [], total_hits: 0 };
    }
}

/**
 * Resolve the actual mp4 URL for a NASA video by its ID.
 */
async function resolveVideoUrl(nasaId) {
    try {
        const resp = await axios.get(`${NASA_IMAGES_API_URL}/asset/${nasaId}`, { timeout: 15000 });
        const items = (resp.data.collection || {}).items || [];

        const preferences = ['~large.mp4', '~medium.mp4', '~mobile.mp4', '~orig.mp4'];
        const mp4s = items
            .map(i => i.href || '')
            .filter(href => href.endsWith('.mp4'));

        let bestUrl = null;
        for (const pref of preferences) {
            for (const url of mp4s) {
                if (url.endsWith(pref)) {
                    bestUrl = url;
                    break;
                }
            }
            if (bestUrl) break;
        }

        if (!bestUrl && mp4s.length > 0) {
            bestUrl = mp4s[0];
        }

        if (bestUrl) {
            return bestUrl.replace('http://', 'https://');
        }
    } catch {
        // silently fail
    }
    return null;
}

module.exports = { searchNasaMedia, resolveVideoUrl };
