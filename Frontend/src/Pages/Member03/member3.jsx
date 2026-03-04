import React, { useState } from 'react';
import './member3.css';

// Member 03: Daily Quiz & Learning Engine
const Member3 = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [streak, setStreak] = useState(12); // Simulated streak data
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct' or 'incorrect'

    const questions = [
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            answer: "Mars"
        },
        {
            question: "What is the name of the galaxy we live in?",
            options: ["Andromeda", "Milky Way", "Triangulum", "Whirlpool"],
            answer: "Milky Way"
        },
        {
            question: "What is the largest moon in the Solar System?",
            options: ["Titan", "Ganymede", "Europa", "Callisto"],
            answer: "Ganymede"
        }
    ];

    const handleAnswerOptionClick = (option) => {
        setSelectedOption(option);
        if (option === questions[currentQuestion].answer) {
            setScore(score + 1);
            setFeedback('correct');
        } else {
            setFeedback('incorrect');
        }

        // Delay to show feedback animation before next question
        setTimeout(() => {
            const nextQuestion = currentQuestion + 1;
            if (nextQuestion < questions.length) {
                setCurrentQuestion(nextQuestion);
                setSelectedOption(null);
                setFeedback(null);
            } else {
                setShowScore(true);
            }
        }, 1200);
    };

    return (
        <div className="member3-container">
            <header className="quiz-header">
                <div className="streak-counter">
                    🔥 {streak} Day Streak
                </div>
                <h1>Daily Astronomy Quiz</h1>
            </header>

            {showScore ? (
                <div className="score-section">
                    <h2>Quiz Completed!</h2>
                    <div className="final-score-circle">
                        {score} / {questions.length}
                    </div>
                    <p>Time Taken: 45s</p>
                    <button className="restart-btn" onClick={() => window.location.reload()}>Try Again Tomorrow</button>
                </div>
            ) : (
                <div className="question-section">
                    <div className="question-count">
                        <span>Question {currentQuestion + 1}</span>/{questions.length}
                    </div>
                    <div className="question-text">{questions[currentQuestion].question}</div>

                    <div className="answer-section">
                        {questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => !selectedOption && handleAnswerOptionClick(option)}
                                className={`option-btn ${selectedOption === option
                                        ? (option === questions[currentQuestion].answer ? 'correct' : 'incorrect')
                                        : ''
                                    }`}
                                disabled={!!selectedOption}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                    {feedback && (
                        <div className={`feedback-animate ${feedback}`}>
                            {feedback === 'correct' ? "Correct! 🌟" : "Oops! ❌"}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Member3;
