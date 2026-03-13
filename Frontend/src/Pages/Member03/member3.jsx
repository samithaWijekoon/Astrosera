import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './member3.css';

const API               = 'http://localhost:5001/api';
const QUIZ_TIME_LIMIT_MS = 120_000; // 2-minute fuel

/* ─── Fisher-Yates shuffle ─────────────────────────────────────────────── */
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

/* ─── Deterministic star field (memoised so it never re-renders) ────────── */
const Stars = () => {
    const stars = useMemo(() =>
        Array.from({ length: 120 }, (_, i) => ({
            id: i,
            top:   `${Math.random() * 100}%`,
            left:  `${Math.random() * 100}%`,
            size:  Math.random() * 2.5 + 0.5,
            dur:   `${Math.random() * 4 + 2}s`,
            delay: `${Math.random() * 5}s`,
            opacity: Math.random() * 0.6 + 0.2,
        })), []);

    return (
        <>
            {stars.map(s => (
                <span
                    key={s.id}
                    className="star"
                    style={{
                        top: s.top, left: s.left,
                        width: s.size, height: s.size,
                        opacity: s.opacity,
                        '--dur':   s.dur,
                        '--delay': s.delay,
                    }}
                />
            ))}
        </>
    );
};

/* ─── Decorative floating planets ───────────────────────────────────────── */
const SpacePlanets = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large dim gas giant — top-right */}
        <div
            className="absolute rounded-full"
            style={{
                width: 260, height: 260,
                top: '-60px', right: '-60px',
                background: 'radial-gradient(circle at 35% 35%, #7c3aed55, #1e0a4a88 60%, #00000099)',
                boxShadow: '0 0 80px rgba(124,58,237,0.2), inset -20px -15px 40px rgba(0,0,0,0.6)',
            }}
        >
            {/* Ring */}
            <div
                className="absolute"
                style={{
                    top: '42%', left: '-30%',
                    width: '160%', height: '18%',
                    borderRadius: '50%',
                    border: '2px solid rgba(139,92,246,0.25)',
                    transform: 'rotateX(75deg)',
                    boxShadow: '0 0 12px rgba(139,92,246,0.15)',
                }}
            />
        </div>

        {/* Tiny moon — top-right orbiting */}
        <div
            className="absolute rounded-full"
            style={{
                width: 14, height: 14,
                top: '60px', right: '140px',
                background: 'radial-gradient(circle at 30% 30%, #c4b5fd, #4c1d95)',
                boxShadow: '0 0 12px rgba(196,181,253,0.4)',
                animation: 'drift 8s ease-in-out infinite alternate',
            }}
        />

        {/* Medium teal planet — bottom-left */}
        <div
            className="absolute rounded-full"
            style={{
                width: 140, height: 140,
                bottom: '80px', left: '-40px',
                background: 'radial-gradient(circle at 30% 30%, #0891b255, #0c4a6e88 55%, #00000099)',
                boxShadow: '0 0 60px rgba(8,145,178,0.15), inset -10px -10px 30px rgba(0,0,0,0.5)',
                animation: 'drift 12s ease-in-out infinite alternate',
            }}
        />

        {/* Tiny distant reddish dot — mid-left */}
        <div
            className="absolute rounded-full"
            style={{
                width: 48, height: 48,
                top: '40%', left: '4%',
                background: 'radial-gradient(circle at 35% 35%, #f97316aa, #7c2d1288 60%, #00000099)',
                boxShadow: '0 0 20px rgba(249,115,22,0.2)',
                animation: 'drift 16s ease-in-out infinite alternate-reverse',
            }}
        />

        {/* Nebula colour washes */}
        <div className="nebula-orb" style={{ width: 500, height: 500, top: '-100px', left: '-150px',  background: 'rgba(109,40,217,0.15)', animationDelay: '0s'   }} />
        <div className="nebula-orb" style={{ width: 400, height: 400, bottom: '-80px', right: '-100px', background: 'rgba(6,182,212,0.10)',  animationDelay: '4s'   }} />
        <div className="nebula-orb" style={{ width: 300, height: 300, top: '40%',  left: '30%',        background: 'rgba(236,72,153,0.06)', animationDelay: '2s'   }} />
    </div>
);

