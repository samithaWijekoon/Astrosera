import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './member3.css';

// Using port 5001 as specified in prompt
const API = 'http://localhost:5001/api';
// 2 minutes total fuel
const QUIZ_TIME_LIMIT_MS = 120_000;

// Fisher-Yates array shuffle
const shuffleArray = (array) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

const Member3 = () => {
    const navigate = useNavigate();
    // Phases: loading | briefing | quiz | result | error
    const [phase, setPhase] = useState('loading');
    const [savedState, setSavedState] = useState(null);
    
    // Data states
    const [allQuestions, setAllQuestions] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect'
    const [loadError, setLoadError] = useState(null);
    const [scoreInfo, setScoreInfo] = useState({ score: 0, correctCount: 0, timeTakenMs: 0, fullMarks: false });

    // Timer state
    const [elapsed, setElapsed] = useState(0);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    // Auth
    const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');

    // Stats
    const totalQuestions = quizQuestions.length;
    const answeredCount = currentQ; // Since we can't go back, currentQ is how many we've passed (before current is answered)

    // 0. Check for saved state
    useEffect(() => {
        const saved = localStorage.getItem('astrosera_quiz_state');
        if (saved) {
            try {
                setSavedState(JSON.parse(saved));
            } catch (e) {
                localStorage.removeItem('astrosera_quiz_state');
            }
        }
    }, []);

    // 1. Fetch questions on mount
    useEffect(() => {
        const load = async () => {
            try {
                // Determine token for authorization
                const headers = {};
                if (token) headers['Authorization'] = `Bearer ${token}`;

                const res = await fetch(`${API}/quiz`, { headers });
                
                if (!res.ok) {
                    throw new Error(`Failed to fetch questions. Status: ${res.status}`);
                }

                const data = await res.json();
                
                if (!Array.isArray(data) || data.length === 0) {
                    throw new Error('No questions available in the database.');
                }

                setAllQuestions(data);
                setPhase('briefing');
            } catch (e) {
                console.error(e);
                setLoadError(e.message || 'Could not load quiz questions.');
                setPhase('error');
            }
        };
        load();
        
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [token]);

    // 2. Start Mission
    const startMission = () => {
        localStorage.removeItem('astrosera_quiz_state');
        setSavedState(null);
        // Shuffle ALL questions from the DB to get a random order
        let shuffled = shuffleArray(allQuestions);
        
        // Map to a consistent format
        shuffled = shuffled.map(q => ({
            id: q._id || q.questionNo,
            questionText: q.question,
            options: [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
            correctAnswer: q.correctAnswer
        }));

        setQuizQuestions(shuffled);
        setCurrentQ(0);
        setSelectedOption(null);
        setFeedback(null);
        setElapsed(0);
        setPhase('quiz');

        // Start timer
        startTimeRef.current = Date.now();
        timerRef.current = setInterval(() => {
            setElapsed(Date.now() - startTimeRef.current);
        }, 100); // 100ms for smooth fuel bar
    };

    const resumeMission = () => {
        if (!savedState) return;
        setQuizQuestions(savedState.quizQuestions);
        setCurrentQ(savedState.currentQ);
        setScoreInfo(savedState.scoreInfo);
        setElapsed(savedState.elapsed);
        setSelectedOption(null);
        setFeedback(null);
        setPhase('quiz');
        
        startTimeRef.current = Date.now() - savedState.elapsed;
        timerRef.current = setInterval(() => {
            setElapsed(Date.now() - startTimeRef.current);
        }, 100);
    };

    const saveQuizState = () => {
        if (phase === 'quiz') {
            const stateToSave = { quizQuestions, currentQ, scoreInfo, elapsed };
            localStorage.setItem('astrosera_quiz_state', JSON.stringify(stateToSave));
        }
    };

    const handlePauseAndExit = () => {
        saveQuizState();
        if (timerRef.current) clearInterval(timerRef.current);
        navigate('/');
    };

    // 3. Handle Answer
    const handlePick = (optionText) => {
        if (selectedOption || phase !== 'quiz') return; // Prevent multiple clicks
        
        setSelectedOption(optionText);
        const q = quizQuestions[currentQ];
        const isCorrect = optionText === q.correctAnswer;
        
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            setScoreInfo(prev => ({
                ...prev,
                correctCount: prev.correctCount + 1
            }));
        }

        // Wait, then move to next
        setTimeout(() => {
            const next = currentQ + 1;
            if (next < quizQuestions.length) {
                setCurrentQ(next);
                setSelectedOption(null);
                setFeedback(null);
            } else {
                finishQuiz(scoreInfo.correctCount + (isCorrect ? 1 : 0), quizQuestions.length);
            }
        }, 1500); // Wait 1.5s to show feedback
    };

    // Auto-finish on timer end
    useEffect(() => {
        if (phase === 'quiz' && elapsed >= QUIZ_TIME_LIMIT_MS) {
            finishQuiz(scoreInfo.correctCount, quizQuestions.length);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elapsed, phase]);

    // 4. Finish Quiz
    const finishQuiz = useCallback(async (finalCorrectCount, totalCount) => {
        if (timerRef.current) clearInterval(timerRef.current);
        const timeTakenMs = Math.min(Date.now() - startTimeRef.current, QUIZ_TIME_LIMIT_MS);
        
        const finalScore = totalCount > 0 ? Math.round((finalCorrectCount / totalCount) * 100) : 0;
        const fullMarks = finalScore === 100;

        setScoreInfo({
            score: finalScore,
            correctCount: finalCorrectCount,
            total: totalCount,
            timeTakenMs,
            fullMarks
        });

        localStorage.removeItem('astrosera_quiz_state');
        setSavedState(null);

        // Submit to Gamification backend
        if (userId) {
            try {
                await fetch(`${API}/gamification/record-interaction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId,
                        isQuiz: true,
                        quizScore: finalScore,
                        timeTakenMs,
                        fullMarks,
                    }),
                });
            } catch (error) {
                console.error('Failed to sync score:', error);
            }
        }

        setPhase('result');
    }, [userId]);

    // 5. Restart Helper
    const restart = () => {
        setPhase('briefing');
        setScoreInfo({ score: 0, correctCount: 0, timeTakenMs: 0, fullMarks: false });
    };

    // Formatter
    const formatTime = (ms) => {
        const total = Math.floor(Math.max(0, ms) / 1000);
        const m = Math.floor(total / 60);
        const s = total % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    // ── RENDER ────────────────────────────────────────────────────────

    // Loading
    if (phase === 'loading') {
        return (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex items-center justify-center font-outfit">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
                <div className="relative z-10 backdrop-blur-xl bg-black/40 border border-white/20 rounded-3xl p-10 flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
                    <p className="text-xl text-purple-200 tracking-wider font-semibold animate-pulse">Establishing Comms Link...</p>
                </div>
            </div>
        );
    }

    // Error
    if (phase === 'error') {
        return (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex items-center justify-center font-outfit">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0"></div>
                <div className="relative z-10 backdrop-blur-xl bg-black/40 border border-white/20 rounded-3xl border-red-500/30 p-10 max-w-lg text-center">
                    <h2 className="text-4xl text-red-400 font-bold mb-4 drop-shadow-[0_0_10px_rgba(248,113,113,0.8)]">⚠️ Mission Aborted</h2>
                    <p className="text-white mb-8 text-lg">{loadError}</p>
                    <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-600/80 hover:bg-red-500 text-white rounded-full font-bold uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.8)]">
                        Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    // Mission Briefing
    if (phase === 'briefing') {
        return (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex items-center justify-center font-outfit p-4 pt-24 pb-12">
                <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-purple-900/40 z-0 mix-blend-multiply"></div>
                
                <div className="relative z-10 w-full max-w-2xl backdrop-blur-xl bg-black/40 border border-white/20 rounded-3xl p-8 md:p-12 text-center animate-fade-in-up">
                    <div className="inline-block px-4 py-1 rounded-full bg-blue-500/20 text-blue-300 font-bold text-sm tracking-widest uppercase mb-6 border border-blue-500/30">
                        Top Secret
                    </div>
                    
                    <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-300 to-pink-400 mb-6 drop-shadow-lg">
                        MISSION BRIEFING
                    </h1>
                    
                    <div className="space-y-4 text-gray-300 text-lg mb-10 text-left bg-black/40 p-6 rounded-2xl border border-white/10">
                        <p>Welcome, Commander. Your knowledge parameter tests are ready.</p>
                        <ul className="list-disc list-inside space-y-2 ml-2 text-blue-100/80">
                            <li><strong className="text-purple-300">Objective:</strong> Complete the celestial questionnaire.</li>
                            <li><strong className="text-purple-300">Rules:</strong> Navigation is strictly ONE-WAY. You cannot go back.</li>
                            <li><strong className="text-purple-300">Fuel:</strong> You have {Math.floor(QUIZ_TIME_LIMIT_MS / 60000)} minutes of life support fuel to complete the mission.</li>
                        </ul>
                        <p className="mt-4 text-yellow-300/80 italic text-sm text-center">Your performance will be permanently recorded in the central database.</p>
                    </div>

                    {savedState ? (
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button 
                                onClick={resumeMission}
                                className="group relative px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full font-bold text-xl uppercase tracking-widest overflow-hidden shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    Continue Mission <span className="ml-3 group-hover:translate-x-2 transition-transform">▶</span>
                                </span>
                            </button>
                            <button 
                                onClick={startMission}
                                className="group relative px-8 py-4 bg-gray-800 border border-gray-600 rounded-full font-bold text-lg uppercase tracking-widest overflow-hidden transition-all duration-300 hover:bg-red-900/50 hover:border-red-500"
                            >
                                <span className="relative z-10">Abort & Restart</span>
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={startMission}
                            className="group relative px-10 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-xl uppercase tracking-widest overflow-hidden shadow-[0_0_40px_rgba(147,51,234,0.4)] hover:shadow-[0_0_60px_rgba(147,51,234,0.6)] transition-all duration-300 hover:scale-105"
                        >
                            <span className="relative z-10 flex items-center justify-center">
                                Launch Mission <span className="ml-3 group-hover:translate-x-2 transition-transform">🚀</span>
                            </span>
                            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </button>
                    )}
                    
                    {!userId && (
                        <p className="mt-6 text-red-400 text-sm bg-red-900/20 inline-block px-4 py-1 rounded-full border border-red-500/20">
                            Warning: Guest Mode. Logs will not be saved.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // Result
    if (phase === 'result') {
        const { score, correctCount, total, timeTakenMs, fullMarks } = scoreInfo;
        const gradeColor = score >= 80 ? 'text-green-400 shadow-green-400/50' : score >= 50 ? 'text-yellow-400 shadow-yellow-400/50' : 'text-red-400 shadow-red-400/50';

        return (
            <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-fixed flex items-center justify-center font-outfit p-4 pt-24 pb-12">
                <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-0"></div>
                
                <div className="relative z-10 w-full max-w-2xl backdrop-blur-xl bg-black/40 border border-white/20 rounded-3xl p-8 md:p-12 text-center animate-fade-in-up">
                    <h2 className="text-4xl font-bold text-white mb-2 tracking-wider">MISSION REPORT</h2>
                    <div className="h-1 w-24 bg-purple-500 mx-auto rounded-full mb-10 shadow-[0_0_10px_purple]"></div>

                    <div className={`w-40 h-40 mx-auto rounded-full border-8 bg-black/50 flex flex-col items-center justify-center mb-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] ${gradeColor.split(' ')[0].replace('text-', 'border-')}`}>
                        <span className={`text-5xl font-extrabold ${gradeColor.split(' ')[0]}`}>{score}%</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Accuracy</p>
                            <p className="text-2xl font-bold text-white">{correctCount} <span className="text-gray-500 text-lg">/ {total}</span></p>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Time</p>
                            <p className="text-2xl font-bold text-white">{formatTime(timeTakenMs)}</p>
                        </div>
                    </div>

                    <div className="space-y-3 mb-10 text-left">
                        {fullMarks && <div className="bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 px-4 py-3 rounded-lg flex items-center"><span className="text-2xl mr-3">🌟</span> Flawless Execution! Bonus Badge Awarded.</div>}
                        {timeTakenMs < QUIZ_TIME_LIMIT_MS && score >= 50 && <div className="bg-blue-500/20 border border-blue-500/40 text-blue-300 px-4 py-3 rounded-lg flex items-center"><span className="text-2xl mr-3">⚡</span> Speed Demon! Completed before life support failure.</div>}
                        {userId 
                            ? <div className="bg-green-500/20 border border-green-500/40 text-green-300 px-4 py-3 rounded-lg flex items-center"><span className="text-2xl mr-3">💾</span> Telemetry saved to main datacore. Streak updated.</div>
                            : <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-4 py-3 rounded-lg flex items-center"><span className="text-2xl mr-3">⚠️</span> Guest account. Data purged.</div>
                        }
                    </div>

                    <button 
                        onClick={restart}
                        className="px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full font-bold text-white tracking-widest uppercase transition-all hover:scale-105"
                    >
                        Return to Base
                    </button>
                </div>
            </div>
        );
    }

    // Quiz Phase
    const q = quizQuestions[currentQ];
    const fuelPct = Math.max(0, 100 - (elapsed / QUIZ_TIME_LIMIT_MS) * 100);
    const timeLeftMs = Math.max(0, QUIZ_TIME_LIMIT_MS - elapsed);
    
    // Mars Distance Progress (0 to 100%)
    const marsDistancePct = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
    
    // UI states
    const isFeedbackShowing = feedback !== null;
    const bodyShakeClass = isFeedbackShowing && feedback === 'incorrect' ? 'animate-screen-shake' : '';

    return (
        <div className={`min-h-screen bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center bg-fixed font-outfit p-4 flex flex-col pt-24 pb-12 transition-transform duration-75 ${bodyShakeClass}`}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl z-0"></div>
            
            <div className="relative z-10 w-full max-w-4xl mx-auto flex-1 flex flex-col">
                {/* Distance to Mars Progress */}
                <div className="mb-8 hidden sm:block">
                    <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                        <span>Earth</span>
                        <span className="text-orange-400">Distance to Mars: {marsDistancePct.toFixed(0)}%</span>
                        <span>Mars</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden relative">
                        <div 
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500 transition-all duration-1000 ease-out"
                            style={{ width: `${marsDistancePct}%` }}
                        ></div>
                        {/* Little ship icon moving along */}
                        <div 
                            className="absolute top-1/2 -translate-y-1/2 text-[10px] transition-all duration-1000 ease-out z-10 filter drop-shadow-[0_0_5px_white]"
                            style={{ left: `calc(${marsDistancePct}% - 8px)` }}
                        >🚀</div>
                    </div>
                </div>

                {/* HUD Header */}
                <header className="backdrop-blur-xl bg-black/40 border border-white/20 rounded-3xl px-6 py-4 mb-6 flex flex-col sm:flex-row justify-between items-center sm:bg-black/50 sm:border-b-0 sm:rounded-b-none sm:rounded-t-3xl gap-4 sm:gap-0">
                    <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start space-x-4">
                        <button
                            onClick={handlePauseAndExit}
                            disabled={selectedOption !== null}
                            className={`flex flex-shrink-0 items-center text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-md border transition-colors ${
                                selectedOption !== null 
                                    ? 'bg-gray-800/50 text-gray-500 border-gray-700 cursor-not-allowed' 
                                    : 'bg-white/5 text-gray-300 border-white/20 hover:bg-white/10 hover:text-white cursor-pointer'
                            }`}
                        >
                            <span className="mr-2">⬅</span> Pause
                        </button>
                        <div className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-3 py-1 rounded-md text-sm font-bold tracking-widest whitespace-nowrap">
                            SECTOR {currentQ + 1} / {totalQuestions}
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
                        <span className="text-gray-400 text-xs font-bold tracking-widest uppercase">Fuel Level</span>
                        <div className="w-32 sm:w-48 h-3 bg-red-900/50 rounded-full overflow-hidden border border-red-500/20">
                            <div 
                                className={`h-full transition-all duration-100 linear ${fuelPct < 20 ? 'bg-red-500 animate-pulse' : fuelPct < 50 ? 'bg-yellow-500' : 'bg-green-400'}`}
                                style={{ width: `${fuelPct}%` }}
                            ></div>
                        </div>
                        <span className={`font-mono text-sm font-bold w-12 text-right ${fuelPct < 20 ? 'text-red-400' : 'text-gray-300'}`}>
                            {formatTime(timeLeftMs)}
                        </span>
                    </div>
                </header>

                {/* Question Area */}
                <main className="glass-panel p-6 sm:p-10 flex-1 flex flex-col justify-center rounded-t-none bg-black/40 border-t-0 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                    
                    {/* Background decor */}
                    <div className="absolute top-[-50%] left-[-10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.05)_0%,transparent_60%)] pointer-events-none"></div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-white leading-relaxed mb-10 text-center drop-shadow-md z-10">
                        {q.questionText}
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 z-10 mt-auto">
                        {q.options.map((opt, i) => {
                            let itemClass = "bg-white/5 border-white/10 hover:bg-white/10 hover:border-purple-500/50 text-gray-200";
                            
                            if (isFeedbackShowing) {
                                if (opt === q.correctAnswer) {
                                    // Always highlight correct answer in neon green
                                    itemClass = "bg-green-500/20 border-green-400 text-green-300 shadow-[0_0_20px_rgba(74,222,128,0.4)]";
                                } else if (selectedOption === opt) {
                                    // Highlight wrong selected answer in red
                                    itemClass = "bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse-fast";
                                } else {
                                    // Fade others
                                    itemClass = "bg-black/40 border-white/5 text-gray-600 opacity-50";
                                }
                            } else if (selectedOption) {
                                // Waiting state (shouldn't really hit this due to immediate feedback, but just in case)
                                itemClass = "bg-black/40 border-white/5 text-gray-600 opacity-50";
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handlePick(opt)}
                                    disabled={selectedOption !== null}
                                    className={`relative px-6 py-5 rounded-2xl border-2 text-left font-medium transition-all duration-300 transform outline-none flex items-center ${
                                        !selectedOption ? 'hover:-translate-y-1 hover:shadow-lg focus:ring-2 focus:ring-purple-500' : 'cursor-default'
                                    } ${itemClass}`}
                                >
                                    <span className="w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center mr-4 text-xs font-bold text-gray-400 shrink-0">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    <span className="text-lg leading-snug">{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Member3;
