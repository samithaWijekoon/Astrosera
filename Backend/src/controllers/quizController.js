const Quiz = require('../models/Quiz');
const xlsx = require('xlsx');

const uploadQuizExcel = async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.files.file;
        const workbook = xlsx.read(file.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Mapping Excel columns to MongoDB fields
        const formattedQuestions = data.map(item => ({
            questionNo: item['question no'], // Matches your Excel column name
            question: item['question'],
            option1: item['answer 1'],
            option2: item['answer 2'],
            option3: item['answer 3'],
            option4: item['answer 4'],
            correctAnswer: item['correct answer'],
            weekNumber: item['week'] || 1
        }));

        await Quiz.insertMany(formattedQuestions);
        res.status(201).json({ message: "100 Questions uploaded successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { uploadQuizExcel };