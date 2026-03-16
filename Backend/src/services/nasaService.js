require('dotenv').config();
const axios = require('axios');
const fs    = require('fs');
const path  = require('path');

const BASE = 'https://api.nasa.gov/neo/rest/v1';
const KEY  = process.env.NASA_API_KEY || 'DEMO_KEY';

console.log(`[NASA] API key loaded: ${KEY === 'DEMO_KEY' ? '⚠ DEMO_KEY (rate limited!)' : '✅ Real key: ' + KEY.substring(0, 8) + '...'}`);

// ── Disk cache (survives backend restarts) ─────────────────────────────────
const CACHE_DIR  = path.join(__dirname, '..', 'data');
const CACHE_FILE = path.join(CACHE_DIR, 'nasa_cache.json');
const CACHE_TTL  = 24 * 60 * 60 * 1000; // 24 hours

function loadDiskCache() {
  try {
    if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
    if (!fs.existsSync(CACHE_FILE)) return {};
    return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  } catch { return {}; }
}

function saveDiskCache(c) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(c, null, 2));
  } catch (e) { console.error('[Cache] Save error:', e.message); }
}

let cache = loadDiskCache();
console.log(`[Cache] Loaded ${Object.keys(cache).length} cached entries from disk`);

function getCached(key) {
  const entry = cache[key];
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { delete cache[key]; saveDiskCache(cache); return null; }
  console.log(`[Cache] HIT: ${key}`);
  return entry.data;
}

function setCache(key, data) {
  cache[key] = { data, expiresAt: Date.now() + CACHE_TTL };
  saveDiskCache(cache);
  console.log(`[Cache] STORED: ${key}`);
}

function fmt(d) { return d.toISOString().split('T')[0]; }

// Auto-retry up to 3x on rate limit
async function fetchWithRetry(url, params, retries = 3, delay = 3000) {
  try {
    const res = await axios.get(url, { params, timeout: 15000 });
    return res.data;
  } catch (err) {
    if (err.response?.status === 429 && retries > 0) {
      console.log(`[NASA] Rate limited — retrying in ${delay}ms (${retries} left)`);
      await new Promise(r => setTimeout(r, delay));
      return fetchWithRetry(url, params, retries - 1, delay * 2);
    }
    throw err;
  }
}

async function getFeed(startDate, endDate) {
  const start = startDate || fmt(new Date());
  const end   = endDate   || fmt(new Date(Date.now() + 6 * 86400000));
  const key   = `feed_${start}_${end}`;
  const hit   = getCached(key);
  if (hit) return hit;
  const data  = await fetchWithRetry(`${BASE}/feed`, { start_date: start, end_date: end, api_key: KEY });
  setCache(key, data);
  return data;
}

async function getAsteroidById(id) {
  const key  = `neo_${id}`;
  const hit  = getCached(key);
  if (hit) return hit;
  const data = await fetchWithRetry(`${BASE}/neo/${id}`, { api_key: KEY });
  setCache(key, data);
  return data;
}

async function browse(page = 0, size = 20) {
  const key  = `browse_${page}_${size}`;
  const hit  = getCached(key);
  if (hit) return hit;
  const data = await fetchWithRetry(`${BASE}/neo/browse`, { page, size, api_key: KEY });
  setCache(key, data);
  return data;
}

async function getUpcoming(days = 7) {
  const start = fmt(new Date());
  const end   = fmt(new Date(Date.now() + (days - 1) * 86400000));
  return getFeed(start, end);
}

module.exports = { getFeed, getAsteroidById, browse, getUpcoming };
