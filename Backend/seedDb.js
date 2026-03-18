require('dotenv').config({ override: true });
const mongoose = require('mongoose');
const Quiz = require('./src/models/Quiz');

const seedQuestions = [
    {
        questionNo: 1,
        question: "What is the largest planet in our Solar System?",
        option1: "Earth", option2: "Mars", option3: "Jupiter", option4: "Saturn",
        correctAnswer: "Jupiter"
    },
    {
        questionNo: 2,
        question: "Which planet is known as the Red Planet?",
        option1: "Venus", option2: "Mars", option3: "Jupiter", option4: "Uranus",
        correctAnswer: "Mars"
    },
    {
        questionNo: 3,
        question: "What is the name of the first artificial Earth satellite?",
        option1: "Apollo 11", option2: "Sputnik 1", option3: "Voyager 1", option4: "Hubble",
        correctAnswer: "Sputnik 1"
    },
    {
        questionNo: 4,
        question: "Which galaxy is home to the Solar System?",
        option1: "Andromeda", option2: "Milky Way", option3: "Triangulum", option4: "Sombrero",
        correctAnswer: "Milky Way"
    },
    {
        questionNo: 5,
        question: "What is the hottest planet in the Solar System?",
        option1: "Mercury", option2: "Venus", option3: "Mars", option4: "Jupiter",
        correctAnswer: "Venus"
    },
    {
        questionNo: 6,
        question: "Who was the first person to walk on the moon?",
        option1: "Buzz Aldrin", option2: "Yuri Gagarin", option3: "Neil Armstrong", option4: "Michael Collins",
        correctAnswer: "Neil Armstrong"
    },
    {
        questionNo: 7,
        question: "What type of star is the Sun?",
        option1: "Red Dwarf", option2: "White Dwarf", option3: "Yellow Dwarf", option4: "Blue Giant",
        correctAnswer: "Yellow Dwarf"
    },
    {
        questionNo: 8,
        question: "Which planet has the most extensive ring system?",
        option1: "Jupiter", option2: "Saturn", option3: "Uranus", option4: "Neptune",
        correctAnswer: "Saturn"
    },
    {
        questionNo: 9,
        question: "What is the closest star to Earth?",
        option1: "Alpha Centauri", option2: "Proxima Centauri", option3: "Sirius", option4: "The Sun",
        correctAnswer: "The Sun"
    },
    {
        questionNo: 10,
        question: "What galaxy is expected to collide with the Milky Way in 4 billion years?",
        option1: "Andromeda", option2: "Triangulum", option3: "Pinwheel", option4: "Whirlpool",
        correctAnswer: "Andromeda"
    }
];

async function runSeed() {
    try {
        console.log(`Connecting to ${process.env.MONGO_URI}...`);
        await mongoose.connect(process.env.MONGO_URI);
        
        console.log("Clearing old quizzes...");
        await Quiz.deleteMany({});
        
        console.log("Inserting 10 sample quizzes...");
        await Quiz.insertMany(seedQuestions);
        
        console.log("✅ Seed complete! Quizzes imported successfully.");
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
    } finally {
        mongoose.disconnect();
        process.exit(0);
    }
}

runSeed();
