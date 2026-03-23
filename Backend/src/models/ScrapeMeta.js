const mongoose = require('mongoose');

const scrapeMetaSchema = new mongoose.Schema({
    feedUrl: { type: String, unique: true, required: true },
    lastScrapedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ScrapeMeta', scrapeMetaSchema);