/* ─── Utility ───────────────────────────────────────────────────────────── */
const formatTime = (ms) => {
    const s = Math.floor(Math.max(0, ms) / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

/* ══════════════════════════════════════════════════════════════════════════
   COMPONENT
══════════════════════════════════════════════════════════════════════════ */
const Member3 = () => {
    const navigate = useNavigate();

    // phases: loading | briefing | quiz | result | error
    const [phase,          setPhase]          = useState('loading');
    const [allQuestions,   setAllQuestions]   = useState([]);
    const [quizQuestions,  setQuizQuestions]  = useState([]);
    const [currentQ,       setCurrentQ]       = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [feedback,       setFeedback]       = useState(null);   // 'correct' | 'incorrect'
    const [loadError,      setLoadError]      = useState(null);
    const [savedState,     setSavedState]     = useState(null);
    const [scoreInfo,      setScoreInfo]      = useState({ score: 0, correctCount: 0, timeTakenMs: 0, fullMarks: false });
    const [elapsed,        setElapsed]        = useState(0);

    const timerRef      = useRef(null);
    const startTimeRef  = useRef(null);

    const userId = sessionStorage.getItem('userId') || localStorage.getItem('userId');
    const token  = sessionStorage.getItem('token')  || localStorage.getItem('token');

    const totalQuestions    = quizQuestions.length;
    const marsDistancePct   = totalQuestions > 0 ? (currentQ / totalQuestions) * 100 : 0;
    const fuelPct           = Math.max(0, 100 - (elapsed / QUIZ_TIME_LIMIT_MS) * 100);
    const timeLeftMs        = Math.max(0, QUIZ_TIME_LIMIT_MS - elapsed);
    const isFeedbackShowing = feedback !== null;

    /* ── 0. Restore saved state on mount ─────────────────────────── */
    useEffect(() => {
        const saved = localStorage.getItem('astrosera_quiz_state');
        if (saved) {
            try { setSavedState(JSON.parse(saved)); }
            catch { localStorage.removeItem('astrosera_quiz_state'); }
        }
    }, []);

    /* ── 1. Fetch questions ────────────────────────────────────────── */
    useEffect(() => {
        const load = async () => {
            try {
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const res = await fetch(`${API}/quiz`, { headers });
                if (!res.ok) throw new Error(`Status ${res.status}`);
                const data = await res.json();
                if (!Array.isArray(data) || !data.length) throw new Error('No questions found');
                setAllQuestions(data);
                setPhase('briefing');
            } catch (e) {
                setLoadError(e.message);
                setPhase('error');
            }
        };
        load();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [token]);

    /* ── Helpers: timer start / stop ──────────────────────────────── */
    const startTimer = (fromElapsed = 0) => {
        startTimeRef.current = Date.now() - fromElapsed;
        timerRef.current = setInterval(() => setElapsed(Date.now() - startTimeRef.current), 100);
    };
    const stopTimer = () => { if (timerRef.current) clearInterval(timerRef.current); };

    /* ── 2. Start fresh mission ───────────────────────────────────── */
    const startMission = () => {
        localStorage.removeItem('astrosera_quiz_state');
        setSavedState(null);
        const mapped = shuffle(allQuestions).map(q => ({
            id:            q._id || q.questionNo,
            questionText:  q.question,
            options:       [q.option1, q.option2, q.option3, q.option4].filter(Boolean),
            correctAnswer: q.correctAnswer,
        }));
        setQuizQuestions(mapped);
        setCurrentQ(0);
        setSelectedOption(null);
        setFeedback(null);
        setElapsed(0);
        setScoreInfo({ score: 0, correctCount: 0, timeTakenMs: 0, fullMarks: false });
        setPhase('quiz');
        startTimer(0);
    };

    /* ── 3. Resume saved mission ─────────────────────────────────── */
    const resumeMission = () => {
        if (!savedState) return;
        setQuizQuestions(savedState.quizQuestions);
        setCurrentQ(savedState.currentQ);
        setScoreInfo(savedState.scoreInfo);
        setElapsed(savedState.elapsed);
        setSelectedOption(null);
        setFeedback(null);
        setPhase('quiz');
        startTimer(savedState.elapsed);
    };

    /* ── 4. Pause & exit ─────────────────────────────────────────── */
    const handlePauseAndExit = () => {
        if (phase !== 'quiz') return;
        stopTimer();
        const stateToSave = { quizQuestions, currentQ, scoreInfo, elapsed };
        localStorage.setItem('astrosera_quiz_state', JSON.stringify(stateToSave));
        navigate('/');
    };

    /* ── 5. Answer pick ──────────────────────────────────────────── */
    const handlePick = (optionText) => {
        if (selectedOption || phase !== 'quiz') return;
        setSelectedOption(optionText);
        const q = quizQuestions[currentQ];
        const isCorrect = optionText === q.correctAnswer;
        setFeedback(isCorrect ? 'correct' : 'incorrect');

        const newCorrectCount = scoreInfo.correctCount + (isCorrect ? 1 : 0);

        setScoreInfo(prev => ({ ...prev, correctCount: newCorrectCount }));

        setTimeout(() => {
            const next = currentQ + 1;
            if (next < quizQuestions.length) {
                setCurrentQ(next);
                setSelectedOption(null);
                setFeedback(null);
            } else {
                finishQuiz(newCorrectCount, quizQuestions.length);
            }
        }, 1400);
    };

    /* ── 6. Auto-submit when fuel runs out ───────────────────────── */
    useEffect(() => {
        if (phase === 'quiz' && elapsed >= QUIZ_TIME_LIMIT_MS) {
            finishQuiz(scoreInfo.correctCount, quizQuestions.length);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [elapsed, phase]);

    /* ── 7. Finish quiz ──────────────────────────────────────────── */
    const finishQuiz = useCallback(async (finalCorrectCount, totalCount) => {
        stopTimer();
        const timeTakenMs = Math.min(Date.now() - startTimeRef.current, QUIZ_TIME_LIMIT_MS);
        const finalScore  = totalCount > 0 ? Math.round((finalCorrectCount / totalCount) * 100) : 0;
        const fullMarks   = finalScore === 100;
        const result      = { score: finalScore, correctCount: finalCorrectCount, total: totalCount, timeTakenMs, fullMarks };
        setScoreInfo(result);
        localStorage.removeItem('astrosera_quiz_state');
        setSavedState(null);
        if (userId) {
            try {
                await fetch(`${API}/gamification/record-interaction`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userId, isQuiz: true, quizScore: finalScore, timeTakenMs, fullMarks }),
                });
            } catch (e) { console.error('Score sync failed', e); }
        }
        setPhase('result');
    }, [userId]);

    /* ── 8. Restart (back to briefing) ───────────────────────────── */
    const restart = () => {
        setScoreInfo({ score: 0, correctCount: 0, timeTakenMs: 0, fullMarks: false });
        setPhase('briefing');
    };

    /* ════════════════════════════════════════════════════════════════
       RENDER PHASES
    ════════════════════════════════════════════════════════════════ */

    /* ── Shared space backdrop ───────────────────────────────────── */
    const SpaceBackdrop = ({ extra = '' }) => (
        <div className={`fixed inset-0 z-0 bg-[#03030d] overflow-hidden ${extra}`}>
            <Stars />
            <SpacePlanets />
            {/* Deep gradient vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#03030d_100%)] pointer-events-none" />
        </div>
    );

    /* ────────────────────────── LOADING ───────────────────────── */
    if (phase === 'loading') return (
        <div className="relative min-h-screen flex items-center justify-center font-outfit overflow-hidden">
            <SpaceBackdrop />
            <div className="relative z-10 flex flex-col items-center gap-5 animate-fade-in-scale">
                <div className="relative w-20 h-20">
                    <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 border-t-purple-400 animate-spin" />
                    <div className="absolute inset-2 rounded-full border-2 border-cyan-500/20 border-b-cyan-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                    <div className="absolute inset-[30%] rounded-full bg-purple-500/40 blur-sm animate-pulse" />
                </div>
                <p className="text-sm text-purple-300/80 tracking-[0.25em] uppercase animate-pulse">
                    Establishing Uplink...
                </p>
            </div>
        </div>
    );

    /* ────────────────────────── ERROR ─────────────────────────── */
    if (phase === 'error') return (
        <div className="relative min-h-screen flex items-center justify-center font-outfit p-6 overflow-hidden">
            <SpaceBackdrop />
            <div className="relative z-10 max-w-md w-full text-center animate-fade-in-up">
                <p className="text-6xl mb-4">🛸</p>
                <h2 className="text-2xl font-bold text-red-400 tracking-widest mb-3">SIGNAL LOST</h2>
                <p className="text-gray-400 mb-8 text-sm leading-relaxed">{loadError}</p>
                <button onClick={() => window.location.reload()}
                    className="px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors">
                    Retry
                </button>
            </div>
        </div>
    );

    /* ────────────────────────── BRIEFING ──────────────────────── */
    if (phase === 'briefing') return (
        <div className="relative min-h-screen flex items-center justify-center font-outfit p-4 overflow-hidden">
            <SpaceBackdrop />

            <div className="relative z-10 w-full max-w-xl">
                {/* Card */}
                <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden animate-fade-in-up backdrop-blur-md shadow-[0_0_80px_rgba(109,40,217,0.15)]">
                    <div className="scan-beam" />

                    {/* Header */}
                    <div className="text-center mb-8">
                        <span className="text-4xl">🚀</span>
                        <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-br from-white via-purple-200 to-indigo-300">
                            MISSION<br />BRIEFING
                        </h1>
                        <div className="mt-3 h-px bg-gradient-to-r from-transparent via-purple-500/60 to-transparent" />
                    </div>

                    {/* Rules */}
                    <div className="space-y-3 mb-8 text-sm text-gray-400">
                        {[
                            { icon: '🌌', label: 'Objective',   val: 'Answer all astronomy questions.' },
                            { icon: '⛽', label: 'Fuel Limit',  val: `${Math.floor(QUIZ_TIME_LIMIT_MS / 60000)} min of life support.` },
                            { icon: '🔒', label: 'Navigation',  val: 'ONE-WAY. No going back.' },
                        ].map(r => (
                            <div key={r.label} className="flex items-start gap-3 bg-white/[0.04] rounded-xl px-4 py-3 border border-white/[0.08]">
                                <span className="text-xl shrink-0">{r.icon}</span>
                                <div>
                                    <span className="text-purple-300 font-semibold">{r.label}: </span>
                                    <span>{r.val}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Paused state banner */}
                    {savedState && (
                        <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-center">
                            <p className="text-yellow-300 text-sm font-semibold">
                                ⏸ Paused mission detected — Q{savedState.currentQ + 1} of {savedState.quizQuestions?.length}
                            </p>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        {savedState && (
                            <button onClick={resumeMission}
                                className="flex-1 py-3 rounded-2xl font-bold tracking-widest text-sm uppercase bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] transition-all hover:scale-[1.02]">
                                ▶ Continue Mission
                            </button>
                        )}
                        <button onClick={startMission}
                            className={`flex-1 py-3 rounded-2xl font-bold tracking-widest text-sm uppercase transition-all hover:scale-[1.02] ${
                                savedState
                                    ? 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                                    : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.35)] hover:shadow-[0_0_45px_rgba(124,58,237,0.55)]'
                            }`}>
                            {savedState ? '↺ Restart' : '🚀 Launch Mission'}
                        </button>
                    </div>

                    {!userId && (
                        <p className="mt-5 text-center text-xs text-red-400/70">
                            ⚠ Guest mode — results won't be saved
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    /* ────────────────────────── RESULT ────────────────────────── */
    if (phase === 'result') {
        const { score, correctCount, total, timeTakenMs, fullMarks } = scoreInfo;
        const scoreColor = score >= 80 ? '#4ade80' : score >= 50 ? '#facc15' : '#f87171';

        return (
            <div className="relative min-h-screen flex items-center justify-center font-outfit p-4 overflow-hidden">
                <SpaceBackdrop />

                <div className="relative z-10 w-full max-w-lg animate-fade-in-up">
                    <div className="relative bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12 overflow-hidden backdrop-blur-md shadow-[0_0_80px_rgba(109,40,217,0.15)]">
                        <div className="scan-beam" />

                        <div className="text-center mb-8">
                            <p className="text-xs tracking-[0.3em] text-gray-500 uppercase mb-2">Mission Complete</p>
                            <h2 className="text-4xl font-extrabold tracking-widest text-white">MISSION REPORT</h2>
                            <div className="mt-3 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                        </div>

                        {/* Score ring */}
                        <div className="flex justify-center mb-8">
                            <div className="relative w-36 h-36">
                                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                                    <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <circle cx="60" cy="60" r="52" fill="none" stroke={scoreColor}
                                        strokeWidth="8" strokeLinecap="round"
                                        strokeDasharray={`${(score / 100) * 327} 327`}
                                        style={{ filter: `drop-shadow(0 0 8px ${scoreColor})`, transition: 'stroke-dasharray 1.2s ease' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-extrabold" style={{ color: scoreColor }}>{score}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats grid */}
                        <div className="grid grid-cols-2 gap-3 mb-7">
                            {[
                                { label: 'Accuracy',  val: `${correctCount} / ${total}` },
                                { label: 'Time',      val: formatTime(timeTakenMs) },
                            ].map(s => (
                                <div key={s.label} className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-4 text-center">
                                    <p className="text-[10px] tracking-widest text-gray-500 uppercase mb-1">{s.label}</p>
                                    <p className="text-xl font-bold text-white">{s.val}</p>
                                </div>
                            ))}
                        </div>

                        {/* Badges row */}
                        <div className="flex flex-col gap-2 mb-8 text-sm">
                            {fullMarks && <div className="flex items-center gap-2 text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2"><span>🌟</span> Perfect score — bonus badge earned!</div>}
                            {timeTakenMs < QUIZ_TIME_LIMIT_MS && score >= 50 && <div className="flex items-center gap-2 text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-xl px-4 py-2"><span>⚡</span> Completed under 2 minutes!</div>}
                            {userId
                                ? <div className="flex items-center gap-2 text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2"><span>💾</span> Score synced to datacore.</div>
                                : <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2"><span>⚠</span> Guest mode — data not saved.</div>
                            }
                        </div>

                        <button onClick={restart}
                            className="w-full py-3 rounded-2xl font-bold tracking-widest text-sm uppercase text-white border border-white/10 bg-white/[0.05] hover:bg-white/10 transition-all">
                            ↩ Return to Base
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    /* ────────────────────────── QUIZ ──────────────────────────── */
    const q               = quizQuestions[currentQ];
    const bodyShakeClass  = isFeedbackShowing && feedback === 'incorrect' ? 'animate-screen-shake' : '';

    return (
        <div className={`relative min-h-screen flex flex-col pt-20 pb-8 px-4 font-outfit overflow-hidden ${bodyShakeClass}`}>
            <SpaceBackdrop />

            <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col flex-1 gap-4">

                {/* ── Mars progress bar ── */}
                <div className="hidden sm:flex items-center gap-3">
                    <span className="text-[10px] tracking-widest text-gray-600 uppercase shrink-0">Earth</span>
                    <div className="relative flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-400 transition-[width] duration-700 rounded-full"
                            style={{ width: `${marsDistancePct}%` }} />
                        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[10px] transition-[left] duration-700"
                            style={{ left: `${Math.max(2, marsDistancePct)}%` }}>🚀</div>
                    </div>
                    <span className="text-[10px] tracking-widest text-orange-500/60 uppercase shrink-0">Mars</span>
                </div>

                {/* ── HUD bar ── */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl px-5 py-3 flex items-center justify-between gap-4 backdrop-blur-sm">

                    {/* Pause button */}
                    <button
                        onClick={handlePauseAndExit}
                        disabled={!!selectedOption}
                        className={`flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-lg border transition-all ${
                            selectedOption
                                ? 'border-white/5 text-gray-700 cursor-not-allowed'
                                : 'border-white/10 text-gray-400 hover:border-purple-500/40 hover:text-purple-300 cursor-pointer'
                        }`}>
                        <span>⬅</span> Pause
                    </button>

                    {/* Sector counter */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 tracking-widest font-bold uppercase">
                        <span className="text-purple-300">{currentQ + 1}</span>
                        <span>/</span>
                        <span>{totalQuestions}</span>
                    </div>

                    {/* Fuel bar */}
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-600 tracking-widest uppercase hidden sm:inline">Fuel</span>
                        <div className="w-24 sm:w-36 h-2 bg-white/5 rounded-full overflow-hidden border border-white/[0.07]">
                            <div
                                className="h-full rounded-full transition-[width] ease-linear duration-100"
                                style={{
                                    width: `${fuelPct}%`,
                                    background: fuelPct < 20 ? '#ef4444' : fuelPct < 50 ? '#eab308' : '#22c55e',
                                    boxShadow: fuelPct < 20 ? '0 0 8px rgba(239,68,68,0.7)' : fuelPct < 50 ? '0 0 6px rgba(234,179,8,0.5)' : '0 0 6px rgba(34,197,94,0.5)',
                                    animation: fuelPct < 20 ? 'flicker 0.8s linear infinite' : 'none',
                                }}
                            />
                        </div>
                        <span className={`font-mono text-xs font-bold w-10 text-right ${fuelPct < 20 ? 'text-red-400' : 'text-gray-400'}`}>
                            {formatTime(timeLeftMs)}
                        </span>
                    </div>
                </div>

                {/* ── Question card ── */}
                <div className="relative bg-white/[0.03] border border-white/[0.07] rounded-3xl p-6 sm:p-10 flex-1 flex flex-col justify-between backdrop-blur-sm overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.4)]">
                    <div className="scan-beam" />
                    {/* Subtle inner glow */}
                    <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_0%,rgba(139,92,246,0.06),transparent_60%)]" />

                    {/* Sector label */}
                    <div className="mb-5">
                        <span className="text-[10px] tracking-[0.28em] text-purple-400/60 uppercase">
                            Sector {currentQ + 1}
                        </span>
                    </div>

                    {/* Question text */}
                    <h2 className="relative z-10 text-xl sm:text-2xl font-semibold text-white leading-snug mb-8">
                        {q.questionText}
                    </h2>

                    {/* Options grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                        {q.options.map((opt, i) => {
                            let base = 'bg-white/[0.04] border-white/[0.09] text-gray-200 hover:bg-white/[0.08] hover:border-purple-500/40 hover:shadow-[0_0_12px_rgba(139,92,246,0.15)]';

                            if (isFeedbackShowing) {
                                if (opt === q.correctAnswer)
                                    base = 'bg-emerald-500/15 border-emerald-400/70 text-emerald-200 shadow-[0_0_24px_rgba(52,211,153,0.3)] animate-correct';
                                else if (selectedOption === opt)
                                    base = 'bg-red-500/15 border-red-500/60 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-pulse-fast';
                                else
                                    base = 'bg-white/[0.02] border-white/[0.04] text-gray-600 opacity-40';
                            } else if (selectedOption) {
                                base = 'bg-white/[0.02] border-white/[0.04] text-gray-600 opacity-40';
                            }

                            return (
                                <button
                                    key={i}
                                    onClick={() => handlePick(opt)}
                                    disabled={!!selectedOption}
                                    style={{ animationDelay: `${i * 60}ms` }}
                                    className={`answer-btn-appear relative flex items-center gap-4 px-5 py-4 rounded-2xl border-2 text-left font-medium transition-all duration-200 outline-none ${
                                        !selectedOption ? 'hover:-translate-y-0.5 cursor-pointer' : 'cursor-default'
                                    } ${base}`}
                                >
                                    <span className="w-7 h-7 shrink-0 rounded-full border border-white/10 bg-black/30 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                        {OPTION_LETTERS[i]}
                                    </span>
                                    <span className="text-sm sm:text-base leading-snug">{opt}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ── Dot progress ── */}
                <div className="flex items-center justify-center gap-1.5 py-1">
                    {quizQuestions.map((_, i) => (
                        <div
                            key={i}
                            className="rounded-full transition-all duration-300"
                            style={{
                                width:  i === currentQ ? 20 : 6,
                                height: 6,
                                background: i < currentQ
                                    ? '#4ade80'
                                    : i === currentQ
                                    ? 'linear-gradient(90deg,#a78bfa,#818cf8)'
                                    : 'rgba(255,255,255,0.1)',
                            }}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Member3;
