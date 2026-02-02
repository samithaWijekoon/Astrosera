import React, { useState } from 'react';
import './Achievment.css';

// DATA

const COMBO_DAYS = [1,2,3,5,6,7,8,10,11,12,15,16,17,18,19,22,23,24,25,26,28,29,30,31];

const COMBO_BADGES = [
  { id: "cb1", icon: "🔥", name: "First Spark",      desc: "Complete your first combo day",    started: "Jan 1, 2025", ended: "Jan 1, 2025",  earned: true,  color: "#f97316" },
  { id: "cb2", icon: "⚡", name: "3-Day Surge",      desc: "Maintain a 3-day combo streak",    started: "Jan 5, 2025", ended: "Jan 7, 2025",  earned: true,  color: "#a855f7" },
  { id: "cb3", icon: "🌊", name: "Week Warrior",     desc: "Achieve a 7-day combo streak",     started: "Jan 10, 2025", ended: "Jan 16, 2025", earned: true, color: "#06b6d4" },
  { id: "cb4", icon: "💎", name: "Fortnight Force",  desc: "Hit a 14-day combo streak",        started: "—",           ended: "—",            earned: false, color: "#8b5cf6" },
  { id: "cb5", icon: "👑", name: "Month Master",     desc: "Complete a full 30-day combo",     started: "—",           ended: "—",            earned: false, color: "#eab308" },
];

const MISSION_BADGES = [
  { id: "mm1", icon: "🎯", name: "First Mission",       desc: "Complete your first mission",  started: "Jan 2, 2025",  ended: "Jan 2, 2025",  earned: true,  color: "#10b981" },
  { id: "mm2", icon: "🏆", name: "Mission Pro",         desc: "Complete 5 missions",          started: "Jan 8, 2025",  ended: "Jan 15, 2025", earned: true,  color: "#f59e0b" },
  { id: "mm3", icon: "🚀", name: "Mission Ace",         desc: "Complete 10 missions",         started: "—",            ended: "—",            earned: false, color: "#6366f1" },
  { id: "mm4", icon: "🌟", name: "Mission Legend",      desc: "Complete 25 missions",         started: "—",            ended: "—",            earned: false, color: "#ec4899" },
  { id: "mm5", icon: "⭐", name: "Ultimate Conqueror",  desc: "Complete all missions",        started: "—",            ended: "—",            earned: false, color: "#84cc16" },
];

const NOTES_BADGES = [
  { id: "nb1", icon: "📝", name: "First Note",   desc: "Write your first note",  started: "Jan 3, 2025",  ended: "Jan 3, 2025",  earned: true,  color: "#14b8a6" },
  { id: "nb2", icon: "📓", name: "Note Keeper",  desc: "Write 5 notes",          started: "Jan 5, 2025",  ended: "Jan 12, 2025", earned: true,  color: "#f43f5e" },
  { id: "nb3", icon: "📚", name: "Scholar",      desc: "Write 15 notes",         started: "—",            ended: "—",            earned: false, color: "#3b82f6" },
  { id: "nb4", icon: "🖊️", name: "Wordsmith",    desc: "Write 30 notes",         started: "—",            ended: "—",            earned: false, color: "#8b5cf6" },
  { id: "nb5", icon: "📖", name: "Author",       desc: "Write 50 notes",         started: "—",            ended: "—",            earned: false, color: "#f97316" },
];

const TOTAL_DAYS_BADGES = [
  { id: "td1", icon: "🌅", name: "Day One",        desc: "Your first day on AstroSera",  started: "Jan 1, 2025",  ended: "Jan 1, 2025",  earned: true,  color: "#fb923c" },
  { id: "td2", icon: "📅", name: "Week In",        desc: "7 total days logged",          started: "Jan 1, 2025",  ended: "Jan 7, 2025",  earned: true,  color: "#22c55e" },
  { id: "td3", icon: "🗓️", name: "Two Weeks",     desc: "14 total days logged",         started: "Jan 1, 2025",  ended: "Jan 14, 2025", earned: true,  color: "#06b6d4" },
  { id: "td4", icon: "🏅", name: "30 Days Strong", desc: "30 total days logged",         started: "—",            ended: "—",            earned: false, color: "#a855f7" },
  { id: "td5", icon: "🎖️", name: "Centurion",     desc: "100 total days logged",        started: "—",            ended: "—",            earned: false, color: "#eab308" },
];

