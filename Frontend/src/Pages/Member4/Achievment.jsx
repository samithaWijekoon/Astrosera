import React, { useState, useEffect } from 'react';
import './Achievment.css';

// DATA

const COMBO_DAYS = [1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 28, 29, 30, 31];

const COMBO_BADGES = [
  { id: "cb1", image: "/images/badges/cb1.png", name: "Stable Orbit", desc: "Keep going, 3-day streak achieved.", started: "Jan 5, 2025", ended: "Jan 7, 2025", earned: true, color: "#a855f7" },
  { id: "cb2", image: "/images/badges/cb1.png", name: "Twin Stars", desc: "Steady streak, 6 days strong.", started: "Jan 10, 2025", ended: "Jan 16, 2025", earned: true, color: "#06b6d4" },
  { id: "cb3", image: "/images/badges/cb1.png", name: "Rising Constellation", desc: "9 days of consistency shining bright.", started: "—", ended: "—", earned: false, color: "#8b5cf6" },
  { id: "cb4", image: "/images/badges/cb1.png", name: "Solar Pathfinder", desc: "12 days streak, blazing your path.", started: "—", ended: "—", earned: false, color: "#eab308" },
  { id: "cb5", image: "/images/badges/cb1.png", name: "Galaxy Runner", desc: "15 days streak, reaching new heights.", started: "—", ended: "—", earned: false, color: "#eab308" },
  { id: "cb6", image: "/images/badges/cb1.png", name: "Nebula Voyager", desc: "18 days streak, exploring further.", started: "Jan 1, 2025", ended: "Jan 1, 2025", earned: false, },
  { id: "cb7", image: "/images/badges/cb1.png", name: "Orbit Master", desc: "21 days streak, mastery in progress.", started: "—", ended: "—", earned: false, color: "#eab308" },
  { id: "cb8", image: "/images/badges/cb1.png", name: "Cosmic Titan", desc: "24 days streak, strong and unstoppable.", started: "—", ended: "—", earned: false, color: "#eab308" },
  { id: "cb9", image: "/images/badges/cb1.png", name: "Supernova Force", desc: "27 days streak, bursting with power.", started: "—", ended: "—", earned: false, color: "#eab308" },
  { id: "cb10", image: "/images/badges/cb1.png", name: "Galactic Legend", desc: "30 days streak, ultimate achievement.", started: "—", ended: "—", earned: false, color: "#eab308" },
];

const MISSION_BADGES = [
  { id: "mm1", image: "/images/badges/cb1.png", name: "Light Speed", desc: "Finish a quiz under 2 minutes for the first time.", started: "Jan 2, 2025", ended: "Jan 2, 2025", earned: true, color: "#10b981" },
  { id: "mm2", image: "/images/badges/cb1.png", name: "Photon Mind", desc: "Finish quizzes under 2 minutes 3 times.", started: "Jan 8, 2025", ended: "Jan 15, 2025", earned: true, color: "#f59e0b" },
  { id: "mm3", image: "/images/badges/cb1.png", name: "Nova Burst", desc: "Finish quizzes under 2 minutes 5 times.", started: "—", ended: "—", earned: false, color: "#6366f1" },
  { id: "mm4", image: "/images/badges/cb1.png", name: "Solar Flare", desc: "Get full marks for the first time in a quiz.", started: "—", ended: "—", earned: false, color: "#84cc16" },
  { id: "mm5", image: "/images/badges/cb1.png", name: "Mission Legend", desc: "Pass 5 times in quizzes without failing.", started: "—", ended: "—", earned: false, color: "#ec4899" },
  { id: "mm6", image: "/images/badges/cb1.png", name: "Mission Commander", desc: "Pass 10 times in quizzes without failing.", started: "—", ended: "—", earned: false, color: "#84cc16" },
  { id: "mm7", image: "/images/badges/cb1.png", name: "Boss Mission", desc: "Pass 20 times in quizzes without failing.", started: "Jan 2, 2025", ended: "Jan 2, 2025", earned: true, color: "#10b981" },
  { id: "mm8", image: "/images/badges/cb1.png", name: "Stable Orbit", desc: "Get the same score 3 times in a row.", started: "Jan 8, 2025", ended: "Jan 15, 2025", earned: true, color: "#f59e0b" },
  { id: "mm9", image: "/images/badges/cb1.png", name: "Twin Signal", desc: "Get the same score for 2 consecutive days.", started: "—", ended: "—", earned: false, color: "#6366f1" },
  { id: "mm10", image: "/images/badges/cb1.png", name: "Supernova Growth", desc: "Get a new personal best in a quiz.", started: "—", ended: "—", earned: false, color: "#ec4899" },
];

