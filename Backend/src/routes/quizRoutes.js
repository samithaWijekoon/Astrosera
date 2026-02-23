const express = require('express');
const router = express.Router();

// Static astronomy question bank (30 questions)
const QUESTIONS = [
    { id: 1, question: "Which planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: "Mars" },
    { id: 2, question: "What is the name of the galaxy we live in?", options: ["Andromeda", "Milky Way", "Triangulum", "Whirlpool"], answer: "Milky Way" },
    { id: 3, question: "Which is the largest moon in our Solar System?", options: ["Titan", "Ganymede", "Europa", "Callisto"], answer: "Ganymede" },
    { id: 4, question: "How many planets are in our Solar System?", options: ["7", "8", "9", "10"], answer: "8" },
    { id: 5, question: "What is the closest star to Earth?", options: ["Sirius", "Proxima Centauri", "Betelgeuse", "Vega"], answer: "Proxima Centauri" },
    { id: 6, question: "Which planet has the most moons?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], answer: "Saturn" },
    { id: 7, question: "What is the largest planet in our Solar System?", options: ["Saturn", "Jupiter", "Neptune", "Uranus"], answer: "Jupiter" },
    { id: 8, question: "What type of star is our Sun?", options: ["Red Dwarf", "White Dwarf", "Yellow Dwarf", "Neutron Star"], answer: "Yellow Dwarf" },
    { id: 9, question: "What is the name of the first human to walk on the Moon?", options: ["Buzz Aldrin", "Yuri Gagarin", "Neil Armstrong", "John Glenn"], answer: "Neil Armstrong" },
    { id: 10, question: "How long does light take to travel from the Sun to Earth?", options: ["8 minutes", "2 minutes", "1 hour", "8 hours"], answer: "8 minutes" },
    { id: 11, question: "What is a light-year a measure of?", options: ["Time", "Speed", "Distance", "Mass"], answer: "Distance" },
    { id: 12, question: "Which planet rotates on its side?", options: ["Neptune", "Venus", "Uranus", "Saturn"], answer: "Uranus" },
    { id: 13, question: "What is the hottest planet in our Solar System?", options: ["Mercury", "Mars", "Venus", "Jupiter"], answer: "Venus" },
    { id: 14, question: "What is the name of NASA's solar telescope?", options: ["Hubble", "Parker Solar Probe", "James Webb", "Chandra"], answer: "Parker Solar Probe" },
    { id: 15, question: "Which spacecraft first left our Solar System?", options: ["Pioneer 10", "Voyager 1", "New Horizons", "Cassini"], answer: "Voyager 1" },
    { id: 16, question: "What is the term for the point of no return around a black hole?", options: ["Singularity", "Event Horizon", "Photon Sphere", "Quasar"], answer: "Event Horizon" },
    { id: 17, question: "How many Earth days does it take Mars to orbit the Sun?", options: ["365", "500", "687", "800"], answer: "687" },
    { id: 18, question: "What is the study of celestial objects and space called?", options: ["Astrology", "Geology", "Astronomy", "Cosmology"], answer: "Astronomy" },
    { id: 19, question: "Which planet has the Great Red Spot?", options: ["Saturn", "Mars", "Jupiter", "Neptune"], answer: "Jupiter" },
    { id: 20, question: "What is the name of the space telescope launched in 2021?", options: ["Hubble", "Spitzer", "James Webb", "Kepler"], answer: "James Webb" },
    { id: 21, question: "What causes a solar eclipse?", options: ["Earth between Sun and Moon", "Moon between Earth and Sun", "Sun behind Earth", "Moon behind Earth"], answer: "Moon between Earth and Sun" },
    { id: 22, question: "What is the name of the force that keeps planets in orbit?", options: ["Magnetism", "Gravity", "Friction", "Electromagnetism"], answer: "Gravity" },
    { id: 23, question: "What is the average surface temperature of the Sun?", options: ["3,000°C", "5,500°C", "10,000°C", "50,000°C"], answer: "5,500°C" },
    { id: 24, question: "Which planet has the Olympus Mons, the tallest volcano?", options: ["Earth", "Venus", "Mars", "Jupiter"], answer: "Mars" },
    { id: 25, question: "What is the name of the dark regions seen on the Moon?", options: ["Maria", "Craters", "Highlands", "Rills"], answer: "Maria" },
    { id: 26, question: "What is the speed of light approximately?", options: ["150,000 km/s", "300,000 km/s", "500,000 km/s", "1,000,000 km/s"], answer: "300,000 km/s" },
    { id: 27, question: "Which planet is known as the Ice Giant?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], answer: "Neptune" },
    { id: 28, question: "What is a pulsar?", options: ["A type of black hole", "A rapidly rotating neutron star", "An exploding star", "A comet"], answer: "A rapidly rotating neutron star" },
    { id: 29, question: "Which space agency launched the first satellite, Sputnik?", options: ["NASA", "ESA", "ISRO", "Soviet Space Program"], answer: "Soviet Space Program" },
    { id: 30, question: "What is the name of the nearest galaxy to the Milky Way?", options: ["Triangulum", "Andromeda", "Whirlpool", "Sombrero"], answer: "Andromeda" },
];

/**
 * GET /api/quiz/questions
 * Returns 10 random questions (shuffled).
 */
router.get('/questions', (req, res) => {
    const count = parseInt(req.query.count) || 10;
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, QUESTIONS.length));
    // Strip the answer before sending to client
    const clientSafe = selected.map(({ answer, ...rest }) => rest);
    // Store answers in a signed structure (simple map sent separately)
    res.json({ questions: clientSafe, total: selected.length });
});

/**
 * POST /api/quiz/submit
 * Body: { answers: [{ id, selected }] }
 * Returns score, correct/incorrect per question, timeTakenMs, fullMarks.
 */
router.post('/submit', (req, res) => {
    const { answers = [] } = req.body;
    if (!answers.length) return res.status(400).json({ error: 'No answers provided' });

    const results = answers.map(({ id, selected }) => {
        const q = QUESTIONS.find(q => q.id === id);
        if (!q) return { id, correct: false };
        return { id, correct: q.answer === selected, correctAnswer: q.answer };
    });

    const correctCount = results.filter(r => r.correct).length;
    const total = answers.length;
    // Score as a percentage (0-100)
    const score = Math.round((correctCount / total) * 100);
    const fullMarks = correctCount === total;

    return res.json({ score, correctCount, total, fullMarks, results });
});

module.exports = router;
