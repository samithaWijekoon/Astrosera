import React, { useState, useRef, useEffect, useContext } from 'react';
import './Achievment.css';
import AuthContext from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/apiConfig';

const API = API_BASE_URL;

// ─── Format date helper ───────────────────────────────────────────────────────
function fmt(d) {
  if (!d || d === '—') return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── SVG Pattern ──────────────────────────────────────────────────────────────
const CircuitPattern = () => (
    <div className="absolute inset-0 pointer-events-none opacity-10 mix-blend-screen" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
);

const ScannerEffect = () => (
    <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-transparent via-purple-400/30 to-transparent animate-[scan_3s_ease-in-out_infinite] pointer-events-none z-10 hidden group-hover:block" style={{ animationName: 'scan' }}></div>
);

// ─── Badge Modal ──────────────────────────────────────────────────────────────
function BadgeModal({ badge, onClose }) {
  if (!badge) return null;
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4" onClick={onClose}>
      <div 
        className="relative bg-[#0d0a1a]/90 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-sm shadow-[0_0_50px_rgba(168,85,247,0.3)] transform-gpu transition-all duration-300 overflow-hidden" 
        onClick={e => e.stopPropagation()}
      >
        <CircuitPattern />
        <button className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-20 cursor-pointer" onClick={onClose}>✕</button>
        
        <div className="relative z-10 flex flex-col items-center text-center">
            <div 
                className={`w-28 h-28 rounded-full flex items-center justify-center mb-6 border-2 transition-all duration-500 overflow-hidden relative ${badge.earned ? 'border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.6)] animate-pulse' : 'border-gray-700 grayscale contrast-75 opacity-50'}`}
                style={badge.earned ? { background: `radial-gradient(circle at center, ${badge.color || '#a855f7'}40, transparent)` } : {}}
            >
                {badge.earned && <div className="absolute inset-0 bg-purple-500/20 mix-blend-color-dodge"></div>}
                {badge.image 
                    ? <img src={badge.image} alt={badge.name} className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] relative z-10" /> 
                    : <span className="text-4xl drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">🏅</span>}
            </div>

            <h3 className="font-outfit text-2xl font-bold text-white tracking-[0.1em] uppercase mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{badge.name}</h3>
            <p className="text-gray-400 text-sm mb-6 max-w-xs">{badge.desc}</p>
            
            <div className="w-full bg-white/5 rounded-xl p-5 border border-white/10 backdrop-blur-sm">
                {badge.earned ? (
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Started</span>
                            <span className="text-gray-300 font-mono tracking-wider">{fmt(badge.started)}</span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Unlocked</span>
                            <span className="text-gray-300 font-mono tracking-wider">{fmt(badge.ended)}</span>
                        </div>
                        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent w-full"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">Status</span>
                            <span className="text-purple-400 font-bold flex items-center gap-2 tracking-widest">
                                <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#a855f7] animate-pulse"></span>
                                EARNED
                            </span>
                        </div>
                    </div>
                ) : (
                    <div className="text-gray-500 italic py-4 font-mono text-xs">
                        🔒 Not yet earned — Keep exploring!
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, earnedCount, totalCount }) {
  return (
    <div className="flex flex-col items-center justify-center mb-8 gap-2">
      <h2 className="font-outfit text-xl font-bold text-white tracking-[0.2em] uppercase text-center drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
        {title}
      </h2>
      {earnedCount !== undefined && (
        <span className="text-[10px] text-purple-200 bg-purple-900/40 border border-purple-500/30 rounded-full px-4 py-1.5 font-mono tracking-widest shadow-[0_0_10px_rgba(168,85,247,0.2)]">
          {earnedCount} / {totalCount} UNLOCKED
        </span>
      )}
    </div>
  );
}

function BadgeRow({ badges, onSelect, className = '' }) {
  return (
    <div className={`flex flex-wrap gap-5 justify-center ${className}`}>
      {badges.map(b => (
        <button
          key={b.id}
          className={`relative group overflow-hidden flex flex-col items-center justify-center w-32 h-36 rounded-2xl border transition-all duration-300 transform-gpu hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] cursor-pointer ${b.earned ? 'bg-white/10 border-purple-500/50 hover:bg-white/20' : 'bg-black/40 border-white/10 hover:border-white/30 grayscale contrast-75 opacity-60 hover:opacity-100 hover:grayscale-0'}`}
          onClick={() => onSelect(b)}
        >
          <ScannerEffect />
          <CircuitPattern />
          {b.earned && <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent pointer-events-none mix-blend-overlay"></div>}
          
          <div className="relative z-10 flex flex-col items-center p-2">
            <span className={`text-5xl mb-3 transition-transform duration-500 group-hover:scale-110 ${b.earned ? 'drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]' : ''}`}>
              {b.image ? <img src={b.image} alt={b.name} className="w-14 h-14 object-contain" /> : '🏅'}
            </span>
            <span className={`text-xs text-center font-bold px-2 leading-tight font-outfit uppercase tracking-wider ${b.earned ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-gray-400'}`}>
              {b.name}
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────
const Member4 = () => {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activeDays, setActiveDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const leaderboardRef = useRef(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setError('Please log in to view your achievements.');
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch(`${API}/gamification/dashboard/${userId}`);
        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Failed to load');
        setUserData(data.user);
        setCategories(data.categories);
        setLeaderboard(data.leaderboard);
        setActiveDays(data.activeDaysThisMonth);
      } catch (e) {
        console.error(e);
        setError('Could not load achievements. Make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Calendar for current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const maxScore = leaderboard.length > 0 ? Math.max(...leaderboard.map(d => d.score)) : 1;

  // ── Loading / error states ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
        <video className="fixed top-0 left-0 w-full h-full object-cover z-0 pointer-events-none opacity-40 mix-blend-screen" src="/videos/back.mp4" autoPlay loop muted playsInline />
        <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-[#0d0a1a]/90 to-black z-0 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin shadow-[0_0_20px_rgba(168,85,247,0.5)]"></div>
            <div className="font-outfit text-purple-300 tracking-[0.3em] uppercase text-lg animate-pulse drop-shadow-[0_0_10px_rgba(216,180,254,0.8)]">
                Initializing Cosmos HUD...
            </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
        <video className="fixed top-0 left-0 w-full h-full object-cover z-0 pointer-events-none opacity-40 mix-blend-screen" src="/videos/back.mp4" autoPlay loop muted playsInline />
        <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-[#0d0a1a]/90 to-black z-0 pointer-events-none" />
        <div className="relative z-10 bg-red-900/20 backdrop-blur-xl border border-red-500/30 rounded-3xl p-10 max-w-lg text-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
            <div className="text-6xl mb-6 drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">⚠️</div>
            <div className="font-outfit text-red-400 tracking-[0.2em] font-bold text-xl mb-4">SYSTEM ERROR</div>
            <div className="text-gray-300 text-sm font-mono bg-black/50 p-4 rounded-xl border border-red-500/20">{error}</div>
        </div>
      </div>
    );
  }

  const myEntry = leaderboard.find(e => e.isUser);

  return (
    <div className="relative min-h-[100vh] bg-black overflow-hidden font-sans">
      <style>{`
        @keyframes scan {
            0% { transform: translateY(-100%); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(400px); opacity: 0; }
        }
      `}</style>

      {/* ─── BACKGROUND VIDEO ─── */}
      <video className="fixed top-0 left-0 w-full h-full object-cover z-0 pointer-events-none opacity-40 mix-blend-screen" src="/videos/back.mp4" autoPlay loop muted playsInline />
      <div className="fixed inset-0 bg-gradient-to-b from-black/80 via-[#0d0a1a]/90 to-black z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28">

        {/* ─── PROFILE HEADER ─── */}
        <header className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 mb-12 shadow-[0_0_50px_rgba(0,0,0,0.6)] relative overflow-hidden group">
          <CircuitPattern />
          <ScannerEffect />
          <div className="relative z-10 flex items-center gap-6 w-full md:w-auto">
            <div className="flex-1">
              <h1 className="font-outfit text-4xl md:text-5xl font-bold text-white tracking-[0.1em] uppercase mb-5 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                {userData?.username || user?.username || 'Astronaut'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm md:text-base font-mono">
                {myEntry && (
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-900/60 border border-purple-500/50 text-purple-200 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.4)] font-bold text-xs tracking-wider">
                      {myEntry.rank === 1 ? '🥇' : myEntry.rank === 2 ? '🥈' : myEntry.rank === 3 ? '🥉' : '🏅'} 
                      RANK <strong className="text-white ml-1 text-[13px]">#{myEntry.rank}</strong>
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 shadow-[0_0_5px_rgba(255,255,255,0.3)]" />
                  </div>
                )}
                <span className="text-gray-400 uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                  SCORE 
                  <strong className="text-cyan-400 text-lg ml-1 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
                    {userData?.totalScore?.toLocaleString() || 0}
                  </strong>
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-600 shadow-[0_0_5px_rgba(255,255,255,0.3)]" />
                <span className="text-gray-400 uppercase tracking-widest text-xs font-bold flex items-center gap-2">
                  BEST 
                  <strong className="text-pink-400 text-lg ml-1 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)]">
                    {userData?.personalBestScore || 0}
                  </strong>
                </span>
              </div>
            </div>
          </div>

          {/* Streak / Calendar button */}
          <button
            className={`relative z-10 flex items-center gap-5 rounded-2xl p-5 transition-all duration-300 border backdrop-blur-md transform-gpu hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(249,115,22,0.4)] cursor-pointer ${showCalendar ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/50' : 'bg-black/40 border-white/10 hover:border-orange-500/40 hover:bg-black/60'}`}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <div className="text-5xl drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] group-hover:animate-pulse">🔥</div>
            <div className="flex flex-col items-start pr-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Current Streak</span>
              <span className="font-mono text-2xl font-bold text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]">
                {userData?.currentStreak || 0} DAYS
              </span>
            </div>
          </button>
        </header>

        {/* ─── CALENDAR MODAL ─── */}
        {showCalendar && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setShowCalendar(false)}>
            <div className="relative bg-[#0d0a1a]/95 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-sm shadow-[0_0_60px_rgba(249,115,22,0.2)] overflow-hidden transform-gpu" onClick={e => e.stopPropagation()}>
              <CircuitPattern />
              <button className="absolute top-5 right-5 text-gray-400 hover:text-white transition-colors z-20 cursor-pointer" onClick={() => setShowCalendar(false)}>✕</button>
              
              <div className="relative z-10">
                <div className="font-outfit text-center text-sm font-bold text-orange-200 tracking-[0.2em] uppercase mb-6 drop-shadow-[0_0_8px_rgba(255,237,213,0.5)]">{monthName}</div>
                <div className="grid grid-cols-7 gap-2 mb-3">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: firstDayOfWeek }, (_, i) => <div key={'e' + i} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isActive = activeDays.includes(day);
                    return (
                      <div key={day} className={`aspect-square flex flex-col items-center justify-center rounded-xl text-xs font-mono relative transition-transform hover:scale-110 cursor-default ${isActive ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white font-bold shadow-[0_0_15px_rgba(249,115,22,0.6)] ring-1 ring-orange-400/50' : 'bg-white/5 text-gray-500 border border-white/5 hover:bg-white/10'}`}>
                        {day}
                        {isActive && <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_6px_white]"></div>}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-white/10 text-[10px] font-outfit uppercase tracking-[0.1em] text-gray-400">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded box-content bg-gradient-to-br from-orange-500 to-red-600 shadow-[0_0_8px_rgba(249,115,22,0.6)]"></div> Active
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded bg-white/10 border border-white/5"></div> Inactive
                    </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── MAIN CONTENT GRID ─── */}
        <div className="flex flex-col lg:flex-row gap-8">
            {/* ─── BADGE CATEGORY CARDS ─── */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {categories.map((category, idx) => {
                const earnedCount = category.badges.filter(b => b.earned).length;
                return (
                <div
                    key={idx}
                    className={`bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden group transition-all duration-500 hover:border-purple-500/40 hover:shadow-[0_0_40px_rgba(168,85,247,0.15)] ${category.title === 'Total Days' ? 'md:col-span-2' : ''}`}
                >
                    <CircuitPattern />
                    <ScannerEffect />
                    <div className="relative z-10">
                        <SectionHeader
                            title={category.title}
                            earnedCount={earnedCount}
                            totalCount={category.badges.length}
                        />
                        <BadgeRow
                            badges={category.badges}
                            onSelect={setSelectedBadge}
                        />
                    </div>
                </div>
                );
            })}
            </div>

            {/* ─── LEADERBOARD ─── */}
            <aside className="w-full lg:w-[420px]">
                <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 relative overflow-hidden group h-full max-h-[850px] flex flex-col transition-all duration-500 hover:border-cyan-500/40 hover:shadow-[0_0_40px_rgba(34,211,238,0.15)]">
                    <CircuitPattern />
                    <ScannerEffect />
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="mb-6">
                            <SectionHeader title="Global Leaderboard" />
                        </div>
                        
                        <div className="flex-1 overflow-y-auto pr-3 space-y-4 scrollbar-hide" ref={leaderboardRef} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                            {leaderboard.length === 0 ? (
                                <div className="text-gray-500 text-center py-12 font-mono text-sm border border-dashed border-gray-700 rounded-2xl bg-black/20">
                                    <div className="text-3xl mb-3 opacity-50">📡</div>
                                    NO DATA DETECTED.<br/>INITIALIZE A QUIZ TO BEGIN.
                                </div>
                            ) : leaderboard.map((entry, i) => {
                                const medals = ['🥇', '🥈', '🥉'];
                                const hasMedal = i < 3;
                                return (
                                    <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:-translate-y-1 cursor-default ${entry.isUser ? 'bg-gradient-to-r from-purple-900/40 to-cyan-900/20 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-inset ring-purple-500/20' : 'bg-black/30 border-white/10 hover:bg-white/5 hover:border-white/20'}`}>
                                        <div className="w-8 text-center font-mono font-bold text-gray-500">
                                            {hasMedal ? <span className="text-2xl drop-shadow-md">{medals[i]}</span> : <span className="text-sm">#{entry.rank}</span>}
                                        </div>
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold uppercase shadow-inner ${entry.isUser ? 'bg-gradient-to-br from-purple-500 to-cyan-500 text-white border-2 border-white/30 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-gradient-to-br from-gray-800 to-gray-900 text-gray-400 border border-gray-700'}`}>
                                            {entry.avatar}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className={`font-bold truncate text-base ${entry.isUser ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-gray-300'}`}>{entry.name}</div>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-widest font-outfit mt-0.5">
                                                <span className="text-orange-400 glow">🔥 {entry.streak}</span> DAY STREAK
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5 min-w-[80px]">
                                            <div className={`font-mono font-bold text-sm ${entry.isUser ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]' : 'text-gray-300'}`}>
                                                {entry.score.toLocaleString()}
                                            </div>
                                            <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ${entry.isUser ? 'bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_10px_rgba(168,85,247,1)]' : 'bg-purple-600/70'}`} 
                                                    style={{ width: `${(entry.score / maxScore) * 100}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </aside>
        </div>

        {/* ─── BADGE MODAL ─── */}
        <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
      </div>
    </div>
  );
};

export default Member4;