const TOTAL_DAYS_BADGES = [
  { id: "td1", image: "/images/badges/cb1.png", name: "Comet Spark", desc: "1 week of interaction, first milestone.", color: "#fb923c" },
  { id: "td2", image: "/images/badges/cb1.png", name: "Orbit Rookie", desc: "2 weeks, keeping the streak alive.", color: "#22c55e" },
  { id: "td3", image: "/images/badges/cb1.png", name: "Star Voyager", desc: "1 month of daily visits.", color: "#06b6d4" },
  { id: "td4", image: "/images/badges/cb1.png", name: "Cosmic Trailblazer", desc: "1.5 months, strong streak.", color: "#06b6d4" },
  { id: "td5", image: "/images/badges/cb1.png", name: "Nebula Explorer", desc: "2 months, exploring consistently.", color: "#06b6d4" },
  { id: "td6", image: "/images/badges/cb1.png", name: "Solar Navigator", desc: "3 months of daily dedication.", color: "#06b6d4" },
  { id: "td7", image: "/images/badges/cb1.png", name: "Galaxy Runner", desc: " 4 months, streaking through the stars.", color: "#06b6d4" },
  { id: "td8", image: "/images/badges/cb1.png", name: "Stellar Commander", desc: "Half a year, commanding the cosmos.", color: "#06b6d4" },
  { id: "td9", image: "/images/badges/cb1.png", name: "Supernova Legend", desc: "9 months, shining brighter than ever.", color: "#06b6d4" },
  { id: "td10", image: "/images/badges/cb1.png", name: "Celestial Immortal", desc: "1 year, ultimate streak", color: "#06b6d4" },
];

const BADGE_CATEGORIES = [
  { title: "Combo Badges", badges: COMBO_BADGES },
  { title: "Mission Master", badges: MISSION_BADGES },
  { title: "Total Days", badges: TOTAL_DAYS_BADGES },
];

const LEADERBOARD_DATA = [
  { rank: 1, name: "Orion K.", avatar: "OK", score: 4850, streak: 31 },
  { rank: 2, name: "You", avatar: "YOU", score: 4210, streak: 24, isUser: true },
  { rank: 3, name: "Nova S.", avatar: "NS", score: 3990, streak: 22 },
  { rank: 4, name: "Lyra M.", avatar: "LM", score: 3540, streak: 18 },
  { rank: 5, name: "Zeph A.", avatar: "ZA", score: 3100, streak: 15 },
];

// FUNCTIONS  
//Badge Modal Component
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
            {/* {badge.icon} */}
            {badge.image ? (
              <img src={badge.image} alt={badge.name} className="modal-badge-img" />
            ) : (
              badge.icon
            )}

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
// BadgeRow Component
function BadgeRow({ badges, onSelect, className = "" }) {
  return (
    <div className={`badge-row ${className}`}>
      {badges.map(b => (
        <button
          key={b.id}
          className={`badge-item ${b.earned ? 'badge-item--earned' : 'badge-item--locked'}`}
          style={b.earned ? { background: `linear-gradient(135deg, ${b.color}15, ${b.color}08)`, borderColor: `${b.color}35` } : {}}
          onClick={() => onSelect(b)}
        >
          {/* {b.earned && <span className="badge-item__dot" style={{ background: b.color, boxShadow: `0 0 6px ${b.color}` }} />} */}
          <span
            className="badge-item__icon"
            style={b.earned ? { filter: `drop-shadow(0 0 6px ${b.color}50)` } : {}}
          >
            {/* {b.icon} */}
            {b.image ? (
              <img src={b.image} alt={b.name} className="badge-img" />
            ) : (
              b.icon
            )}
          </span>
          <span className="badge-item__name">{b.name}</span>
        </button>
      ))}
    </div>
  );
}

