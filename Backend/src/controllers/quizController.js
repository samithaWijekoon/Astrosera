const Quiz = require('../models/Quiz');
const xlsx = require('xlsx');

const uploadQuizExcel = async (req, res) => {
    try {
        // 1. Check if the file actually reached the backend
        if (!req.files || Object.keys(req.files).length === 0) {
            console.log("No files object found in request");
            return res.status(400).json({ success: false, message: "No file was received by the server" });
        }

        const quizFile = req.files.file; // This MUST match the name in your Frontend formData

        // 2. Read the Excel data
        const workbook = xlsx.read(quizFile.data, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        // 3. Simple mapping
        const formatted = data.map(item => ({
            questionNo: item['Question No'] || item['question no'],
            question: item['Question'] || item['question'],
            option1: item['Answer 1'] || item['answer 1'],
            option2: item['Answer 2'] || item['answer 2'],
            option3: item['Answer 3'] || item['answer 3'],
            option4: item['Answer 4'] || item['answer 4'],
            correctAnswer: item['Correct Answer'] || item['correct answer'],
            weekNumber: item['Week'] || 1
        }));

        await Quiz.insertMany(formatted);
        res.status(200).json({ success: true, message: "Success! 100 questions added." });

    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { uploadQuizExcel };