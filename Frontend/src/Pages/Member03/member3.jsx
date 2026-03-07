import React, { useState, useEffect, useRef, useCallback } from 'react';
import './member3.css';

const API = 'http://localhost:5000/api';
const QUIZ_TIME_LIMIT_MS = 120_000; // 2 minutes

const Member3 = () => {
    // Quiz state
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [phase, setPhase] = useState('loading'); // loading|quiz|result|error
    const [result, setResult] = useState(null);
    const [loadError, setLoadError] = useState(null);

    // Timer state
    const [elapsed, setElapsed] = useState(0); // ms
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    // User
    const userId = sessionStorage.getItem('userId');

    // ── Load questions on mount ─────────────────────────────────────────────
    useEffect(() => {
        const load = async () => {
            try {
                const res = await fetch(`${API}/quiz/questions?count=10`);
                const data = await res.json();
                if (!data.questions?.length) throw new Error('No questions');
                setQuestions(data.questions);
                setPhase('quiz');
                startTimeRef.current = Date.now();
                timerRef.current = setInterval(() => {
                    setElapsed(Date.now() - startTimeRef.current);
                }, 500);
            } catch (e) {
                console.error(e);
                setLoadError('Could not load quiz questions.');
                setPhase('error');
            }
        };
        load();
        return () => clearInterval(timerRef.current);
    }, []);

    // ── Handle answer pick ──────────────────────────────────────────────────
    const handlePick = (option) => {
        if (selectedOption) return; // already answered
        setSelectedOption(option);
        const correct = option === questions[currentQ].answer;
        setFeedback(correct ? 'correct' : 'incorrect');
        setAnswers(prev => ({ ...prev, [questions[currentQ].id]: option }));

        setTimeout(() => {
            const next = currentQ + 1;
            if (next < questions.length) {
                setCurrentQ(next);
                setSelectedOption(null);
                setFeedback(null);
            } else {
                submitQuiz();
            }
        }, 1200);
    };

    // ── Submit quiz to backend ──────────────────────────────────────────────
    const submitQuiz = useCallback(async () => {
        clearInterval(timerRef.current);
        const timeTakenMs = Date.now() - startTimeRef.current;

        // Build answer payload including any unanswered questions
        const answersPayload = questions.map(q => ({
            id: q.id,
            selected: answers[q.id] || null,
        }));

        try {
            // 1. Grade the quiz
            const gradeRes = await fetch(`${API}/quiz/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: answersPayload }),
            });
            const gradeData = await gradeRes.json();

            setResult({ ...gradeData, timeTakenMs });

            // 2. Record interaction in gamification system (fire and forget)
            if (userId) {
                fetch(`${API}/gamification/record-interaction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        isQuiz: true,
                        quizScore: gradeData.score,
                        timeTakenMs,
                        fullMarks: gradeData.fullMarks,
                    }),
                }).catch(console.error);
            }

            setPhase('result');
        } catch (e) {
            console.error('Submit error:', e);
            setPhase('error');
            setLoadError('Failed to submit quiz. Please try again.');
        }
    }, [questions, answers, userId]);

    // ── Restart quiz ────────────────────────────────────────────────────────
    const restart = () => {
        window.location.reload();
    };

    // ── Timer display ────────────────────────────────────────────────────────
    const formatTime = (ms) => {
        const total = Math.floor(ms / 1000);
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const timeLeft = Math.max(0, QUIZ_TIME_LIMIT_MS - elapsed);
    const timerPct = (elapsed / QUIZ_TIME_LIMIT_MS) * 100;
    const timerColor = timeLeft < 20000 ? '#ef4444' : timeLeft < 60000 ? '#f59e0b' : '#a78bfa';

    // Auto-submit when timer runs out
    useEffect(() => {
        if (phase === 'quiz' && elapsed >= QUIZ_TIME_LIMIT_MS) {
            submitQuiz();
        }
    }, [elapsed, phase, submitQuiz]);

    // ─── RENDER states ───────────────────────────────────────────────────────

    if (phase === 'loading') {
        return (
            <div className="member3-container">
                <div className="quiz-loading">
                    <div className="quiz-loading-spinner" />
                    <p>Loading your cosmic quiz... 🌌</p>
                </div>
            </div>
        );
    }

    if (phase === 'error') {
        return (
            <div className="member3-container">
                <div className="quiz-error">
                    <h2>⚠️ Error</h2>
                    <p>{loadError}</p>
                    <button className="restart-btn" onClick={restart}>Try Again</button>
                </div>
            </div>
        );
    }

    if (phase === 'result') {
        const { score, correctCount, total, timeTakenMs, fullMarks } = result;
        const grade =
            score === 100 ? '🌟 Perfect!' :
                score >= 80 ? '🚀 Excellent!' :
                    score >= 60 ? '✨ Good Job!' :
                        score >= 40 ? '💫 Keep Going!' : '🔄 Keep Practising!';

        const badgeMsg = userId
            ? '🏅 Your achievements have been updated!'
            : '⚠️ Log in to save your progress and earn badges!';

        return (
            <div className="member3-container">
                <div className="score-section">
                    <h2>Quiz Completed! {grade}</h2>
                    <div className="final-score-circle" style={{
                        borderColor: score >= 50 ? '#a78bfa' : '#ef4444',
                        color: score >= 50 ? '#a78bfa' : '#ef4444',
                    }}>
                        {score}%
                    </div>
                    <p className="score-detail">{correctCount} / {total} correct</p>
                    <p className="score-detail">⏱ Time taken: {formatTime(timeTakenMs)}</p>
                    {timeTakenMs < QUIZ_TIME_LIMIT_MS && (
                        <p className="score-detail speed-badge">⚡ Under 2 minutes — Speed badge eligible!</p>
                    )}
                    {fullMarks && <p className="score-detail perfect-badge">🌟 Perfect score!</p>}
                    <p className="score-badge-msg">{badgeMsg}</p>
                    <button className="restart-btn" onClick={restart}>Take Another Quiz 🚀</button>
                </div>
            </div>
        );
    }

    // ── Phase: quiz ─────────────────────────────────────────────────────────
    const q = questions[currentQ];

    return (
        <div className="member3-container">
            <header className="quiz-header">
                <div className="quiz-header-top">
                    <div className="streak-counter">
                        🌌 Daily Astronomy Quiz
                    </div>
                    {/* Timer */}
                    <div className="quiz-timer" style={{ color: timerColor }}>
                        ⏱ {formatTime(timeLeft)}
                    </div>
                </div>

                {/* Timer bar */}
                <div className="quiz-timer-bar">
                    <div
                        className="quiz-timer-bar__fill"
                        style={{
                            width: `${100 - timerPct}%`,
                            background: timerColor,
                            transition: 'width 0.5s linear, background 0.5s',
                        }}
                    />
                </div>
            </header>

            <div className="question-section">
                <div className="question-count">
                    <span>Question {currentQ + 1}</span>/{questions.length}
                </div>
                <div className="question-text">{q.question}</div>

                <div className="answer-section">
                    {q.options.map((option, idx) => (
                        <button
                            key={idx}
                            onClick={() => !selectedOption && handlePick(option)}
                            className={`option-btn ${selectedOption === option
                                    ? (option === q.answer ? 'correct' : 'incorrect')
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
                        {feedback === 'correct' ? 'Correct! 🌟' : 'Oops! ❌'}
                    </div>
                )}

                {/* Progress dots */}
                <div className="quiz-progress-dots">
                    {questions.map((_, i) => (
                        <span
                            key={i}
                            className={`quiz-dot ${i < currentQ ? 'quiz-dot--done' : i === currentQ ? 'quiz-dot--active' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Member3;
