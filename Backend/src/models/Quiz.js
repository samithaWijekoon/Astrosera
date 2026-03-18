const mongoose = require('mongoose');

const quizSchema = mongoose.Schema({
    questionNo: { type: Number },
    question: { type: String, required: true },
    option1: { type: String, required: true },
    option2: { type: String, required: true },
    option3: { type: String, required: true },
    option4: { type: String, required: true },
    correctAnswer: { type: String, required: true },
    weekNumber: { type: Number, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);