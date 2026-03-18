const Quiz = require('../models/Quiz');
const User = require('../models/User');
const xlsx = require('xlsx');

// 1. Function to handle Excel Upload
const uploadQuizExcel = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const workbook = xlsx.read(req.files.file.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        const formattedQuestions = rawData.map(item => {
            const getVal = (target) => {
                const key = Object.keys(item).find(k => k.toLowerCase().trim() === target.toLowerCase());
                return item[key];
            };

            return {
                questionNo: getVal('Question No') || getVal('No'),
                question: getVal('Question'),
                option1: getVal('Answer 1'),
                option2: getVal('Answer 2'),
                option3: getVal('Answer 3'),
                option4: getVal('Answer 4'),
                correctAnswer: getVal('Correct Answer'),
                weekNumber: getVal('Week') || 1
            };
        });

        await Quiz.insertMany(formattedQuestions);
        res.status(201).json({ success: true, message: "Success! 100 questions added." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. Function to get all quizzes for Analytics View
const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().sort({ questionNo: 1 });
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadQuizExcel, getQuizzes };