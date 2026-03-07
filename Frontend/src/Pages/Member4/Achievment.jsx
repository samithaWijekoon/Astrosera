import React, { useState, useRef, useEffect, useContext } from 'react';
import './Achievment.css';
import AuthContext from '../../context/AuthContext';

const API = 'http://localhost:5001/api';

// ─── Format date helper ───────────────────────────────────────────────────────
function fmt(d) {
  if (!d || d === '—') return '—';
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Badge Modal ──────────────────────────────────────────────────────────────
function BadgeModal({ badge, onClose }) {
  if (!badge) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-icon-wrap" style={{ borderColor: badge.earned ? badge.color : undefined }}>
          <div
            className={`modal-icon ${badge.earned ? 'modal-icon--earned' : 'modal-icon--locked'}`}
            style={badge.earned ? {
              background: `radial-gradient(circle at 30% 30%, ${badge.color}55, ${badge.color}15)`,
              boxShadow: `0 0 30px ${badge.color}25`,
              filter: `drop-shadow(0 0 12px ${badge.color}60)`,
            } : {}}
          >
            {badge.image
              ? <img src={badge.image} alt={badge.name} className="modal-badge-img" />
              : <span>🏅</span>}
          </div>
        </div>
        <h3 className="modal-title">{badge.name}</h3>
        <p className="modal-desc">{badge.desc}</p>
        <div className="modal-details">
          {badge.earned ? (
            <>
              <div className="modal-detail-row">
                <span className="modal-detail-label">Started</span>
                <span className="modal-detail-value">{badge.started}</span>
              </div>
              <div className="modal-divider" />
              <div className="modal-detail-row">
                <span className="modal-detail-label">Unlocked</span>
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
      {earnedCount !== undefined && (
        <span className="section-header__count">{earnedCount}/{totalCount} badges</span>
      )}
    </div>
  );
}

function BadgeRow({ badges, onSelect, className = '' }) {
  return (
    <div className={`badge-row ${className}`}>
      {badges.map(b => (
        <button
          key={b.id}
          className={`badge-item ${b.earned ? 'badge-item--earned' : 'badge-item--locked'}`}
          style={b.earned ? {
            background: `linear-gradient(135deg, ${b.color}15, ${b.color}08)`,
            borderColor: `${b.color}35`,
          } : {}}
          onClick={() => onSelect(b)}
        >
          <span className="badge-item__icon" style={b.earned ? { filter: `drop-shadow(0 0 6px ${b.color}50)` } : {}}>
            {b.image
              ? <img src={b.image} alt={b.name} className="badge-img" />
              : <span>🏅</span>}
          </span>
          <span className="badge-item__name">{b.name}</span>
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

  const scrollLeaderboard = (dir) => {
    leaderboardRef.current?.scrollBy({ top: dir * 80, behavior: 'smooth' });
  };

  // Calendar for current month
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });

  const maxScore = leaderboard.length > 0 ? Math.max(...leaderboard.map(d => d.score)) : 1;

  // ── Loading / error states ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="achievement-page-wrapper">
        <video className="bg-video" src="/videos/back.mp4" autoPlay loop muted playsInline />
        <div className="bg-video-overlay" />
        <div className="member4-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ color: '#a78bfa', fontSize: '1.4rem', textAlign: 'center' }}>
            🌌 Loading your cosmic achievements...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="achievement-page-wrapper">
        <video className="bg-video" src="/videos/back.mp4" autoPlay loop muted playsInline />
        <div className="bg-video-overlay" />
        <div className="member4-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ color: '#f87171', fontSize: '1.2rem', textAlign: 'center', maxWidth: 400 }}>
            ⚠️ {error}
          </div>
        </div>
      </div>
    );
  }

  // Rank of current user in leaderboard
  const myEntry = leaderboard.find(e => e.isUser);

  return (
    <div className="achievement-page-wrapper">
      {/* ─── BACKGROUND VIDEO ─── */}
      <video className="bg-video" src="/videos/back.mp4" autoPlay loop muted playsInline />
      <div className="bg-video-overlay" />

      <div className="member4-container">

        {/* ─── PROFILE HEADER ─── */}
        <header className="gamification-header">
          <div className="profile-block">
            <div className="profile-info">
              <h1 className="profile-name">{userData?.username || user?.username || 'Astronaut'}</h1>
              <div className="profile-meta">
                {myEntry && (
                  <>
                    <span className="profile-rank">
                      {myEntry.rank === 1 ? '🥇' : myEntry.rank === 2 ? '🥈' : myEntry.rank === 3 ? '🥉' : '🏅'}
                      {' '}Rank <strong>#{myEntry.rank}</strong>
                    </span>
                    <span className="profile-dot" />
                  </>
                )}
                <span className="profile-score">
                  Score: <strong>{userData?.totalScore?.toLocaleString() || 0}</strong>
                </span>
                <span className="profile-dot" />
                <span className="profile-score">
                  PB: <strong>{userData?.personalBestScore || 0}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Streak / Calendar button */}
          <button
            className={`combo-btn ${showCalendar ? 'combo-btn--active' : ''}`}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <div>
              <div className="combo-btn__fire">🔥</div>
              <span className="combo-btn__days">{userData?.currentStreak || 0} days</span>
            </div>
          </button>
        </header>

        {/* ─── CALENDAR MODAL ─── */}
        {showCalendar && (
          <div className="calendar-modal-overlay" onClick={() => setShowCalendar(false)}>
            <div className="calendar-modal-card" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowCalendar(false)}>✕</button>
              <div className="calendar-card calendar-card--modal" role="dialog" aria-modal="true">
                <div className="calendar-month">{monthName}</div>
                <div className="calendar-weekdays">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <span key={d} className="calendar-weekday">{d}</span>
                  ))}
                </div>
                <div className="calendar-grid">
                  {Array.from({ length: firstDayOfWeek }, (_, i) => <div key={'e' + i} />)}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const isActive = activeDays.includes(day);
                    return (
                      <div key={day} className={`calendar-day ${isActive ? 'calendar-day--combo' : ''}`}>
                        {day}
                        {isActive && <span className="calendar-day__dot" />}
                      </div>
                    );
                  })}
                </div>
                <div className="calendar-legend">
                  <span className="calendar-legend__combo" />
                  <span className="calendar-legend__label">Active day</span>
                  <span className="calendar-legend__inactive" />
                  <span className="calendar-legend__label calendar-legend__label--dim">Inactive</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── BADGE CATEGORY CARDS ─── */}
        <div className="badges-grid-categories">
          {categories.map((category, idx) => {
            const earnedCount = category.badges.filter(b => b.earned).length;
            return (
              <div
                key={idx}
                className={`badge-category-card ${category.title === 'Total Days' ? 'badge-category-card--full' : ''}`}
              >
                <SectionHeader
                  title={category.title}
                  earnedCount={earnedCount}
                  totalCount={category.badges.length}
                />
                <BadgeRow
                  badges={category.badges}
                  onSelect={setSelectedBadge}
                  className={category.title === 'Total Days' ? 'badge-row--center' : ''}
                />
              </div>
            );
          })}
        </div>

        {/* ─── LEADERBOARD ─── */}
        <section className="leaderboard-section">
          <div className="leaderboard-header">
            <SectionHeader title="Leaderboard" />
            <div className="leaderboard-scroll-btns">
              <button className="leaderboard-scroll-btn" onClick={() => scrollLeaderboard(-1)} aria-label="Scroll up">▲</button>
              <button className="leaderboard-scroll-btn" onClick={() => scrollLeaderboard(1)} aria-label="Scroll down">▼</button>
            </div>
          </div>
          <div className="leaderboard-list" ref={leaderboardRef}>
            {leaderboard.length === 0 ? (
              <div style={{ color: '#a0a0c0', textAlign: 'center', padding: '2rem' }}>
                No leaderboard data yet — take a quiz to get on the board! 🚀
              </div>
            ) : leaderboard.map((entry, i) => {
              const medals = ['🥇', '🥈', '🥉'];
              const hasMedal = i < 3;
              return (
                <div key={i} className={`leaderboard-row ${entry.isUser ? 'leaderboard-row--user' : ''}`}>
                  <div className="leaderboard-rank">
                    {hasMedal
                      ? <span className="leaderboard-medal">{medals[i]}</span>
                      : <span className="leaderboard-rank-num">#{entry.rank}</span>}
                  </div>
                  <div className={`leaderboard-avatar ${entry.isUser ? 'leaderboard-avatar--user' : ''}`}>
                    {entry.avatar}
                  </div>
                  <div className="leaderboard-info">
                    <span className={`leaderboard-name ${entry.isUser ? 'leaderboard-name--user' : ''}`}>{entry.name}</span>
                    <span className="leaderboard-streak">🔥 {entry.streak} day streak</span>
                  </div>
                  <div className="leaderboard-score-block">
                    <span className={`leaderboard-score ${entry.isUser ? 'leaderboard-score--user' : ''}`}>
                      {entry.score.toLocaleString()}
                    </span>
                    <div className="leaderboard-bar">
                      <div
                        className={`leaderboard-bar__fill ${entry.isUser ? 'leaderboard-bar__fill--user' : ''}`}
                        style={{ width: `${(entry.score / maxScore) * 100}%` }}
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
    </div>
  );
};

export default Member4;