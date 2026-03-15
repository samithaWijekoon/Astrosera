import React, { useState, useRef, useEffect, useContext } from 'react';
import * as THREE from 'three';
import './Achievment.css';
import AuthContext from '../../context/AuthContext';

const API = 'http://localhost:5000/api';

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
      {badges.map(b => {
        const isEarned = Boolean(b.earned);
        const badgeColor = b.color || '#a855f7';

        return (
          <button
            key={b.id}
            className={`badge-item ${isEarned ? 'badge-item--earned' : 'badge-item--locked'}`}
            style={{
              borderColor: isEarned ? `${badgeColor}c8` : `${badgeColor}66`,
              boxShadow: isEarned
                ? `0 0 18px ${badgeColor}66, 0 0 40px ${badgeColor}33`
                : `0 0 8px ${badgeColor}22`,
              background: isEarned
                ? `linear-gradient(160deg, ${badgeColor}22, rgba(15,12,28,0.78) 56%)`
                : undefined,
              opacity: isEarned ? 1 : 0.8,
            }}
            onClick={() => onSelect(b)}
          >
            <span
              className="badge-item__icon"
              style={isEarned ? { filter: `drop-shadow(0 0 8px ${badgeColor}) saturate(1.1)` } : undefined}
            >
              {b.image
                ? (
                  <img
                    src={b.image}
                    alt={b.name}
                    className="badge-img"
                    style={isEarned ? { filter: 'none' } : { filter: 'grayscale(1) saturate(0.25) opacity(0.75)' }}
                  />
                )
                : <span>🏅</span>}
            </span>
            <span
              className="badge-item__name"
              style={isEarned ? { color: '#fff' } : { color: 'rgba(255,255,255,0.58)' }}
            >
              {b.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function GalaxyBackground() {
  const galaxyRef = useRef(null);

  useEffect(() => {
    const mountEl = galaxyRef.current;
    if (!mountEl) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#000000');

    // spec: fov ~72, slightly adjusted for better tunnel effect
    const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.1, 1600);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'bg-galaxy-canvas';
    mountEl.appendChild(renderer.domElement);

    const STAR_COUNT = 7600;
    const GLOW_COUNT = 1400;
    const FIELD_WIDTH = 500;
    const FIELD_HEIGHT = 500;
    const FAR_Z = -1000;
    const NEAR_Z = 10;
    const MIN_RADIUS = 35; // Don't spawn starts in the center tunnel

    const positions = new Float32Array(STAR_COUNT * 3);
    const colors = new Float32Array(STAR_COUNT * 3);
    const speeds = new Float32Array(STAR_COUNT);
    const baseBrightness = new Float32Array(STAR_COUNT);
    const twinklePhase = new Float32Array(STAR_COUNT);
    const twinkleSpeed = new Float32Array(STAR_COUNT);

    const glowPositions = new Float32Array(GLOW_COUNT * 3);
    const glowColors = new Float32Array(GLOW_COUNT * 3);
    const glowSpeeds = new Float32Array(GLOW_COUNT);
    const glowBaseBrightness = new Float32Array(GLOW_COUNT);
    const glowTwinklePhase = new Float32Array(GLOW_COUNT);
    const glowTwinkleSpeed = new Float32Array(GLOW_COUNT);

    const setStarColor = (arr, idx3, brightness, seed) => {
      // Varied star colors: slight blue/yellow tints
      if (seed < 0.15) { // Warm white
        arr[idx3] = brightness;
        arr[idx3 + 1] = brightness * 0.95;
        arr[idx3 + 2] = brightness * 0.85;
      } else if (seed < 0.3) { // Cool blue
        arr[idx3] = brightness * 0.85;
        arr[idx3 + 1] = brightness * 0.95;
        arr[idx3 + 2] = brightness;
      } else { // Neutral white
        arr[idx3] = brightness;
        arr[idx3 + 1] = brightness;
        arr[idx3 + 2] = brightness;
      }
    };

    const resetStar = (arr, i3, isFar = true) => {
      const xSpread = FIELD_WIDTH;
      const ySpread = FIELD_HEIGHT;
      
      let x, y, r;
      do {
        x = (Math.random() - 0.5) * xSpread;
        y = (Math.random() - 0.5) * ySpread;
        r = Math.sqrt(x * x + y * y);
      } while (r < MIN_RADIUS);

      arr[i3] = x;
      arr[i3 + 1] = y;
      arr[i3 + 2] = isFar ? FAR_Z : (Math.random() * (NEAR_Z - FAR_Z) + FAR_Z);
    };

    // Initialize stars
    for (let i = 0; i < STAR_COUNT; i += 1) {
      const i3 = i * 3;
      resetStar(positions, i3, false);
      speeds[i] = 20 + Math.random() * 40;
      baseBrightness[i] = 0.5 + Math.random() * 0.5;
      twinklePhase[i] = Math.random() * Math.PI * 2;
      twinkleSpeed[i] = 1.0 + Math.random() * 2.0;
      setStarColor(colors, i3, baseBrightness[i], Math.random());
    }

    // Initialize glow stars
    for (let i = 0; i < GLOW_COUNT; i += 1) {
      const i3 = i * 3;
      resetStar(glowPositions, i3, false);
      glowSpeeds[i] = 15 + Math.random() * 25;
      glowBaseBrightness[i] = 0.4 + Math.random() * 0.55;
      glowTwinklePhase[i] = Math.random() * Math.PI * 2;
      glowTwinkleSpeed[i] = 0.5 + Math.random() * 1.5;
      setStarColor(glowColors, i3, glowBaseBrightness[i], Math.random());
    }

    const starsGeometry = new THREE.BufferGeometry();
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const glowGeometry = new THREE.BufferGeometry();
    glowGeometry.setAttribute('position', new THREE.BufferAttribute(glowPositions, 3));
    glowGeometry.setAttribute('color', new THREE.BufferAttribute(glowColors, 3));

    // Simple dot texture
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 32;
    dotCanvas.height = 32;
    const dotCtx = dotCanvas.getContext('2d');
    const dotGrad = dotCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
    dotGrad.addColorStop(0, 'rgba(255,255,255,1)');
    dotGrad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    dotGrad.addColorStop(0.6, 'rgba(255,255,255,0.3)');
    dotGrad.addColorStop(1, 'rgba(255,255,255,0)');
    dotCtx.fillStyle = dotGrad;
    dotCtx.fillRect(0, 0, 32, 32);
    const starTexture = new THREE.CanvasTexture(dotCanvas);

    // Softer glow texture
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 64;
    glowCanvas.height = 64;
    const glowCtx = glowCanvas.getContext('2d');
    const glowGrad = glowCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    glowGrad.addColorStop(0, 'rgba(255,255,255,1)');
    glowGrad.addColorStop(0.2, 'rgba(255,255,255,0.5)');
    glowGrad.addColorStop(0.5, 'rgba(255,255,255,0.15)');
    glowGrad.addColorStop(1, 'rgba(255,255,255,0)');
    glowCtx.fillStyle = glowGrad;
    glowCtx.fillRect(0, 0, 64, 64);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.9,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1.0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: starTexture,
    });

    const glowMaterial = new THREE.PointsMaterial({
      size: 5.5,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      map: glowTexture,
    });

    const stars = new THREE.Points(starsGeometry, starsMaterial);
    const glowStars = new THREE.Points(glowGeometry, glowMaterial);
    scene.add(stars);
    scene.add(glowStars);

    const mouse = { x: 0, y: 0, smoothX: 0, smoothY: 0 };
    const onMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', onResize);

    let animationId;
    let last = performance.now();

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - last) / 1000, 0.1);
      last = now;
      const elapsed = now / 1000;

      // Update stars
      for (let i = 0; i < STAR_COUNT; i += 1) {
        const i3 = i * 3;
        // Moving towards screen (positive Z)
        positions[i3 + 2] += speeds[i] * delta;

        // Depth-based twinkling
        const depthFactor = (positions[i3 + 2] - FAR_Z) / (NEAR_Z - FAR_Z);
        const twinkle = Math.sin(elapsed * twinkleSpeed[i] + twinklePhase[i]) * 0.3 * depthFactor;
        const brightness = Math.min(1, Math.max(0.2, baseBrightness[i] + twinkle));
        setStarColor(colors, i3, brightness, (i % 100) / 100);

        // Tunnel expansion effect: X and Y push outwards as they get closer
        if (positions[i3 + 2] > FAR_Z * 0.5) {
          const push = 0.1 * delta * (1 + depthFactor);
          positions[i3] += positions[i3] * push;
          positions[i3 + 1] += positions[i3 + 1] * push;
        }

        // Recycle star
        if (positions[i3 + 2] > NEAR_Z) {
          resetStar(positions, i3, true);
        }
      }

      // Update glow stars
      for (let i = 0; i < GLOW_COUNT; i += 1) {
        const i3 = i * 3;
        glowPositions[i3 + 2] += glowSpeeds[i] * delta;

        const twinkle = Math.sin(elapsed * glowTwinkleSpeed[i] + glowTwinklePhase[i]) * 0.2;
        const brightness = Math.min(0.8, Math.max(0.1, glowBaseBrightness[i] + twinkle));
        setStarColor(glowColors, i3, brightness, (i % 80) / 80);

        if (glowPositions[i3 + 2] > NEAR_Z) {
          resetStar(glowPositions, i3, true);
        }
      }

      starsGeometry.attributes.position.needsUpdate = true;
      starsGeometry.attributes.color.needsUpdate = true;
      glowGeometry.attributes.position.needsUpdate = true;
      glowGeometry.attributes.color.needsUpdate = true;

      // Parallax & Camera
      mouse.smoothX += (mouse.x - mouse.smoothX) * 0.05;
      mouse.smoothY += (mouse.y - mouse.smoothY) * 0.05;

      camera.position.x = mouse.smoothX * 1.5;
      camera.position.y = -mouse.smoothY * 1.5;
      camera.lookAt(0, 0, FAR_Z * 0.4);

      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('mousemove', onMouseMove);
      window.cancelAnimationFrame(animationId);
      starsGeometry.dispose();
      starsMaterial.dispose();
      glowGeometry.dispose();
      glowMaterial.dispose();
      starTexture.dispose();
      glowTexture.dispose();
      renderer.dispose();
      if (mountEl.contains(renderer.domElement)) {
        mountEl.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div className="bg-galaxy" ref={galaxyRef} aria-hidden="true" />;
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
    const userId = sessionStorage.getItem('userId');
    if (!userId) {
      setError('Please log in to view your achievements.');
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const [dashRes, lbRes] = await Promise.all([
          fetch(`${API}/gamification/dashboard/${userId}`),
          fetch(`${API}/leaderboard?userId=${userId}`),
        ]);

        const dashData = await dashRes.json();
        const lbData = await lbRes.json();

        if (!dashData.success) {
          throw new Error(dashData.error || 'Failed to load dashboard');
        }

        setUserData(dashData.user || null);
        setCategories(dashData.categories || []);
        setActiveDays(dashData.activeDaysThisMonth || []);

        // Prefer dedicated leaderboard API; fallback to dashboard payload
        if (lbData?.success && Array.isArray(lbData.leaderboard)) {
          setLeaderboard(lbData.leaderboard);
        } else {
          setLeaderboard(dashData.leaderboard || []);
        }
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

  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(now.getFullYear(), now.getMonth(), 1).getDay();
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' });
  const myEntry = leaderboard.find(e => e.isUser);

  const maxScore = leaderboard.length > 0 ? Math.max(...leaderboard.map(d => d.score)) : 1;

  // ── Loading / error states ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="achievement-page-wrapper">
        <GalaxyBackground />
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
        <GalaxyBackground />
        <div className="bg-video-overlay" />
        <div className="member4-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ color: '#f87171', fontSize: '1.2rem', textAlign: 'center', maxWidth: 400 }}>
            ⚠️ {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="achievement-page-wrapper">
      {/* ─── THREE.JS GALAXY BACKGROUND ─── */}
      <GalaxyBackground />
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