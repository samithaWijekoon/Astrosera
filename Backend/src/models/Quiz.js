const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'general' },
    difficulty: { type: String, default: 'medium' }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);