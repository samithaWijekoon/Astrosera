const express = require('express');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();
const FILE = path.join(__dirname, '..', 'data', 'quizzes.json');

function readAll() {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeAll(list) {
  const dir = path.dirname(FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(list, null, 2));
}

function normalizeRow(row) {
  const normalized = {};
  for (const [k, v] of Object.entries(row)) {
    const key = String(k).trim().toLowerCase();
    normalized[key] = v;
  }
  return normalized;
}

function getField(row, keys) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && row[key] !== '') return row[key];
  }
  return '';
}

router.get('/', (_req, res) => {
  res.json(readAll());
});

router.delete('/clear', (_req, res) => {
  writeAll([]);
  res.json({ success: true });
});

router.post('/upload', (req, res) => {
  const file = req.files?.file;
  if (!file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  let workbook;
  try {
    workbook = xlsx.read(file.data, { type: 'buffer' });
  } catch {
    return res.status(400).json({ success: false, message: 'Invalid Excel file' });
  }

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { defval: '' });

  const parsed = rows.map(raw => {
    const row = normalizeRow(raw);
    const questionNo = getField(row, ['question no', 'question_no', 'no', 'number']);
    const question = getField(row, ['question', 'question text', 'question_text']);
    const answer1 = getField(row, ['answer 1', 'answer1', 'ans1', 'option 1', 'option1']);
    const answer2 = getField(row, ['answer 2', 'answer2', 'ans2', 'option 2', 'option2']);
    const answer3 = getField(row, ['answer 3', 'answer3', 'ans3', 'option 3', 'option3']);
    const answer4 = getField(row, ['answer 4', 'answer4', 'ans4', 'option 4', 'option4']);
    const correctAnswer = getField(row, ['correct answer', 'correct', 'correct_answer']);
    const weekNumber = getField(row, ['week', 'week number', 'weekno', 'week_number']);

    return {
      _id: uuidv4(),
      questionNo: questionNo === '' ? '' : String(questionNo),
      question: question === '' ? '' : String(question),
      answers: [answer1, answer2, answer3, answer4].map(v => (v === '' ? '' : String(v))),
      correctAnswer: correctAnswer === '' ? '' : String(correctAnswer),
      weekNumber: weekNumber === '' ? 1 : Number(weekNumber) || 1,
      createdAt: new Date().toISOString(),
    };
  }).filter(q => q.question);

  if (parsed.length === 0) {
    return res.status(400).json({ success: false, message: 'No valid questions found in file' });
  }

  const existing = readAll();
  const combined = existing.concat(parsed);
  writeAll(combined);

  return res.json({ success: true, message: `Uploaded ${parsed.length} questions`, count: parsed.length });
});

module.exports = router;