const BADGE_CATEGORIES = [
  { title: "Combo Badges",  badges: COMBO_BADGES },
  { title: "Mission Master", badges: MISSION_BADGES },
  { title: "Notes",          badges: NOTES_BADGES },
  { title: "Total Days",     badges: TOTAL_DAYS_BADGES },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: "Orion K.",  avatar: "OK",  score: 4850, streak: 31 },
  { rank: 2, name: "You",       avatar: "YOU", score: 4210, streak: 24, isUser: true },
  { rank: 3, name: "Nova S.",   avatar: "NS",  score: 3990, streak: 22 },
  { rank: 4, name: "Lyra M.",   avatar: "LM",  score: 3540, streak: 18 },
  { rank: 5, name: "Zeph A.",   avatar: "ZA",  score: 3100, streak: 15 },
];

// FUNCTIONS
function BadgeModal({ badge, onClose }) {
  if (!badge) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>

        <button className="modal-close" onClick={onClose}>✕</button>

        {/* Icon */}
        <div className="modal-icon-wrap" style={{ borderColor: badge.earned ? badge.color : undefined }}>
          <div
            className={`modal-icon ${badge.earned ? 'modal-icon--earned' : 'modal-icon--locked'}`}
            style={badge.earned ? { background: `radial-gradient(circle at 30% 30%, ${badge.color}55, ${badge.color}15)`, boxShadow: `0 0 30px ${badge.color}25`, filter: `drop-shadow(0 0 12px ${badge.color}60)` } : {}}
          >
            {badge.icon}
          </div>
        </div>

        {/* Name + Desc */}
        <h3 className="modal-title">{badge.name}</h3>
        <p className="modal-desc">{badge.desc}</p>

        {/* Details box */}
        <div className="modal-details">
          {badge.earned ? (
            <>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Started</span>
                <span className="modal-detail-value">{badge.started}</span>
              </div>
              <div className="modal-divider" />
              <div className="modal-detail-row">
                <span className="modal-detail-label">Ended</span>
                <span className="modal-detail-value">{badge.ended}</span>
              </div>
              <div className="modal-divider" />
              <div className="modal-detail-row">
                <span className="modal-detail-label">Status</span>
                <span className="modal-detail-status" style={{ color: badge.color }}>
                  <span className="modal-status-dot" style={{ background: badge.color, boxShadow: `0 0 6px ${badge.color}` }} />
                  Earned
                </span>
              </div>
            </>
          ) : (
            <p className="modal-locked-text">🔒 Not yet earned — keep going!</p>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, earnedCount, totalCount }) {
  return (
    <div className="section-header">
      <span className="section-header__title">{title}</span>
      <span className="section-header__count">{earnedCount}/{totalCount} badges</span>
    </div>
  );
}

function BadgeRow({ badges, onSelect }) {
  return (
    <div className="badge-row">
      {badges.map(b => (
        <button
          key={b.id}
          className={`badge-item ${b.earned ? 'badge-item--earned' : 'badge-item--locked'}`}
          style={b.earned ? { background: `linear-gradient(135deg, ${b.color}15, ${b.color}08)`, borderColor: `${b.color}35` } : {}}
          onClick={() => onSelect(b)}
        >
          {b.earned && <span className="badge-item__dot" style={{ background: b.color, boxShadow: `0 0 6px ${b.color}` }} />}
          <span
            className="badge-item__icon"
            style={b.earned ? { filter: `drop-shadow(0 0 6px ${b.color}50)` } : {}}
          >
            {b.icon}
          </span>
          <span className="badge-item__name">{b.name}</span>
        </button>
      ))}
    </div>
  );
}

// MAIN COMPONENT

const Member4 = () => {
  const [level]        = useState(5);
  const [xp]           = useState(350);
  const [nextLevelXp]  = useState(500);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const currentMonth  = new Date(2025, 0); // January 2025
  const daysInMonth   = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthName     = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const maxScore = Math.max(...LEADERBOARD_DATA.map(d => d.score));
  const progressPercent = (xp / nextLevelXp) * 100;

  // RENDER 

  return (
    <div className="member4-container">

      {/* ─── PROFILE HEADER ─── */}
      <header className="gamification-header">
        <div className="profile-block">
          {/* Avatar */}
          <div className="avatar-wrap">
            <div className="avatar-ring">
              <div className="avatar-inner">
                <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
                  <circle cx="19" cy="15" r="7" fill="#3a3558" />
                  <path d="M5 36c0-7.73 6.27-14 14-14s14 6.27 14 14" fill="#3a3558" />
                </svg>
              </div>
            </div>
            <span className="avatar-online" />
          </div>

          {/* Name + rank + score */}
          <div className="profile-info">
            <h1 className="profile-name">Stellar You</h1>
            <div className="profile-meta">
              <span className="profile-rank">🥈 Rank <strong>#2</strong></span>
              <span className="profile-dot" />
              <span className="profile-score">Score: <strong>4,210</strong></span>
            </div>
          </div>
        </div>

        {/* Combo button */}
        <button className={`combo-btn ${showCalendar ? 'combo-btn--active' : ''}`} onClick={() => setShowCalendar(!showCalendar)}>
          <div className="combo-btn__fire">🔥</div>
          <div className="combo-btn__text">
            <span className="combo-btn__label">Combo</span>
            <span className="combo-btn__days">24 days</span>
          </div>
          <span className={`combo-btn__arrow ${showCalendar ? 'combo-btn__arrow--open' : ''}`}>▼</span>
        </button>
      </header>

      {/* ─── LEVEL / XP BAR ───
      <div className="level-info">
        <div className="level-badge">Lvl {level}</div>
        <div className="xp-bar-container">
          <div className="xp-bar-fill" style={{ width: `${progressPercent}%` }} />
          <span className="xp-text">{xp} / {nextLevelXp} XP</span>
        </div>
      </div> */}

      {/* ─── CALENDAR ─── */}
      {showCalendar && (
        <div className="calendar-card">
          <div className="calendar-month">{monthName}</div>

          <div className="calendar-weekdays">
            {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => (
              <span key={d} className="calendar-weekday">{d}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDayOfWeek }, (_, i) => (
              <div key={"empty-" + i} />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const isCombo = COMBO_DAYS.includes(day);
              return (
                <div key={day} className={`calendar-day ${isCombo ? 'calendar-day--combo' : ''}`}>
                  {day}
                  {isCombo && <span className="calendar-day__dot" />}
                </div>
              );
            })}
          </div>

          <div className="calendar-legend">
            <span className="calendar-legend__combo" /> <span className="calendar-legend__label">Combo day</span>
            <span className="calendar-legend__inactive" /> <span className="calendar-legend__label calendar-legend__label--dim">Inactive</span>
          </div>
        </div>
      )}

      {/* ─── BADGE CATEGORY CARDS (2x2 grid) ─── */}
      <div className="badges-grid-categories">
        {BADGE_CATEGORIES.map((category, idx) => {
          const earnedCount = category.badges.filter(b => b.earned).length;
          return (
            <div key={idx} className="badge-category-card">
              <SectionHeader
                title={category.title}
                earnedCount={earnedCount}
                totalCount={category.badges.length}
              />
              <BadgeRow badges={category.badges} onSelect={setSelectedBadge} />
            </div>
          );
        })}
      </div>

      {/* ─── LEADERBOARD ─── */}
      <section className="leaderboard-section">
        <SectionHeader title="Leaderboard" earnedCount={undefined} totalCount={undefined} />
        <div className="leaderboard-list">
          {LEADERBOARD_DATA.map((entry, i) => {
            const medals = ["🥇", "🥈", "🥉"];
            const hasMedal = i < 3;
            const barPercent = (entry.score / maxScore) * 100;

            return (
              <div key={i} className={`leaderboard-row ${entry.isUser ? 'leaderboard-row--user' : ''}`}>
                {/* Rank / Medal */}
                <div className="leaderboard-rank">
                  {hasMedal
                    ? <span className="leaderboard-medal">{medals[i]}</span>
                    : <span className="leaderboard-rank-num">#{entry.rank}</span>
                  }
                </div>

                {/* Avatar */}
                <div className={`leaderboard-avatar ${entry.isUser ? 'leaderboard-avatar--user' : ''}`}>
                  {entry.avatar}
                </div>

                {/* Name + streak */}
                <div className="leaderboard-info">
                  <span className={`leaderboard-name ${entry.isUser ? 'leaderboard-name--user' : ''}`}>{entry.name}</span>
                  <span className="leaderboard-streak">🔥 {entry.streak} day streak</span>
                </div>

                {/* Score + bar */}
                <div className="leaderboard-score-block">
                  <span className={`leaderboard-score ${entry.isUser ? 'leaderboard-score--user' : ''}`}>{entry.score.toLocaleString()}</span>
                  <div className="leaderboard-bar">
                    <div
                      className={`leaderboard-bar__fill ${entry.isUser ? 'leaderboard-bar__fill--user' : ''}`}
                      style={{ width: `${barPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── BADGE MODAL ─── */}
      <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
    </div>
  );
};

export default Member4;