// MAIN COMPONENT

const Member4 = () => {
  const [level] = useState(5);
  const [xp] = useState(350);
  const [nextLevelXp] = useState(500);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);

  const currentMonth = new Date(2025, 0); // January 2025
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const maxScore = Math.max(...LEADERBOARD_DATA.map(d => d.score));
  const progressPercent = (xp / nextLevelXp) * 100;

  // RENDER 

  return (
    <div className="member4-container">


      {/* ─── PROFILE HEADER ─── */}
      <header className="gamification-header">
        <div className="profile-block">

          {/* Name + rank + score */}
          <div className="profile-info">
            <h1 className="profile-name">Chang Chung</h1>
            <div className="profile-meta">
              <span className="profile-rank">🥈 Rank <strong>#2</strong></span>
              <span className="profile-dot" />
              <span className="profile-score">Score: <strong>100</strong></span>
            </div>
          </div>
        </div>

        {/* Combo button */}
        <button className={`combo-btn ${showCalendar ? 'combo-btn--active' : ''}`} onClick={() => setShowCalendar(!showCalendar)}>
          <div>
            <div className="combo-btn__fire">🔥</div>
            <span className="combo-btn__days">24 days</span>

            <div className="combo-btn__text">
              {/* <span className="combo-btn__label">Combo</span>
            <div>
              <span className={`combo-btn__arrow ${showCalendar ? 'combo-btn__arrow--open' : ''}`}>▼</span>
            </div> */}

            </div>
          </div>
        </button>
      </header>

      {/* ─── CALENDAR (modal popup) ─── */}
      {showCalendar && (
        <div className="calendar-modal-overlay" onClick={() => setShowCalendar(false)}>
          <div className="calendar-modal-card" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowCalendar(false)}>✕</button>

            <div className="calendar-card calendar-card--modal" role="dialog" aria-modal="true" aria-label="Combo calendar">
              <div className="calendar-month">{monthName}</div>

              <div className="calendar-weekdays">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => (
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
          </div>
        </div>
      )}

      {/* ─── BADGE CATEGORY CARDS (2x2 grid) ─── */}
      <div className="badges-grid-categories">
        {BADGE_CATEGORIES.map((category, idx) => {
          const earnedCount = category.badges.filter(b => b.earned).length;
          return (
            <div
              key={idx}
              className={`badge-category-card ${category.title === "Total Days" ? "badge-category-card--full" : ""
                }`}
            >
              <SectionHeader
                title={category.title}
                earnedCount={earnedCount}
                totalCount={category.badges.length}
              />
              <BadgeRow
                badges={category.badges}
                onSelect={setSelectedBadge}
                className={category.title === "Total Days" ? "badge-row--center" : ""}
              />
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























































//////////////////geminiipro//////////////////////////



// import React, { useState, useEffect } from 'react';
// import './Achievment.css';

// function BadgeModal({ badge, onClose }) {
//   if (!badge) return null;
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-card" onClick={e => e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}>✕</button>
//         <div className="modal-icon-wrap" style={{ borderColor: badge.earned ? badge.color : undefined }}>
//           <div className={`modal-icon ${badge.earned ? 'modal-icon--earned' : 'modal-icon--locked'}`} style={badge.earned ? { background: `radial-gradient(circle at 30% 30%, ${badge.color}55, ${badge.color}15)`, boxShadow: `0 0 30px ${badge.color}25`, filter: `drop-shadow(0 0 12px ${badge.color}60)` } : {}}>
//             {badge.image ? <img src={badge.image} alt={badge.name} className="modal-badge-img" /> : badge.icon}
//           </div>
//         </div>
//         <h3 className="modal-title">{badge.name}</h3>
//         <p className="modal-desc">{badge.desc}</p>
//         <div className="modal-details">
//           {badge.earned ? (
//             <>
//               <div className="modal-detail-row"><span className="modal-detail-label">Started</span><span className="modal-detail-value">{badge.started}</span></div>
//               <div className="modal-divider" />
//               <div className="modal-detail-row"><span className="modal-detail-label">Ended</span><span className="modal-detail-value">{badge.ended}</span></div>
//               <div className="modal-divider" />
//               <div className="modal-detail-row"><span className="modal-detail-label">Status</span><span className="modal-detail-status" style={{ color: badge.color }}><span className="modal-status-dot" style={{ background: badge.color, boxShadow: `0 0 6px ${badge.color}` }} />Earned</span></div>
//             </>
//           ) : <p className="modal-locked-text">🔒 Not yet earned — keep going!</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

// function SectionHeader({ title, earnedCount, totalCount }) {
//   return (
//     <div className="section-header">
//       <span className="section-header__title">{title}</span>
//       {earnedCount !== undefined && <span className="section-header__count">{earnedCount}/{totalCount} badges</span>}
//     </div>
//   );
// }

// function BadgeRow({ badges, onSelect, className = "" }) {
//   return (
//     <div className={`badge-row ${className}`}>
//       {badges.map(b => (
//         <button key={b.id} className={`badge-item ${b.earned ? 'badge-item--earned' : 'badge-item--locked'}`} style={b.earned ? { background: `linear-gradient(135deg, ${b.color}15, ${b.color}08)`, borderColor: `${b.color}35` } : {}} onClick={() => onSelect(b)}>
//           <span className="badge-item__icon" style={b.earned ? { filter: `drop-shadow(0 0 6px ${b.color}50)` } : {}}>
//             {b.image ? <img src={b.image} alt={b.name} className="badge-img" /> : b.icon}
//           </span>
//           <span className="badge-item__name">{b.name}</span>
//         </button>
//       ))}
//     </div>
//   );
// }

// const Member4 = () => {
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedBadge, setSelectedBadge] = useState(null);

//   // Dynamic State
//   const [dbUser, setDbUser] = useState(null);
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const [dynamicCategories, setDynamicCategories] = useState([]);
//   const [calendarDays, setCalendarDays] = useState([]);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       // NOTE: For testing, you can paste a real MongoDB ID here as a string!
//       const loggedInUserId = localStorage.getItem("currentUserId");
//       if (!loggedInUserId) return;

//       try {
//         const response = await fetch(`http://localhost:5000/api/gamification/dashboard/${loggedInUserId}`);
//         const data = await response.json();

//         if (data.success) {
//           setDbUser(data.userData);
//           setLeaderboardData(data.leaderboard);
//           setCalendarDays(data.activeDaysThisMonth);

//           const unlockedBadges = data.userData.unlockedBadges;

//           const formatDate = (dateString) => {
//             if (!dateString) return "—";
//             return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//           };

//           const merge = (blueprints) => blueprints.map(template => {
//             const earnedInfo = unlockedBadges.find(b => b.badgeId === template.id);
//             if (earnedInfo) {
//               return { ...template, earned: true, started: formatDate(earnedInfo.dateStarted), ended: formatDate(earnedInfo.dateUnlocked) };
//             }
//             return { ...template, earned: false, started: "—", ended: "—" };
//           });

//           setDynamicCategories([
//             { title: "Combo Badges", badges: merge(data.blueprints.combo) },
//             { title: "Mission Master", badges: merge(data.blueprints.mission) },
//             { title: "Total Days", badges: merge(data.blueprints.totalDays) },
//           ]);
//         }
//       } catch (error) {
//         console.error("Failed to load dashboard data", error);
//       }
//     };
//     fetchDashboardData();
//   }, []);

//   const currentMonth = new Date();
//   const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
//   const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
//   const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });
//   const maxScore = leaderboardData.length > 0 ? Math.max(...leaderboardData.map(d => d.score)) : 1;

//   if (!dbUser) return <div style={{color: "white", padding: "2rem"}}>Loading AstroSera Database...</div>;

//   return (
//     <div className="member4-container">
//       <header className="gamification-header">
//         <div className="profile-block">
//           <div className="avatar-wrap">
//             <div className="avatar-ring">
//               <div className="avatar-inner">
//                 <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
//                   <circle cx="19" cy="15" r="7" fill="#3a3558" />
//                   <path d="M5 36c0-7.73 6.27-14 14-14s14 6.27 14 14" fill="#3a3558" />
//                 </svg>
//               </div>
//             </div>
//           </div>
//           <div className="profile-info">
//             <h1 className="profile-name">{dbUser.username || "Astronaut"}</h1>
//             <div className="profile-meta">
//               <span className="profile-score">Score: <strong>{dbUser.totalScore}</strong></span>
//             </div>
//           </div>
//         </div>
//         <button className={`combo-btn ${showCalendar ? 'combo-btn--active' : ''}`} onClick={() => setShowCalendar(!showCalendar)}>
//           <div>
//             <div className="combo-btn__fire">🔥</div>
//             <span className="combo-btn__days">{dbUser.currentStreak} days</span>
//           </div>
//         </button>
//       </header>

//       {showCalendar && (
//         <div className="calendar-modal-overlay" onClick={() => setShowCalendar(false)}>
//           <div className="calendar-modal-card" onClick={e => e.stopPropagation()}>
//             <button className="modal-close" onClick={() => setShowCalendar(false)}>✕</button>
//             <div className="calendar-card calendar-card--modal">
//               <div className="calendar-month">{monthName}</div>
//               <div className="calendar-weekdays">
//                 {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(d => <span key={d} className="calendar-weekday">{d}</span>)}
//               </div>
//               <div className="calendar-grid">
//                 {Array.from({ length: firstDayOfWeek }, (_, i) => <div key={"empty-" + i} /> )}
//                 {Array.from({ length: daysInMonth }, (_, i) => {
//                   const day = i + 1;
//                   const isCombo = calendarDays.includes(day);
//                   return (
//                     <div key={day} className={`calendar-day ${isCombo ? 'calendar-day--combo' : ''}`}>
//                       {day}
//                       {isCombo && <span className="calendar-day__dot" />}
//                     </div>
//                   );
//                 })}
//               </div>
//               <div className="calendar-legend">
//                 <span className="calendar-legend__combo" /> <span className="calendar-legend__label">Combo day</span>
//                 <span className="calendar-legend__inactive" /> <span className="calendar-legend__label calendar-legend__label--dim">Inactive</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="badges-grid-categories">
//         {dynamicCategories.map((category, idx) => {
//           const earnedCount = category.badges.filter(b => b.earned).length;
//           return (
//              <div key={idx} className={`badge-category-card ${category.title === "Total Days" ? "badge-category-card--full" : ""}`}>
//               <SectionHeader title={category.title} earnedCount={earnedCount} totalCount={category.badges.length} />
//               <BadgeRow badges={category.badges} onSelect={setSelectedBadge} className={category.title === "Total Days" ? "badge-row--center" : ""} />
//             </div>
//           );
//         })}
//       </div>

//       <section className="leaderboard-section">
//         <SectionHeader title="Leaderboard" />
//         <div className="leaderboard-list">
//           {leaderboardData.map((entry, i) => {
//             const hasMedal = i < 3;
//             return (
//               <div key={i} className={`leaderboard-row ${entry.isUser ? 'leaderboard-row--user' : ''}`}>
//                 <div className="leaderboard-rank">
//                   {hasMedal ? <span className="leaderboard-medal">{["🥇", "🥈", "🥉"][i]}</span> : <span className="leaderboard-rank-num">#{entry.rank}</span>}
//                 </div>
//                 <div className={`leaderboard-avatar ${entry.isUser ? 'leaderboard-avatar--user' : ''}`}>{entry.avatar}</div>
//                 <div className="leaderboard-info">
//                   <span className={`leaderboard-name ${entry.isUser ? 'leaderboard-name--user' : ''}`}>{entry.name}</span>
//                   <span className="leaderboard-streak">🔥 {entry.streak} day streak</span>
//                 </div>
//                 <div className="leaderboard-score-block">
//                   <span className={`leaderboard-score ${entry.isUser ? 'leaderboard-score--user' : ''}`}>{entry.score.toLocaleString()}</span>
//                   <div className="leaderboard-bar">
//                     <div className={`leaderboard-bar__fill ${entry.isUser ? 'leaderboard-bar__fill--user' : ''}`} style={{ width: `${(entry.score / maxScore) * 100}%` }} />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </section>

//       <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
//     </div>
//   );
// };

// export default Member4;






//////////////////////////new code/////////////////////////////




// import React, { useState, useEffect } from 'react';
// import './Achievment.css';

// // --- 1. SUB-COMPONENTS (The UI Pieces) ---

// function BadgeModal({ badge, onClose }) {
//   if (!badge) return null;
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-card" onClick={e => e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}>✕</button>
//         <div className="modal-icon-wrap" style={{ borderColor: badge.earned ? badge.color : undefined }}>
//           <div className={`modal-icon ${badge.earned ? 'modal-icon--earned' : 'modal-icon--locked'}`}
//                style={badge.earned ? { background: `radial-gradient(circle at 30% 30%, ${badge.color}55, ${badge.color}15)`, boxShadow: `0 0 30px ${badge.color}25`, filter: `drop-shadow(0 0 12px ${badge.color}60)` } : {}}>
//             {badge.image ? <img src={badge.image} alt={badge.name} className="modal-badge-img" /> : badge.icon}
//           </div>
//         </div>
//         <h3 className="modal-title">{badge.name}</h3>
//         <p className="modal-desc">{badge.desc}</p>
//         <div className="modal-details">
//           {badge.earned ? (
//             <>
//               <div className="modal-detail-row"><span className="modal-detail-label">Started</span><span className="modal-detail-value">{badge.started}</span></div>
//               <div className="modal-divider" />
//               <div className="modal-detail-row"><span className="modal-detail-label">Unlocked</span><span className="modal-detail-value">{badge.ended}</span></div>
//               <div className="modal-divider" />
//               <div className="modal-detail-row">
//                 <span className="modal-detail-label">Status</span>
//                 <span className="modal-detail-status" style={{ color: badge.color }}>
//                     <span className="modal-status-dot" style={{ background: badge.color, boxShadow: `0 0 6px ${badge.color}` }} />
//                     Earned
//                 </span>
//               </div>
//             </>
//           ) : <p className="modal-locked-text">🔒 Not yet earned — keep going!</p>}
//         </div>
//       </div>
//     </div>
//   );
// }

// function SectionHeader({ title, earnedCount, totalCount }) {
//   return (
//     <div className="section-header">
//       <span className="section-header__title">{title}</span>
//       {earnedCount !== undefined && <span className="section-header__count">{earnedCount}/{totalCount} badges</span>}
//     </div>
//   );
// }

// function BadgeRow({ badges, onSelect, className = "" }) {
//   return (
//     <div className={`badge-row ${className}`}>
//       {badges.map(b => (
//         <button key={b.id}
//                 className={`badge-item ${b.earned ? 'badge-item--earned' : 'badge-item--locked'}`}
//                 style={b.earned ? { background: `linear-gradient(135deg, ${b.color}15, ${b.color}08)`, borderColor: `${b.color}35` } : {}}
//                 onClick={() => onSelect(b)}>
//           <span className="badge-item__icon" style={b.earned ? { filter: `drop-shadow(0 0 6px ${b.color}50)` } : {}}>
//             {b.image ? <img src={b.image} alt={b.name} className="badge-img" /> : b.icon}
//           </span>
//           <span className="badge-item__name">{b.name}</span>
//         </button>
//       ))}
//     </div>
//   );
// }

// // --- 2. MAIN COMPONENT ---

// const Member4 = () => {
//   const [dbUser, setDbUser] = useState(null);
//   const [dynamicCategories, setDynamicCategories] = useState([]);
//   const [leaderboardData, setLeaderboardData] = useState([]);
//   const [calendarDays, setCalendarDays] = useState([]);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [selectedBadge, setSelectedBadge] = useState(null);

//   useEffect(() => {
//     const loadData = async () => {
//       const userId = localStorage.getItem("currentUserId");
//       if (!userId) return;

//       try {
//         const res = await fetch(`http://localhost:5000/api/gamification/dashboard/${userId}`);
//         const data = await res.json();

//         if (data.success) {
//           setDbUser(data.userData);
//           setLeaderboardData(data.leaderboard);
//           setCalendarDays(data.activeDaysThisMonth);

//           const unlocked = data.userData.unlockedBadges;

//           // HELPER: Merges backend templates with user's earned status
//           const merge = (blueprints) => blueprints.map(temp => {
//             const found = unlocked.find(b => b.badgeId === temp.id);
//             return found ?
//               {
//                 ...temp,
//                 earned: true,
//                 started: found.dateStarted ? new Date(found.dateStarted).toLocaleDateString() : "---",
//                 ended: new Date(found.dateUnlocked).toLocaleDateString()
//               } :
//               { ...temp, earned: false };
//           });

//           setDynamicCategories([
//             { title: "Combo Badges", badges: merge(data.blueprints.combo) },
//             { title: "Mission Master", badges: merge(data.blueprints.mission) },
//             { title: "Total Days", badges: merge(data.blueprints.totalDays) }
//           ]);
//         }
//       } catch (err) {
//         console.error("Connection Error", err);
//       }
//     };
//     loadData();
//   }, []);

//   if (!dbUser) return <div className="loading">Connecting to AstroSera...</div>;

//   const maxScore = leaderboardData.length > 0 ? Math.max(...leaderboardData.map(d => d.score)) : 1;
//   const currentMonthName = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

//   return (
//     <div className="member4-container">
//       {/* --- Header --- */}
//       <header className="gamification-header">
//         <div className="profile-block">
//           <div className="avatar-wrap">
//             <div className="avatar-ring">
//                 <div className="avatar-inner">
//                     {dbUser.avatarInitials || "A"}
//                 </div>
//             </div>
//           </div>
//           <div className="profile-info">
//             <h1 className="profile-name">{dbUser.username || "Astronaut"}</h1>
//             <span className="profile-score">Score: <strong>{dbUser.totalScore.toLocaleString()}</strong></span>
//           </div>
//         </div>
//         <button className={`combo-btn ${showCalendar ? 'active' : ''}`} onClick={() => setShowCalendar(!showCalendar)}>
//           🔥 {dbUser.currentStreak} Days
//         </button>
//       </header>

//       {/* --- Calendar Modal (Conditional) --- */}
//       {showCalendar && (
//         <div className="calendar-modal-overlay" onClick={() => setShowCalendar(false)}>
//             <div className="calendar-modal-card" onClick={e => e.stopPropagation()}>
//                 <button className="modal-close" onClick={() => setShowCalendar(false)}>✕</button>
//                 <h3 className="calendar-month">{currentMonthName}</h3>
//                 <div className="calendar-mini-grid">
//                     {/* Simplified calendar visualization based on activeDaysThisMonth */}
//                     <p style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '10px'}}>Your active days this month:</p>
//                     <div className="active-days-row">
//                         {calendarDays.map(day => (
//                             <span key={day} className="active-day-dot">{day}</span>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </div>
//       )}

//       {/* --- The Badge Sections --- */}
//       <div className="badges-grid-categories">
//         {dynamicCategories.map((cat, i) => (
//           <div key={i} className={`badge-category-card ${cat.title === "Total Days" ? "full-width" : ""}`}>
//             <SectionHeader title={cat.title} earnedCount={cat.badges.filter(b=>b.earned).length} totalCount={cat.badges.length} />
//             <BadgeRow badges={cat.badges} onSelect={setSelectedBadge} />
//           </div>
//         ))}
//       </div>

//       {/* --- Leaderboard --- */}
//       <section className="leaderboard-section">
//         <SectionHeader title="Leaderboard" />
//         <div className="leaderboard-list">
//             {leaderboardData.map((entry, i) => (
//             <div key={i} className={`leaderboard-row ${entry.isUser ? 'leaderboard-row--user' : ''}`}>
//                 <div className="leaderboard-rank">#{entry.rank}</div>
//                 <div className="leaderboard-avatar">{entry.avatar}</div>
//                 <div className="leaderboard-info">
//                     <span className="leaderboard-name">{entry.name}</span>
//                     <span className="leaderboard-streak">🔥 {entry.streak}</span>
//                 </div>
//                 <div className="leaderboard-score-block">
//                     <span className="leaderboard-score">{entry.score.toLocaleString()}</span>
//                     <div className="leaderboard-bar">
//                         <div className="leaderboard-bar__fill" style={{width: `${(entry.score/maxScore)*100}%`}}></div>
//                     </div>
//                 </div>
//             </div>
//             ))}
//         </div>
//       </section>

//       <BadgeModal badge={selectedBadge} onClose={() => setSelectedBadge(null)} />
//     </div>
//   );
// };

// export default Member4;