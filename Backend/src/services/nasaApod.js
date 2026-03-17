const axios = require('axios');
const ApodCache = require('../models/ApodCache');

const NASA_APOD_URL = 'https://api.nasa.gov/planetary/apod';

/**
 * Fetch APOD from NASA API.
 * Returns raw data object or null on failure.
 */
async function fetchApodFromNasa(date = null) {
    const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
    const params = { api_key: apiKey };
    if (date) params.date = date;

    try {
        const resp = await axios.get(NASA_APOD_URL, { params, timeout: 3000 });
        return resp.data;
    } catch (err) {
        console.error(`[APOD] Error fetching from NASA: ${err.message}`);
        return null;
    }
}

/**
 * Get today's APOD — from cache if available, otherwise fetch from NASA.
 */
async function getOrFetchApod() {
    const today = new Date().toISOString().split('T')[0];

    // Check cache
    const cached = await ApodCache.findOne({ date: today });
    if (cached) {
        return {
            title: cached.title,
            date: cached.date,
            url: cached.url,
            hdurl: cached.hdurl,
            explanation: cached.explanation,
            media_type: cached.mediaType,
            copyright: cached.copyright,
        };
    }

    // Fetch from NASA
    const data = await fetchApodFromNasa();
    if (!data) {
        // Try fallback to most recent cached entry
        const fallback = await ApodCache.findOne().sort({ date: -1 });
        if (fallback) {
            return {
                title: fallback.title,
                date: fallback.date,
                url: fallback.url,
                hdurl: fallback.hdurl,
                explanation: fallback.explanation,
                media_type: fallback.mediaType,
                copyright: fallback.copyright,
            };
        }
        return null;
    }

    // Store in cache
    try {
        const entry = new ApodCache({
            title: data.title || 'Untitled',
            explanation: data.explanation || '',
            url: data.url || '',
            hdurl: data.hdurl || null,
            date: data.date || today,
            mediaType: data.media_type || 'image',
            copyright: data.copyright || null,
        });
        await entry.save();
    } catch (err) {
        // If duplicate date, no problem
        if (err.code !== 11000) {
            console.error('[APOD] Error caching:', err.message);
        }
    }

    return {
        title: data.title,
        date: data.date,
        url: data.url,
        hdurl: data.hdurl,
        explanation: data.explanation,
        media_type: data.media_type || 'image',
        copyright: data.copyright,
    };
}

module.exports = { getOrFetchApod };
