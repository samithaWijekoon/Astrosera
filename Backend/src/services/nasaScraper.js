const Parser = require('rss-parser');
const axios = require('axios');
const cheerio = require('cheerio');
const Article = require('../models/Article');
const ScrapeMeta = require('../models/ScrapeMeta');

const parser = new Parser();

// ── NASA RSS feed URLs ─────────────────────────────────────────────
const NASA_RSS_FEEDS = [
    'https://www.nasa.gov/news-release/feed/',
    'https://www.nasa.gov/technology/feed/',
    'https://www.nasa.gov/earth/feed/',
    'https://www.nasa.gov/solar-system/feed/',
    'https://www.nasa.gov/universe/feed/',
    'https://www.nasa.gov/aeronautics/feed/',
    'https://www.nasa.gov/learning-resources/feed/',
    'https://www.nasa.gov/general/feed/',
];

// ── Category classifier ────────────────────────────────────────────
const CATEGORY_KEYWORDS = {
    missions: ['artemis', 'mission', 'launch', 'crew', 'astronaut', 'iss', 'station', 'rocket', 'starship', 'spacecraft', 'orbit'],
    discoveries: ['discover', 'found', 'detect', 'webb', 'hubble', 'telescope', 'galaxy', 'exoplanet', 'dark matter', 'black hole', 'observation'],
    spaceweather: ['solar', 'flare', 'sun', 'coronal', 'aurora', 'geomagnetic', 'radiation', 'storm', 'magnetosphere'],
    technology: ['technology', 'ai', 'robot', 'satellite', 'instrument', 'sensor', 'propulsion', 'engine', 'innovation', 'commercial'],
    planets: ['mars', 'jupiter', 'saturn', 'venus', 'mercury', 'neptune', 'uranus', 'planet', 'moon', 'europa', 'titan', 'asteroid'],
};

function classifyCategory(text) {
    const textLower = text.toLowerCase();
    const scores = {};
    for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        scores[cat] = keywords.filter(kw => textLower.includes(kw)).length;
    }
    const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return best[1] > 0 ? best[0] : 'missions';
}

function calcReadingTime(text) {
    const words = text.split(/\s+/).length;
    return Math.max(1, Math.ceil(words / 200));
}

function cleanHtml(html) {
    const $ = cheerio.load(html || '');
    return $.text().trim();
}

function extractImageFromHtml(html) {
    const $ = cheerio.load(html || '');
    const img = $('img').first();
    if (img.length && img.attr('src')) {
        let src = img.attr('src');
        if (src.startsWith('/')) {
            return `https://www.nasa.gov${src}`;
        }
        return src;
    }
    return null;
}

// ── Main scraper ────────────────────────────────────────────────────
async function scrapeNasaFeeds() {
    let newCount = 0;

    for (const feedUrl of NASA_RSS_FEEDS) {
        try {
            const feed = await parser.parseURL(feedUrl);

            for (const entry of feed.items) {
                const link = entry.link || '';
                if (!link) continue;

                const title = entry.title || 'Untitled';
                const normalizedTitle = title.toLowerCase().replace(/\s+/g, ' ').trim();

                // Check if article already exists by URL
                const existing = await Article.findOne({ url: link });
                if (existing) continue;

                // Check if title already exists (normalized)
                const allTitles = await Article.find({}, 'title').lean();
                const titleExists = allTitles.some(a =>
                    a.title.toLowerCase().replace(/\s+/g, ' ').trim() === normalizedTitle
                );
                if (titleExists) continue;

                // Extract fields
                const rawSummary = entry.contentSnippet || entry.content || '';
                const rawContent = entry['content:encoded'] || entry.content || '';

                const plainSummary = cleanHtml(rawSummary).substring(0, 300);
                const fullText = rawContent ? cleanHtml(rawContent) : plainSummary;

                // Publication date
                let pubDate = '';
                if (entry.pubDate || entry.isoDate) {
                    try {
                        const d = new Date(entry.pubDate || entry.isoDate);
                        pubDate = d.toISOString().split('T')[0];
                    } catch {
                        pubDate = new Date().toISOString().split('T')[0];
                    }
                } else {
                    pubDate = new Date().toISOString().split('T')[0];
                }

                // Image extraction
                let imageUrl = null;

                // Check media content
                if (entry.enclosure && entry.enclosure.url) {
                    imageUrl = entry.enclosure.url;
                }

                // Try extracting from HTML
                if (!imageUrl) {
                    imageUrl = extractImageFromHtml((rawSummary || '') + (rawContent || ''));
                }

                // Fix relative URLs
                if (imageUrl && imageUrl.startsWith('/')) {
                    imageUrl = `https://www.nasa.gov${imageUrl}`;
                } else if (!imageUrl) {
                    imageUrl = 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&h=400&fit=crop';
                }

                const source = feed.title || 'NASA';
                const category = classifyCategory(title + ' ' + plainSummary);
                const readingTime = calcReadingTime(fullText);

                const article = new Article({
                    title,
                    summary: plainSummary.length > 10 ? plainSummary : title,
                    fullContent: fullText,
                    source,
                    date: pubDate,
                    category,
                    imageUrl,
                    url: link,
                    readingTime,
                    trending: false,
                });

                await article.save();
                newCount++;
            }

            // Update scrape metadata
            await ScrapeMeta.findOneAndUpdate(
                { feedUrl },
                { lastScrapedAt: new Date() },
                { upsert: true }
            );

        } catch (err) {
            console.error(`[Scraper] Error scraping ${feedUrl}:`, err.message);
            continue;
        }
    }

    if (newCount > 0) {
        console.log(`[Scraper] Inserted ${newCount} new articles.`);

        // Reset all trending flags
        await Article.updateMany({}, { trending: false });

        // Mark newest 3 as trending
        const latest = await Article.find()
            .sort({ date: -1, _id: -1 })
            .limit(3);
        for (const a of latest) {
            a.trending = true;
            await a.save();
        }
    }

    return newCount;
}

module.exports = { scrapeNasaFeeds };
