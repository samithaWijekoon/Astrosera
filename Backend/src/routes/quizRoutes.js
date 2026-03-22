const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const xlsx = require('xlsx');
const Quiz = require('../models/Quiz');

// GET all questions
router.get('/', async (req, res) => {
    try {
        const questions = await Quiz.find();
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET random question
router.get('/random', async (req, res) => {
    try {
        const count = await Quiz.countDocuments();
        if (count === 0) return res.status(404).json({ message: 'No questions found' });
        const random = Math.floor(Math.random() * count);
        const question = await Quiz.findOne().skip(random);
        res.json(question);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET quiz status for user
router.get('/status/:userId', async (req, res) => {
    try {
        res.json({ canPlay: true, userId: req.params.userId });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST upload quiz Excel
router.post('/upload', async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
        const file = req.files.file;
        const workbook = xlsx.read(file.data, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);
        await Quiz.insertMany(data);
        res.json({ message: `${data.length} questions uploaded successfully` });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// DELETE clear all questions
router.delete('/clear', async (req, res) => {
    try {
        await Quiz.deleteMany();
        res.json({ message: 'All questions cleared' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;