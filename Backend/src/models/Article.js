const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    fullContent: { type: String, default: '' },
    source: { type: String, default: 'NASA' },
    date: { type: String, default: '' },
    category: { type: String, default: 'missions' },
    imageUrl: { type: String, default: '' },
    url: { type: String, default: '' },
    readingTime: { type: Number, default: 3 },
    trending: { type: Boolean, default: false },
}, { timestamps: true });

// Index for fast lookups
articleSchema.index({ url: 1 }, { unique: true });
articleSchema.index({ date: -1 });
articleSchema.index({ trending: -1, date: -1 });

module.exports = mongoose.model('Article', articleSchema);
