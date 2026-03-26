import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './member3.css';

const backendUrl = process.env.VITE_API_URL;

const API_BASE = backendUrl;

const API = `${API_BASE}`;
const QUIZ_TIME_LIMIT_MS = 120_000;

/* Fisher-Yates */
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const formatTime = (ms) => {
    const s = Math.floor(Math.max(0, ms) / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/* Stars */
const Stars = () => {
    const stars = useMemo(() =>
        Array.from({ length: 90 }, (_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2.2 + 0.4,
            dur: `${(Math.random() * 4 + 2).toFixed(1)}s`,
            delay: `${(Math.random() * 6).toFixed(1)}s`,
            op: (Math.random() * 0.5 + 0.15).toFixed(2),
        })), []);
    return (
        <>
            {stars.map(s => (
                <span key={s.id} className="star-dot" style={{
                    top: s.top, left: s.left,
                    width: s.size, height: s.size,
                    '--base-op': s.op, opacity: s.op,
                    '--dur': s.dur, '--delay': s.delay,
                }} />
            ))}
        </>
    );
};

/* Background scene */
const SpaceScene = () => (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#060614]">
        <Stars />
        {/* Nebula blobs */}
        <div className="nebula-blob" style={{ width: 500, height: 500, top: '-120px', left: '-180px', background: 'rgba(99,60,245,0.18)', '--nb-dur': '12s', '--nb-delay': '0s' }} />
        <div className="nebula-blob" style={{ width: 420, height: 420, bottom: '-80px', right: '-100px', background: 'rgba(6,182,212,0.13)', '--nb-dur': '15s', '--nb-delay': '3s' }} />
        <div className="nebula-blob" style={{ width: 300, height: 300, top: '38%', left: '38%', background: 'rgba(236,72,153,0.09)', '--nb-dur': '10s', '--nb-delay': '6s' }} />

        {/* Gas giant — top right */}
        <div className="absolute rounded-full" style={{
            width: 230, height: 230, top: '-55px', right: '-55px',
            background: 'radial-gradient(circle at 38% 38%, rgba(124,58,237,0.4), rgba(30,10,74,0.5) 55%, rgba(0,0,0,0.7))',
            boxShadow: '0 0 70px rgba(124,58,237,0.18), inset -18px -14px 36px rgba(0,0,0,0.6)',
        }}>
            {/* Ring */}
            <div style={{
                position: 'absolute', top: '42%', left: '-28%',
                width: '156%', height: '16%',
                borderRadius: '50%',
                border: '2px solid rgba(167,139,250,0.22)',
                transform: 'rotateX(74deg)',
            }} />
        </div>

        {/* Tiny moon */}
        <div className="absolute rounded-full" style={{
            width: 13, height: 13, top: '58px', right: '136px',
            background: 'radial-gradient(circle at 35% 35%, #c4b5fd, #4c1d95)',
            boxShadow: '0 0 10px rgba(196,181,253,0.5)',
            animation: 'float 9s ease-in-out infinite',
        }} />

        {/* Small teal planet bottom-left */}
        <div className="absolute rounded-full hidden sm:block" style={{
            width: 100, height: 100, bottom: '70px', left: '-25px',
            background: 'radial-gradient(circle at 32% 32%, rgba(8,145,178,0.45), rgba(12,74,110,0.5) 55%, rgba(0,0,0,0.7))',
            boxShadow: '0 0 40px rgba(8,145,178,0.15)',
            animation: 'float 14s ease-in-out infinite',
        }} />

        {/* Deep radial vignette */}
        <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #060614 90%)' }} />
    </div>
);

/* COMPONENT */
const Member3 = () => {
    const navigate = useNavigate();

    const [phase, setPhase] = useState('loading');
    const [allQuestions, setAllQuestions] = useState([]);
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback, setFeedback] = useState(null);
    const [loadError, setLoadError] = useState(null);
    const [savedState, setSavedState] = useState(null);
    const [scoreInfo, setScoreInfo] = useState({ score: 0, correctCount: 0, timeTakenMs: 0, fullMarks: false, total: 0 });
    const [elapsed, setElapsed] = useState(0);

    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');

    const totalQuestions = quizQuestions.length;
    const progressPct = totalQuestions > 0 ? (currentQ / totalQuestions) * 100 : 0;
    const fuelPct = Math.max(0, 100 - (elapsed / QUIZ_TIME_LIMIT_MS) * 100);
    const timeLeftMs = Math.max(0, QUIZ_TIME_LIMIT_MS - elapsed);
    const fuelColor = fuelPct < 20 ? '#ef4444' : fuelPct < 50 ? '#f59e0b' : '#22c55e';
    const fuelGlow = fuelPct < 20 ? 'rgba(239,68,68,0.7)' : fuelPct < 50 ? 'rgba(245,158,11,0.5)' : 'rgba(34,197,94,0.5)';

    /*  0. Restore saved */
    useEffect(() => {
        const raw = localStorage.getItem('astrosera_quiz_state');
        if (raw) try { setSavedState(JSON.parse(raw)); } catch { localStorage.removeItem('astrosera_quiz_state'); }
    }, []);

    /*  1. Fetch questions */
    useEffect(() => {
        const load = async () => {
            if (!token) {
                setPhase('briefing');
                return;
            }
            try {
                const headers = { Authorization: `Bearer ${token}` };
                const res = await fetch(`${API}/quiz`, { headers });
                if (!res.ok) throw new Error(`Server ${res.status}`);
                const data = await res.json();
                if (!Array.isArray(data) || !data.length) throw new Error('No questions found.');
                setAllQuestions(data);
                setPhase('briefing');
            } catch (e) { setLoadError(e.message); setPhase('error'); }
        };
        load();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [token]);

    /* Timer helpers */
    const startTimer = (from = 0) => {
        startTimeRef.current = Date.now() - from;
        timerRef.current = setInterval(() => setElapsed(Date.now() - startTimeRef.current), 100);
    };
    const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

    /*  Start mission */
    const startMission = () => {
        localStorage.removeItem('astrosera_quiz_state');
        setSavedState(null);
        const mapped = shuffle(allQuestions).slice(0, 10).map(q => ({
            id: q._id || q.questionNo,
            questionText: q.question,
            options: [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
            correctAnswer: q.correctAnswer,
        }));
        setQuizQuestions(mapped);
        setCurrentQ(0); setSelectedOption(null); setFeedback(null);
        setElapsed(0);
        setScoreInfo({ score: 0, correctCount: 0, timeTakenMs: 0, fullMarks: false, total: mapped.length });
        setPhase('quiz');
        startTimer(0);
    };

    /*  Resume */
    const resumeMission = () => {
        if (!savedState) return;
        setQuizQuestions(savedState.quizQuestions);
        setCurrentQ(savedState.currentQ);
        setScoreInfo(savedState.scoreInfo);
        setElapsed(savedState.elapsed);
        setSelectedOption(null); setFeedback(null);
        setPhase('quiz');
        startTimer(savedState.elapsed);
    };

    /* Pause / exit */
    const handlePause = () => {
        if (phase !== 'quiz') return;
        stopTimer();
        localStorage.setItem('astrosera_quiz_state', JSON.stringify({ quizQuestions, currentQ, scoreInfo, elapsed }));
        navigate('/');
    };

    /* Pick answer */
    const handlePick = (opt) => {
        if (selectedOption || phase !== 'quiz') return;
        setSelectedOption(opt);
        const q = quizQuestions[currentQ];
        const isCorrect = opt === q.correctAnswer;
        setFeedback(isCorrect ? 'correct' : 'incorrect');
        const newCount = scoreInfo.correctCount + (isCorrect ? 1 : 0);
        setScoreInfo(p => ({ ...p, correctCount: newCount }));
        setTimeout(() => {
            const next = currentQ + 1;
            if (next < quizQuestions.length) {
                setCurrentQ(next); setSelectedOption(null); setFeedback(null);
            } else {
                finishQuiz(newCount, quizQuestions.length);
            }
        }, 1500);
    };

    /* Auto-submit on timeout */
    useEffect(() => {
        if (phase === 'quiz' && elapsed >= QUIZ_TIME_LIMIT_MS)
            finishQuiz(scoreInfo.correctCount, quizQuestions.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elapsed, phase]);

    /* Finish */
    const finishQuiz = useCallback(async (finalCount, total) => {
        stopTimer();
        const timeTakenMs = Math.min(Date.now() - startTimeRef.current, QUIZ_TIME_LIMIT_MS);
        const finalScore = total > 0 ? Math.round((finalCount / total) * 100) : 0;
        const fullMarks = finalScore === 100;
        setScoreInfo({ score: finalScore, correctCount: finalCount, total, timeTakenMs, fullMarks });
        localStorage.removeItem('astrosera_quiz_state'); setSavedState(null);
        if (userId) {
            try {
                await fetch(`${API}/gamification/record-interaction`, {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, isQuiz: true, quizScore: finalScore, timeTakenMs, fullMarks }),
                });
            } catch (e) { console.error('Score sync failed', e); }
        }
        setPhase('result');
    }, [userId]);

    /* Restart */
    const restart = () => { setScoreInfo({ score: 0, correctCount: 0, timeTakenMs: 0, fullMarks: false, total: 0 }); setPhase('briefing'); };

    /* PHASE: LOADING */
    if (phase === 'loading') return (
        <div className="relative min-h-screen flex items-center justify-center quiz-font overflow-hidden">
            <SpaceScene />
            <div className="relative z-10 flex flex-col items-center gap-5 animate-fade-scale">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-violet-400 animate-spin" />
                    <div className="absolute inset-[5px] rounded-full border-[2px] border-transparent border-b-cyan-400 animate-spin" style={{ animationDuration: '1.4s', animationDirection: 'reverse' }} />
                    <div className="absolute inset-[28%] rounded-full bg-violet-500/20 animate-pulse" />
                </div>
                <p className="text-[11px] text-purple-300/60 tracking-[0.3em] uppercase">Syncing with Command…</p>
            </div>
        </div>
    );

    /* PHASE: ERROR */
    if (phase === 'error') return (
        <div className="relative min-h-screen flex items-center justify-center quiz-font p-4 overflow-hidden">
            <SpaceScene />
            <div className="relative z-10 max-w-sm w-full text-center animate-slide-up">
                <div className="text-5xl mb-5">🛸</div>
                <h2 className="text-xl font-bold text-red-400 tracking-[0.15em] mb-2 uppercase">Signal Lost</h2>
                <p className="text-gray-400 text-sm leading-relaxed mb-7">{loadError}</p>
                <button onClick={() => window.location.reload()}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold tracking-wider uppercase border border-red-500/30 text-red-400 hover:bg-red-500/10 active:scale-95 transition-all">
                    ↻ Retry
                </button>
            </div>
        </div>
    );

    /* PHASE: BRIEFING*/
    if (phase === 'briefing') return (
        <div className="relative min-h-screen flex items-center justify-center quiz-font p-4 py-10 overflow-hidden">
            <SpaceScene />

            <div className="relative z-10 w-full max-w-lg mx-auto animate-slide-up">
                {/* Card */}
                <div className="glass-card rounded-3xl p-7 sm:p-10 overflow-hidden relative">
                    <div className="scan-line" />

                    {/* Glow accent */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-60 rounded-full" />

                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl text-3xl mb-5"
                            style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(99,102,241,0.15))', border: '1px solid rgba(167,139,250,0.3)' }}>
                            🚀
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black tracking-widest text-white mb-1">
                            MISSION{' '}
                            <span className="text-transparent bg-clip-text"
                                style={{ backgroundImage: 'linear-gradient(135deg, #a78bfa, #818cf8)' }}>
                                BRIEFING
                            </span>
                        </h1>
                        <div className="mt-3 h-px mx-auto w-32"
                            style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.6), transparent)' }} />
                        <p className="mt-4 text-gray-400 text-sm">10 questions · 2-minute fuel window · one attempt</p>
                    </div>

                    {/* Mission rules */}
                    <div className="space-y-2.5 mb-7">
                        {[
                            { icon: '🌌', label: 'Objective', desc: 'Answer 10 randomised astronomy questions.' },
                            { icon: '⛽', label: 'Fuel Limit', desc: '2 minutes of life-support fuel.' },
                            { icon: '🔒', label: 'Navigation', desc: 'One-way only — no going back.' },
                        ].map(r => (
                            <div key={r.label}
                                className="flex items-start gap-3.5 px-4 py-3.5 rounded-2xl"
                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <span className="text-xl mt-0.5 shrink-0">{r.icon}</span>
                                <div>
                                    <span className="font-bold text-violet-300 text-sm">{r.label}: </span>
                                    <span className="text-gray-400 text-sm">{r.desc}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paused banner */}
                    {savedState && (
                        <div className="mb-5 px-4 py-3 rounded-2xl flex items-center gap-3"
                            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                            <span className="text-xl">⏸</span>
                            <p className="text-amber-300 text-sm font-semibold">
                                Mission paused at Q{savedState.currentQ + 1}/{savedState.quizQuestions?.length}
                            </p>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="flex flex-col gap-3">
                        {savedState && (
                            <button onClick={resumeMission}
                                className="w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase text-white active:scale-[0.98] transition-all relative overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #059669, #0d9488)', boxShadow: '0 0 28px rgba(5,150,105,0.35)' }}>
                                <span className="relative z-10">▶ Continue Mission</span>
                            </button>
                        )}
                        <button onClick={startMission}
                            className={`w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase text-white active:scale-[0.98] transition-all relative overflow-hidden ${savedState ? 'opacity-70' : ''}`}
                            style={savedState
                                ? { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }
                                : { background: 'linear-gradient(135deg, #7c3aed, #4f46e5)', boxShadow: '0 0 32px rgba(124,58,237,0.4)' }
                            }>
                            <span className="relative z-10">{savedState ? '↺ Start Over' : '🚀 Launch Mission'}</span>
                        </button>
                    </div>

                    {!userId && (
                        <p className="mt-5 text-center text-xs text-amber-400/60">
                            Sign in to save your score and earn badges
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    /* PHASE: RESULT */
    if (phase === 'result') {
        const { score, correctCount, total, timeTakenMs, fullMarks } = scoreInfo;
        const ring = score >= 80 ? '#4ade80' : score >= 50 ? '#f59e0b' : '#f87171';
        const label = score >= 80 ? ['Stellar! 🌟', 'Outstanding performance, Commander!']
            : score >= 50 ? ['Mission Passed 👍', 'Solid work — keep improving!']
                : ['Keep Training 💪', 'The stars demand more practice.'];

        return (
            <div className="relative min-h-screen flex items-center justify-center quiz-font p-4 py-10 overflow-hidden">
                <SpaceScene />
                <div className="relative z-10 w-full max-w-lg mx-auto animate-slide-up">
                    <div className="glass-card rounded-3xl p-7 sm:p-10 overflow-hidden relative">
                        <div className="scan-line" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-full opacity-70"
                            style={{ background: `linear-gradient(90deg, transparent, ${ring}, transparent)` }} />

                        {/* Header */}
                        <div className="text-center mb-6">
                            <p className="text-[10px] tracking-[0.35em] text-gray-500 uppercase mb-1">Mission Complete</p>
                            <h2 className="text-3xl font-black tracking-widest text-white">REPORT</h2>
                            <div className="mt-2 h-px mx-auto w-24 rounded-full"
                                style={{ background: 'linear-gradient(90deg, transparent, rgba(167,139,250,0.5), transparent)' }} />
                        </div>

                        {/* Score ring */}
                        <div className="flex flex-col items-center mb-7">
                            <div className="relative w-36 h-36">
                                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="9" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke={ring} strokeWidth="9"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(score / 100) * 314} 314`}
                                        style={{ filter: `drop-shadow(0 0 8px ${ring})`, animation: 'ring-draw 1.4s cubic-bezier(0.22,1,0.36,1) both' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black leading-none" style={{ color: ring }}>{score}%</span>
                                </div>
                            </div>
                            <p className="mt-2 text-lg font-bold text-white">{label[0]}</p>
                            <p className="text-gray-500 text-xs mt-0.5">{label[1]}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            {[
                                { icon: '🎯', label: 'Correct', val: `${correctCount} / ${total}` },
                                { icon: '⏱', label: 'Time', val: formatTime(timeTakenMs) },
                            ].map(s => (
                                <div key={s.label} className="text-center rounded-2xl py-4 px-3"
                                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                    <p className="text-2xl mb-1">{s.icon}</p>
                                    <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">{s.label}</p>
                                    <p className="text-xl font-black text-white">{s.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Badges */}
                        <div className="space-y-2 mb-7 text-sm">
                            {fullMarks && (
                                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                                    style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)' }}>
                                    <span>🌟</span><span className="text-yellow-300 font-semibold">Perfect score — bonus badge earned!</span>
                                </div>
                            )}
                            {timeTakenMs < QUIZ_TIME_LIMIT_MS && score >= 50 && (
                                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                                    style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)' }}>
                                    <span>⚡</span><span className="text-cyan-300 font-semibold">Speed Demon — under 2 minutes!</span>
                                </div>
                            )}
                            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
                                style={userId
                                    ? { background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.18)' }
                                    : { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}>
                                <span>{userId ? '💾' : '⚠'}</span>
                                <span className={userId ? 'text-emerald-300 font-semibold' : 'text-red-400 font-semibold'}>
                                    {userId ? 'Score saved to your datacore.' : 'Sign in to save your score.'}
                                </span>
                            </div>
                        </div>

                        <button onClick={restart}
                            className="w-full py-4 rounded-2xl font-bold text-sm tracking-widest uppercase text-white active:scale-[0.98] transition-all"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            ↩ Return to Base
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /*  PHASE: QUIZ */
    const q = quizQuestions[currentQ];
    const isFeedback = feedback !== null;
    const shakeClass = isFeedback && feedback === 'incorrect' ? 'animate-screen-shake' : '';

    return (
        <div className={`relative min-h-screen flex flex-col quiz-font overflow-hidden ${shakeClass}`}>
            <SpaceScene />

            {/* TOP HUD */}
            <div className="relative z-20 w-full px-3 sm:px-4 pt-4 pb-3">
                <div className="max-w-2xl mx-auto flex items-center gap-3">

                    {/* Pause */}
                    <button onClick={handlePause} disabled={!!selectedOption}
                        className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all ${selectedOption
                            ? 'text-gray-700 cursor-not-allowed'
                            : 'text-gray-400 hover:text-violet-300 active:scale-95 cursor-pointer'
                            }`}
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <span>←</span>
                        <span className="hidden sm:inline">Back</span>
                    </button>

                    {/* Progress section */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">
                                Q {currentQ + 1} <span className="text-gray-700">/ {totalQuestions}</span>
                            </span>
                            <span className="text-[10px] font-semibold tracking-widest uppercase"
                                style={{ color: 'rgba(249,115,22,0.7)' }}>
                                {progressPct.toFixed(0)}% to Mars
                            </span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="shimmer-bar h-full rounded-full transition-[width] duration-700"
                                style={{ width: `${progressPct}%` }} />
                        </div>
                    </div>

                    {/* Fuel bar */}
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <div className="w-14 sm:w-20 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="h-full rounded-full transition-[width] ease-linear duration-100"
                                style={{
                                    width: `${fuelPct}%`,
                                    background: fuelColor,
                                    boxShadow: `0 0 6px ${fuelGlow}`,
                                    animation: fuelPct < 20 ? 'flicker 0.7s linear infinite' : 'none',
                                }} />
                        </div>
                        <span className={`font-mono text-xs font-bold w-9 text-right tabular-nums ${fuelPct < 20 ? 'text-red-400' : 'text-gray-500'}`}>
                            {formatTime(timeLeftMs)}
                        </span>
                    </div>
                </div>
            </div>

            {/*  CONTENT  */}
            <div className="relative z-10 flex-1 flex flex-col px-3 sm:px-4 pb-5 pt-2">
                <div className="max-w-2xl mx-auto w-full flex flex-col gap-3">

                    {/* Question card */}
                    <div className="glass-card rounded-3xl p-4 sm:p-6 flex flex-col overflow-hidden relative">
                        <div style={{ minHeight: 0 }} />
                        <div className="scan-line" />
                        <div className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.07) 0%, transparent 60%)' }} />

                        {/* Sector badge */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase"
                                style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)', color: '#c4b5fd' }}>
                                ⬡ Sector {currentQ + 1}
                            </span>
                            {/* Small dot indicators */}
                            <div className="flex items-center gap-1">
                                {quizQuestions.map((_, i) => (
                                    <div key={i} className="rounded-full transition-all duration-300"
                                        style={{
                                            width: i === currentQ ? 16 : 5,
                                            height: 5,
                                            background: i < currentQ
                                                ? '#4ade80'
                                                : i === currentQ
                                                    ? 'linear-gradient(90deg,#a78bfa,#818cf8)'
                                                    : 'rgba(255,255,255,0.07)',
                                        }} />
                                ))}
                            </div>
                        </div>

                        {/* Question */}
                        <h2 className="relative z-10 text-base sm:text-lg font-semibold leading-relaxed mb-4"
                            style={{ color: '#4ade80' }}>
                            {q.questionText}
                        </h2>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative z-10">
                            {q.options.map((opt, i) => {
                                const letters = ['A', 'B', 'C', 'D'];
                                let style = {};
                                let extraClass = `option-appear text-sm sm:text-[15px] font-medium text-gray-200`;

                                if (isFeedback) {
                                    if (opt === q.correctAnswer) {
                                        style = { background: 'rgba(34,197,94,0.14)', borderColor: 'rgba(74,222,128,0.65)', color: '#86efac', boxShadow: '0 0 20px rgba(74,222,128,0.25)' };
                                        extraClass += ' animate-success';
                                    } else if (selectedOption === opt) {
                                        style = { background: 'rgba(239,68,68,0.12)', borderColor: 'rgba(239,68,68,0.55)', color: '#fca5a5', boxShadow: '0 0 16px rgba(239,68,68,0.2)' };
                                        extraClass += ' animate-wrong';
                                    } else {
                                        style = { background: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.04)', color: 'rgba(156,163,175,0.45)' };
                                    }
                                } else if (selectedOption) {
                                    style = { background: 'rgba(255,255,255,0.01)', borderColor: 'rgba(255,255,255,0.04)', color: 'rgba(156,163,175,0.45)' };
                                } else {
                                    style = { background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.09)' };
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handlePick(opt)}
                                        disabled={!!selectedOption}
                                        style={{
                                            animationDelay: `${i * 55}ms`,
                                            border: '2px solid', borderRadius: '14px',
                                            padding: '14px 16px', textAlign: 'left',
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            minHeight: '56px',
                                            transition: 'all 0.2s ease',
                                            outline: 'none',
                                            cursor: selectedOption ? 'default' : 'pointer',
                                            ...style,
                                        }}
                                        className={`${extraClass} ${!selectedOption ? 'hover:!border-violet-500/50 hover:!bg-violet-500/10 active:scale-[0.98]' : ''}`}
                                    >
                                        <span className="w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-[10px] font-black"
                                            style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(167,139,250,0.8)' }}>
                                            {letters[i]}
                                        </span>
                                        <span className="leading-snug">{opt}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/*  Feedback hint */}
                    {isFeedback && (
                        <div className="py-2.5 px-4 rounded-xl text-center text-sm font-semibold animate-slide-up"
                            style={feedback === 'correct'
                                ? { background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#86efac' }
                                : { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }
                            }>
                            {feedback === 'correct' ? '✓ Correct! Moving to next sector…' : '✕ Incorrect. Check the highlighted answer.'}
                        </div>
                    )}

                    {/* Live Solar System */}
                    <style>{`
                        @keyframes orb1{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
                        @keyframes orb2{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
                        @keyframes orb3{from{transform:rotate(120deg)}to{transform:rotate(480deg)}}
                        @keyframes ast{from{transform:rotate(0deg)}to{transform:rotate(-360deg)}}
                        @keyframes sunpulse{0%,100%{box-shadow:0 0 18px rgba(251,191,36,.85),0 0 40px rgba(251,191,36,.3);}50%{box-shadow:0 0 30px rgba(251,191,36,1),0 0 60px rgba(251,191,36,.5);}}
                    `}</style>
                    <div className="glass-card rounded-3xl overflow-hidden relative select-none"
                        style={{ height: 160 }}>

                        {/* Stars inside panel */}
                        {Array.from({ length: 16 }, (_, i) => {
                            const top = `${10 + Math.sin(i * 2.3) * 40 + 40}%`;
                            const left = `${5 + ((i * 17) % 90)}%`;
                            const sz = i % 3 === 0 ? 2 : 1;
                            return <div key={i} className="absolute rounded-full bg-white" style={{ width: sz, height: sz, top, left, opacity: 0.25, animation: `twinkle ${2 + i % 3}s ease-in-out infinite ${i * 0.3}s` }} />;
                        })}

                        {/* Asteroid belt */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 220, height: 220, marginTop: -110, marginLeft: -110, borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.06)', animation: 'ast 55s linear infinite' }}>
                            {[0, 60, 120, 180, 240, 300].map(d => (
                                <div key={d} style={{ position: 'absolute', width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', top: '50%', left: '50%', transform: `rotate(${d}deg) translateX(110px) translateY(-1.5px)` }} />
                            ))}
                        </div>

                        {/* Sun */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 28, height: 28, marginTop: -14, marginLeft: -14, borderRadius: '50%', background: 'radial-gradient(circle at 38% 35%, #fef08a, #f59e0b 55%, #b45309)', animation: 'sunpulse 3s ease-in-out infinite' }} />

                        {/* Orbit 1 — blue planet */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 74, height: 74, marginTop: -37, marginLeft: -37, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.05)', animation: 'orb1 3.5s linear infinite' }}>
                            <div style={{ position: 'absolute', top: -5, left: '50%', marginLeft: -5, width: 10, height: 10, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #93c5fd, #1e40af)', boxShadow: '0 0 8px rgba(147,197,253,0.7)' }} />
                        </div>

                        {/* Orbit 2 — red planet */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 124, height: 124, marginTop: -62, marginLeft: -62, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.04)', animation: 'orb2 8s linear infinite' }}>
                            <div style={{ position: 'absolute', top: -7, left: '50%', marginLeft: -7, width: 14, height: 14, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #fca5a5, #b91c1c)', boxShadow: '0 0 10px rgba(252,165,165,0.5)' }} />
                        </div>

                        {/* Orbit 3 — ringed purple planet */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', width: 178, height: 178, marginTop: -89, marginLeft: -89, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.03)', animation: 'orb3 18s linear infinite' }}>
                            <div style={{ position: 'absolute', top: -10, left: '50%', marginLeft: -10, width: 20, height: 20, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #c4b5fd, #6d28d9)', boxShadow: '0 0 12px rgba(196,181,253,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ position: 'absolute', width: 34, height: 8, borderRadius: '50%', border: '2px solid rgba(196,181,253,0.45)', transform: 'rotateX(68deg)' }} />
                            </div>
                        </div>

                        {/* Label */}
                        <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(167,139,250,0.3)' }}>Live Solar System</div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Member3;

