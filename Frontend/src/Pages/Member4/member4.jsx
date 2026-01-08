import React, { useState } from 'react';
import './member4.css';

// Member 04: Gamification & Achievement System
const Member4 = () => {
    const [level, setLevel] = useState(5);
    const [xp, setXp] = useState(350);
    const [nextLevelXp] = useState(500);

    const badges = [
        { id: 1, name: "Stargazer", icon: "🔭", desc: "First Login", unlocked: true },
        { id: 2, name: "Galaxy Brain", icon: "🧠", desc: "Score 100% on a Quiz", unlocked: true },
        { id: 3, name: "Marathoner", icon: "🏃", desc: "7 Day Streak", unlocked: false },
        { id: 4, name: "Event Hunter", icon: "🌠", desc: "Track 5 Events", unlocked: false },
    ];

    const leaderboard = [
        { rank: 1, name: "NebulaNinja", xp: 12500, avatar: "👽" },
        { rank: 2, name: "CosmicRay", xp: 11200, avatar: "👩‍🚀" },
        { rank: 3, name: "AstroGeek", xp: 9800, avatar: "👨‍🚀" },
        { rank: 4, name: "You", xp: 3500, avatar: "🧑‍🚀" },
        { rank: 5, name: "StarDust", xp: 2100, avatar: "🤖" },
    ];

    const [notification, setNotification] = useState(null);

    // Function to simulate unlocking a badge
    const simulateUnlock = () => {
        setNotification("New Badge Unlocked: Marathoner! 🏅");
        setTimeout(() => setNotification(null), 3000);
    };

    const calculateProgress = () => {
        return (xp / nextLevelXp) * 100;
    };

    return (
        <div className="member4-container">
            {notification && <div className="toast-notification">{notification}</div>}

            <header className="gamification-header">
                <h1>Mission Control</h1>
                <div className="level-info">
                    <div className="level-badge">Lvl {level}</div>
                    <div className="xp-bar-container">
                        <div className="xp-bar-fill" style={{ width: `${calculateProgress()}%` }}></div>
                        <span className="xp-text">{xp} / {nextLevelXp} XP</span>
                    </div>
                </div>
            </header>

            <div className="dashboard-grid">
                <section className="badges-section">
                    <h2>🏆 Badge Collection</h2>
                    <div className="badges-grid">
                        {badges.map(badge => (
                            <div key={badge.id} className={`badge-card ${badge.unlocked ? 'unlocked' : 'locked'}`} onClick={!badge.unlocked ? simulateUnlock : undefined}>
                                <div className="badge-icon">{badge.icon}</div>
                                <div className="badge-details">
                                    <h3>{badge.name}</h3>
                                    <p>{badge.desc}</p>
                                </div>
                                {!badge.unlocked && <div className="lock-overlay">🔒</div>}
                            </div>
                        ))}
                    </div>
                </section>

                <section className="leaderboard-section">
                    <h2>🚀 Global Leaderboard</h2>
                    <div className="leaderboard-list">
                        {leaderboard.map((user) => (
                            <div key={user.rank} className={`leaderboard-row ${user.name === "You" ? "highlight" : ""}`}>
                                <span className="rank">#{user.rank}</span>
                                <span className="avatar">{user.avatar}</span>
                                <span className="username">{user.name}</span>
                                <span className="user-xp">{user.xp} XP</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Member4;
