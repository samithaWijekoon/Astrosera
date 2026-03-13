import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './member3.css';

const API                = 'http://localhost:5001/api';
const QUIZ_TIME_LIMIT_MS = 120_000; // 2 minutes

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

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

/* ── Stars (memoised) ────────────────────────────────────────────────────── */
const Stars = () => {
    const stars = useMemo(() =>
        Array.from({ length: 80 }, (_, i) => ({
            id: i,
            top:  `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2 + 0.5,
            dur:  `${Math.random() * 4 + 2}s`,
            delay:`${Math.random() * 5}s`,
            opacity: Math.random() * 0.5 + 0.15,
        })), []);
    return (
        <>
            {stars.map(s => (
                <span key={s.id} className="star" style={{
                    top: s.top, left: s.left,
                    width: s.size, height: s.size,
                    opacity: s.opacity,
                    '--dur': s.dur, '--delay': s.delay
                }} />
            ))}
        </>
    );
};

/* ── Planets (background decoration) ────────────────────────────────────── */
const SpacePlanets = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Gas giant top-right — scaled down to not intrude on content */}
        <div className="absolute rounded-full hidden sm:block" style={{
            width: 220, height: 220, top: '-50px', right: '-50px',
            background: 'radial-gradient(circle at 35% 35%, #7c3aed44, #1e0a4a66 60%, #00000099)',
            boxShadow: '0 0 60px rgba(124,58,237,0.15), inset -15px -12px 30px rgba(0,0,0,0.6)',
        }}>
            <div className="absolute" style={{
                top:'42%', left:'-30%', width:'160%', height:'16%',
                borderRadius:'50%', border:'2px solid rgba(139,92,246,0.2)',
                transform:'rotateX(75deg)',
            }} />
        </div>
        {/* Teal planet bottom-left */}
        <div className="absolute rounded-full hidden md:block" style={{
            width: 110, height: 110, bottom: '60px', left: '-30px',
            background: 'radial-gradient(circle at 30% 30%, #0891b244, #0c4a6e66 55%, #00000099)',
            boxShadow: '0 0 40px rgba(8,145,178,0.12)',
            animation: 'drift 12s ease-in-out infinite alternate',
        }} />
        {/* Tiny moon */}
        <div className="absolute rounded-full hidden sm:block" style={{
            width: 12, height: 12, top: '55px', right: '130px',
            background: 'radial-gradient(circle at 30% 30%, #c4b5fd, #4c1d95)',
            boxShadow: '0 0 10px rgba(196,181,253,0.4)',
            animation: 'drift 8s ease-in-out infinite alternate',
        }} />
        {/* Nebula colour wash */}
        <div className="nebula-orb" style={{ width: 420, height: 420, top: '-80px', left: '-120px', background: 'rgba(109,40,217,0.12)', animationDelay: '0s' }} />
        <div className="nebula-orb" style={{ width: 320, height: 320, bottom: '-60px', right: '-80px', background: 'rgba(6,182,212,0.09)', animationDelay: '4s' }} />
    </div>
);

/* ── Shared backdrop ─────────────────────────────────────────────────────── */
const SpaceBackdrop = () => (
    <div className="fixed inset-0 z-0 bg-[#03030e] overflow-hidden">
        <Stars />
        <SpacePlanets />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#03030e_100%)] pointer-events-none" />
    </div>
);

/* ══════════════════════════════════════════════════════════════════════════
   QUIZ COMPONENT
══════════════════════════════════════════════════════════════════════════ */
const Member3 = () => {
    const navigate = useNavigate();
    const [phase,          setPhase]          = useState('loading');
    const [allQuestions,   setAllQuestions]   = useState([]);
    const [quizQuestions,  setQuizQuestions]  = useState([]);
    const [currentQ,       setCurrentQ]       = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback,       setFeedback]       = useState(null);
    const [loadError,      setLoadError]      = useState(null);
    const [savedState,     setSavedState]     = useState(null);
    const [scoreInfo,      setScoreInfo]      = useState({ score:0, correctCount:0, timeTakenMs:0, fullMarks:false });
    const [elapsed,        setElapsed]        = useState(0);

    const timerRef     = useRef(null);
    const startTimeRef = useRef(null);

    const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
    const token  = sessionStorage.getItem('token')  || localStorage.getItem('token');

    const totalQuestions  = quizQuestions.length;
    const marsDistancePct = totalQuestions > 0 ? (currentQ / totalQuestions) * 100 : 0;
    const fuelPct         = Math.max(0, 100 - (elapsed / QUIZ_TIME_LIMIT_MS) * 100);
    const timeLeftMs      = Math.max(0, QUIZ_TIME_LIMIT_MS - elapsed);

    /* ── Restore saved state ─────────────────────────────────────── */
    useEffect(() => {
        const raw = localStorage.getItem('astrosera_quiz_state');
        if (raw) try { setSavedState(JSON.parse(raw)); } catch { localStorage.removeItem('astrosera_quiz_state'); }
    }, []);

    /* ── Fetch questions ─────────────────────────────────────────── */
    useEffect(() => {
        const load = async () => {
            try {
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res  = await fetch(`${API}/quiz`, { headers });
                if (!res.ok) throw new Error(`Server error ${res.status}`);
                const data = await res.json();
                if (!Array.isArray(data) || !data.length) throw new Error('No questions in the database.');
                setAllQuestions(data);
                setPhase('briefing');
            } catch (e) { setLoadError(e.message); setPhase('error'); }
        };
        load();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [token]);

    /* ── Timer helpers ───────────────────────────────────────────── */
    const startTimer = (from = 0) => {
        startTimeRef.current = Date.now() - from;
        timerRef.current = setInterval(() => setElapsed(Date.now() - startTimeRef.current), 100);
    };
    const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

    /* ── Start fresh ─────────────────────────────────────────────── */
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
        setScoreInfo({ score: 0, correctCount: 0, timeTakenMs: 0, fullMarks: false });
        setPhase('quiz');
        startTimer(0);
    };

    /* ── Resume ──────────────────────────────────────────────────── */
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

    /* ── Pause & exit ────────────────────────────────────────────── */
    const handlePause = () => {
        if (phase !== 'quiz') return;
        stopTimer();
        localStorage.setItem('astrosera_quiz_state', JSON.stringify({ quizQuestions, currentQ, scoreInfo, elapsed }));
        navigate('/');
    };

    /* ── Pick answer ─────────────────────────────────────────────── */
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
        }, 1400);
    };

    /* ── Auto-finish on timeout ──────────────────────────────────── */
    useEffect(() => {
        if (phase === 'quiz' && elapsed >= QUIZ_TIME_LIMIT_MS)
            finishQuiz(scoreInfo.correctCount, quizQuestions.length);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elapsed, phase]);

    /* ── Finish ──────────────────────────────────────────────────── */
    const finishQuiz = useCallback(async (finalCount, total) => {
        stopTimer();
        const timeTakenMs = Math.min(Date.now() - startTimeRef.current, QUIZ_TIME_LIMIT_MS);
        const finalScore  = total > 0 ? Math.round((finalCount / total) * 100) : 0;
        const fullMarks   = finalScore === 100;
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

    /* ── Restart ─────────────────────────────────────────────────── */
    const restart = () => { setScoreInfo({ score:0, correctCount:0, timeTakenMs:0, fullMarks:false }); setPhase('briefing'); };

    /* ════════════════════════════════════════════════════════════════
       PHASE: LOADING
    ════════════════════════════════════════════════════════════════ */
    if (phase === 'loading') return (
        <div className="relative min-h-screen flex items-center justify-center font-outfit overflow-hidden">
            <SpaceBackdrop />
            <div className="relative z-10 flex flex-col items-center gap-4 animate-fade-in-scale px-4 text-center">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-t-purple-400 border-purple-500/20 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-b-cyan-400 border-cyan-500/20 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    <div className="absolute inset-[30%] rounded-full bg-purple-500/30 blur-sm animate-pulse" />
                </div>
                <p className="text-sm text-purple-300/70 tracking-[0.2em] uppercase animate-pulse">Establishing Uplink…</p>
            </div>
        </div>
    );

    /* ════════════════════════════════════════════════════════════════
       PHASE: ERROR
    ════════════════════════════════════════════════════════════════ */
    if (phase === 'error') return (
        <div className="relative min-h-screen flex items-center justify-center font-outfit p-4 overflow-hidden">
            <SpaceBackdrop />
            <div className="relative z-10 max-w-sm w-full text-center animate-fade-in-up">
                <p className="text-5xl mb-4">🛸</p>
                <h2 className="text-xl font-bold text-red-400 tracking-widest mb-2">SIGNAL LOST</h2>
                <p className="text-gray-400 mb-6 text-sm leading-relaxed">{loadError}</p>
                <button onClick={() => window.location.reload()}
                    className="px-6 py-2.5 rounded-full text-sm font-semibold tracking-widest uppercase border border-red-500/40 text-red-400 hover:bg-red-500/10 active:scale-95 transition-all">
                    Retry
                </button>
            </div>
        </div>
    );

    /* ════════════════════════════════════════════════════════════════
       PHASE: BRIEFING
    ════════════════════════════════════════════════════════════════ */
    if (phase === 'briefing') return (
        <div className="relative min-h-screen flex items-center justify-center font-outfit p-4 py-8 overflow-hidden">
            <SpaceBackdrop />

            <div className="relative z-10 w-full max-w-md mx-auto animate-fade-in-up">
                <div className="relative bg-white/[0.04] border border-white/[0.10] rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden backdrop-blur-md shadow-[0_8px_60px_rgba(109,40,217,0.2)]">
                    <div className="scan-beam" />

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-purple-500/15 border border-purple-500/25 rounded-2xl mb-4 text-3xl">🚀</div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-indigo-300">
                            MISSION BRIEFING
                        </h1>
                        <div className="mt-2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                        <p className="mt-3 text-gray-400 text-sm leading-relaxed">10 astronomy questions · 2-minute fuel limit</p>
                    </div>

                    {/* Rules */}
                    <div className="grid grid-cols-1 gap-2 mb-6">
                        {[
                            { icon: '🌌', label: 'Objective',  text: 'Complete all astronomy questions.' },
                            { icon: '⛽', label: 'Fuel',       text: '2-minute life support timer.' },
                            { icon: '🔒', label: 'Navigation', text: 'One-way — no going back.' },
                        ].map(r => (
                            <div key={r.label} className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/[0.07]">
                                <span className="text-lg shrink-0">{r.icon}</span>
                                <div className="min-w-0">
                                    <span className="text-purple-300 font-semibold text-xs">{r.label}: </span>
                                    <span className="text-gray-400 text-xs">{r.text}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paused banner */}
                    {savedState && (
                        <div className="mb-4 bg-amber-500/10 border border-amber-500/25 rounded-xl px-4 py-3 flex items-center gap-3">
                            <span className="text-xl">⏸</span>
                            <p className="text-amber-300 text-sm font-semibold">
                                Paused at Q{savedState.currentQ + 1} of {savedState.quizQuestions?.length}
                            </p>
                        </div>
                    )}

                    {/* CTA Buttons */}
                    <div className="flex flex-col gap-3">
                        {savedState && (
                            <button onClick={resumeMission}
                                className="w-full py-3.5 rounded-xl font-bold tracking-wider text-sm uppercase bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_24px_rgba(16,185,129,0.3)] active:scale-[0.98] transition-all">
                                ▶ Continue Mission
                            </button>
                        )}
                        <button onClick={startMission}
                            className={`w-full py-3.5 rounded-xl font-bold tracking-wider text-sm uppercase active:scale-[0.98] transition-all ${
                                savedState
                                    ? 'border border-white/10 bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.07]'
                                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_28px_rgba(124,58,237,0.4)]'
                            }`}>
                            {savedState ? '↺ Start Over' : '🚀 Launch Mission'}
                        </button>
                    </div>

                    {!userId && (
                        <p className="mt-4 text-center text-xs text-amber-500/70">
                            ⚠ Sign in to save your score
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    /* ════════════════════════════════════════════════════════════════
       PHASE: RESULT
    ════════════════════════════════════════════════════════════════ */
    if (phase === 'result') {
        const { score, correctCount, total, timeTakenMs, fullMarks } = scoreInfo;
        const scoreColor = score >= 80 ? '#4ade80' : score >= 50 ? '#facc15' : '#f87171';
        const scoreLabel = score >= 80 ? 'Excellent! 🎉' : score >= 50 ? 'Good Job! 👍' : 'Keep Training 💪';

        return (
            <div className="relative min-h-screen flex items-center justify-center font-outfit p-4 py-8 overflow-hidden">
                <SpaceBackdrop />
                <div className="relative z-10 w-full max-w-md mx-auto animate-fade-in-up">
                    <div className="relative bg-white/[0.04] border border-white/[0.10] rounded-2xl sm:rounded-3xl p-6 sm:p-8 overflow-hidden backdrop-blur-md shadow-[0_8px_60px_rgba(109,40,217,0.2)]">
                        <div className="scan-beam" />

                        {/* Header */}
                        <div className="text-center mb-6">
                            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-1">Mission Complete</p>
                            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-widest text-white">MISSION REPORT</h2>
                            <div className="mt-2 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                        </div>

                        {/* Score ring */}
                        <div className="flex flex-col items-center mb-6">
                            <div className="relative w-32 h-32">
                                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                                    <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor}
                                        strokeWidth="10" strokeLinecap="round"
                                        strokeDasharray={`${(score / 100) * 314} 314`}
                                        style={{ filter: `drop-shadow(0 0 6px ${scoreColor})`, transition: 'stroke-dasharray 1.2s ease' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-extrabold" style={{ color: scoreColor }}>{score}%</span>
                                </div>
                            </div>
                            <p className="mt-2 text-base font-semibold text-gray-300">{scoreLabel}</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-5">
                            {[
                                { icon: '🎯', label: 'Correct', val: `${correctCount} / ${total}` },
                                { icon: '⏱', label: 'Time',    val: formatTime(timeTakenMs) },
                            ].map(s => (
                                <div key={s.label} className="bg-white/[0.03] border border-white/[0.07] rounded-xl px-3 py-4 text-center">
                                    <p className="text-lg mb-1">{s.icon}</p>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">{s.label}</p>
                                    <p className="text-lg font-bold text-white">{s.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Badges */}
                        <div className="flex flex-col gap-2 mb-6">
                            {fullMarks && <div className="flex items-center gap-2 text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-3 py-2"><span>🌟</span> Perfect score!</div>}
                            {timeTakenMs < QUIZ_TIME_LIMIT_MS && score >= 50 && <div className="flex items-center gap-2 text-sm text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-3 py-2"><span>⚡</span> Completed under 2 min!</div>}
                            {userId
                                ? <div className="flex items-center gap-2 text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2"><span>💾</span> Score saved to your profile.</div>
                                : <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2"><span>⚠</span> Sign in to save scores.</div>
                            }
                        </div>

                        <button onClick={restart}
                            className="w-full py-3.5 rounded-xl font-bold tracking-wider text-sm uppercase text-white border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] active:scale-[0.98] transition-all">
                            ↩ Return to Base
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ════════════════════════════════════════════════════════════════
       PHASE: QUIZ
    ════════════════════════════════════════════════════════════════ */
    const q            = quizQuestions[currentQ];
    const isFeedback   = feedback !== null;
    const shakeClass   = isFeedback && feedback === 'incorrect' ? 'animate-screen-shake' : '';

    return (
        <div className={`relative min-h-screen flex flex-col font-outfit overflow-hidden ${shakeClass}`}>
            <SpaceBackdrop />

            {/* ── Sticky top bar (mobile-safe) ── */}
            <div className="relative z-20 w-full bg-black/60 backdrop-blur-md border-b border-white/[0.06] px-4 py-3">
                <div className="max-w-2xl mx-auto flex items-center gap-3">

                    {/* Pause */}
                    <button
                        onClick={handlePause}
                        disabled={!!selectedOption}
                        className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-2 rounded-lg border transition-all ${
                            selectedOption ? 'border-white/5 text-gray-700 cursor-not-allowed' : 'border-white/10 text-gray-400 hover:text-purple-300 hover:border-purple-500/40 cursor-pointer active:scale-95'
                        }`}>
                        <span className="text-sm">←</span>
                        <span className="hidden xs:inline">Pause</span>
                    </button>

                    {/* Mars progress bar (fills available space) */}
                    <div className="flex-1 flex flex-col gap-1 min-w-0">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] tracking-widest text-gray-600 uppercase">Q {currentQ + 1} / {totalQuestions}</span>
                            <span className="text-[9px] tracking-widest text-orange-500/60 uppercase">Mars {marsDistancePct.toFixed(0)}%</span>
                        </div>
                        <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-400 rounded-full transition-[width] duration-700"
                                style={{ width: `${marsDistancePct}%` }} />
                        </div>
                    </div>

                    {/* Fuel */}
                    <div className="flex-shrink-0 flex items-center gap-1.5">
                        <div className="w-16 sm:w-24 h-2 bg-white/5 rounded-full overflow-hidden border border-white/[0.06]">
                            <div className="h-full rounded-full transition-[width] ease-linear duration-100"
                                style={{
                                    width: `${fuelPct}%`,
                                    background: fuelPct < 20 ? '#ef4444' : fuelPct < 50 ? '#eab308' : '#22c55e',
                                    boxShadow: fuelPct < 20 ? '0 0 6px rgba(239,68,68,0.7)' : fuelPct < 50 ? '0 0 5px rgba(234,179,8,0.5)' : '0 0 5px rgba(34,197,94,0.5)',
                                    animation: fuelPct < 20 ? 'flicker 0.8s linear infinite' : 'none',
                                }}
                            />
                        </div>
                        <span className={`font-mono text-xs font-bold w-9 text-right ${fuelPct < 20 ? 'text-red-400' : 'text-gray-500'}`}>
                            {formatTime(timeLeftMs)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Main quiz content ── */}
            <div className="relative z-10 flex-1 flex flex-col justify-between px-4 py-5 sm:py-8">
                <div className="max-w-2xl mx-auto w-full flex flex-col flex-1 gap-4">

                    {/* Question card */}
                    <div className="relative flex-1 bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5 sm:p-8 overflow-hidden backdrop-blur-sm shadow-[0_4px_40px_rgba(0,0,0,0.4)] flex flex-col">
                        <div className="scan-beam" />
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.05),transparent_60%)] pointer-events-none" />

                        {/* Sector label */}
                        <p className="text-[10px] tracking-[0.25em] text-purple-400/60 uppercase mb-3">
                            Sector {currentQ + 1} — Question
                        </p>

                        {/* Question */}
                        <h2 className="relative z-10 text-base sm:text-xl font-semibold text-white leading-relaxed mb-6 flex-1">
                            {q.questionText}
                        </h2>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 relative z-10">
                            {q.options.map((opt, i) => {
                                let cls = 'bg-white/[0.04] border-white/[0.08] text-gray-200 hover:bg-white/[0.08] hover:border-purple-500/40';
                                if (isFeedback) {
                                    if (opt === q.correctAnswer)        cls = 'bg-emerald-500/15 border-emerald-400/60 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,0.25)] animate-correct';
                                    else if (selectedOption === opt)    cls = 'bg-red-500/15 border-red-500/50 text-red-300 shadow-[0_0_16px_rgba(239,68,68,0.2)] animate-pulse-fast';
                                    else                                cls = 'bg-white/[0.02] border-white/[0.04] text-gray-600 opacity-40';
                                } else if (selectedOption)              cls = 'bg-white/[0.02] border-white/[0.04] text-gray-600 opacity-40';

                                return (
                                    <button
                                        key={i}
                                        onClick={() => handlePick(opt)}
                                        disabled={!!selectedOption}
                                        style={{ animationDelay: `${i * 55}ms` }}
                                        className={`answer-btn-appear flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left font-medium transition-all duration-200 outline-none min-h-[56px] ${
                                            !selectedOption ? 'active:scale-[0.98] cursor-pointer' : 'cursor-default'
                                        } ${cls}`}
                                    >
                                        <span className="w-7 h-7 shrink-0 rounded-full border border-white/10 bg-black/30 flex items-center justify-center text-[11px] font-bold text-gray-500">
                                            {OPTION_LETTERS[i]}
                                        </span>
                                        <span className="text-sm sm:text-base leading-snug flex-1">{opt}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dot progress */}
                    <div className="flex items-center justify-center gap-2 pb-1">
                        {quizQuestions.map((_, i) => (
                            <div key={i} className="rounded-full transition-all duration-300" style={{
                                width: i === currentQ ? 22 : 7,
                                height: 7,
                                background: i < currentQ
                                    ? '#4ade80'
                                    : i === currentQ
                                    ? 'linear-gradient(90deg,#a78bfa,#818cf8)'
                                    : 'rgba(255,255,255,0.08)',
                            }} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Member3;
