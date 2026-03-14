const mongoose = require('mongoose');

const apodCacheSchema = new mongoose.Schema({
    title: { type: String, required: true },
    explanation: { type: String, default: '' },
    url: { type: String, default: '' },
    hdurl: { type: String, default: null },
    date: { type: String, unique: true, required: true },
    mediaType: { type: String, default: 'image' },
    copyright: { type: String, default: null },
    cachedAt: { type: Date, default: Date.now },
});

apodCacheSchema.index({ date: -1 });

module.exports = mongoose.model('ApodCache', apodCacheSchema);
