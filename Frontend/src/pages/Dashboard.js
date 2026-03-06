import React, { useState, useEffect, useMemo, useRef } from 'react';
import { getFeed } from '../services/api';
import { flattenFeed, threatLevel, fmtKm, fmtDiam, relativeSize } from '../services/helpers';
import AsteroidDetail from '../components/AsteroidDetail';
import BellButton from '../components/BellButton';

function fmt(d) { return d.toISOString().split('T')[0]; }

// In-memory cache: { "2026-03-01_2026-03-07": [...asteroids] }
const cache = {};

export default function Dashboard() {
  const [asteroids, setAsteroids]   = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [cacheHit, setCacheHit]     = useState(false);
  const [selected, setSelected]     = useState(null);
  const [hazardOnly, setHazardOnly] = useState(false);
  const [sortBy, setSortBy]         = useState('date');
  const hasLoaded = useRef(false);

  const today = useMemo(() => new Date(), []);
  const [start, setStart] = useState(fmt(today));
  const [end,   setEnd]   = useState(fmt(new Date(today.getTime() + 6 * 86400000)));

  useEffect(() => {
    if (!hasLoaded.current) {
      hasLoaded.current = true;
      load(fmt(today), fmt(new Date(today.getTime() + 6 * 86400000)));
    }
  }, []); // eslint-disable-line

  async function load(s, e) {
    const startVal = s || start;
    const endVal   = e || end;
    const key = `${startVal}_${endVal}`;

    setError('');
    setSelected(null);
    setCacheHit(false);

    // ── Serve from cache instantly ──────────────────────────────────────────
    if (cache[key]) {
      setAsteroids(cache[key]);
      setCacheHit(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getFeed(startVal, endVal);
      const flat = flattenFeed(data);
      cache[key] = flat; // store in cache
      setAsteroids(flat);
      if (flat.length === 0) setError('No asteroids found for this date range. Try different dates.');
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 429) {
        // Try to find nearest cached result to show something useful
        const keys = Object.keys(cache);
        if (keys.length > 0) {
          const nearest = keys[keys.length - 1];
          setAsteroids(cache[nearest]);
          setError(`NASA rate limit reached — showing cached results from ${nearest.replace('_', ' → ')}. Try your dates again in a moment.`);
        } else {
          setError('NASA API rate limit reached. Please wait a moment and try again.');
        }
      } else if (status === 400) {
        setError('Invalid date range. Max 7 days allowed between start and end.');
      } else {
        setError('Could not fetch data. Make sure the backend is running on port 5000 and your NASA API key is set.');
      }
    } finally {
      setLoading(false);
    }
  }

  function handleSearch() {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s) || isNaN(e)) { setError('Please enter valid dates.'); return; }
    if (e < s) { setError('End date must be after start date.'); return; }
    const diffDays = (e - s) / 86400000;
    if (diffDays > 7) { setError('NASA API allows max 7 days per search.'); return; }
    load(start, end);
  }

  const displayed = useMemo(() => {
    let list = hazardOnly ? asteroids.filter(a => a.isHazardous) : asteroids;
    switch (sortBy) {
      case 'distance': return [...list].sort((a,b) => a.missDistKm - b.missDistKm);
      case 'size':     return [...list].sort((a,b) => b.diamMaxKm - a.diamMaxKm);
      case 'velocity': return [...list].sort((a,b) => b.velocityKph - a.velocityKph);
      default:         return list;
    }
  }, [asteroids, hazardOnly, sortBy]);

  const stats = useMemo(() => ({
    total:     asteroids.length,
    hazardous: asteroids.filter(a => a.isHazardous).length,
    closest:   asteroids.length ? Math.min(...asteroids.map(a => a.missDistLunar)).toFixed(2) : '—',
    fastest:   asteroids.length ? Math.max(...asteroids.map(a => a.velocityKph)) : 0,
  }), [asteroids]);

  return (
    <div className="page">
      {/* Stats bar */}
      <div className="stats-bar">
        <div className="stat-box">
          <div className="stat-label">Total Objects</div>
          <div className="stat-value">{loading ? '—' : stats.total}</div>
          <div className="stat-sub">in selected window</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Potentially Hazardous</div>
          <div className={`stat-value ${stats.hazardous > 0 ? 'red' : 'green'}`}>{loading ? '—' : stats.hazardous}</div>
          <div className="stat-sub">PHO classified</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Closest Approach</div>
          <div className="stat-value cyan">{loading ? '—' : stats.closest}</div>
          <div className="stat-sub">lunar distances</div>
        </div>
        <div className="stat-box">
          <div className="stat-label">Max Velocity</div>
          <div className="stat-value">{loading ? '—' : stats.fastest ? (stats.fastest / 3600).toFixed(1) : '—'}</div>
          <div className="stat-sub">km/s fastest object</div>
        </div>
      </div>

      {/* Controls */}
      <div className="controls">
        <div className="date-range">
          <span className="section-label" style={{ marginBottom:0 }}>RANGE</span>
          <input
            type="date" className="hud-date" value={start}
            onChange={e => { setStart(e.target.value); setError(''); }}
          />
          <span className="date-sep">→</span>
          <input
            type="date" className="hud-date" value={end}
            onChange={e => { setEnd(e.target.value); setError(''); }}
          />
          <button className="hud-btn" onClick={handleSearch} disabled={loading}>
            {loading ? 'LOADING...' : '🔍 SEARCH'}
          </button>
        </div>

        <select className="hud-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="date">Sort: Date</option>
          <option value="distance">Sort: Closest</option>
          <option value="size">Sort: Largest</option>
          <option value="velocity">Sort: Fastest</option>
        </select>

        <button
          className={`filter-toggle${hazardOnly ? ' on' : ''}`}
          onClick={() => setHazardOnly(h => !h)}
        >
          ⚠ {hazardOnly ? 'HAZARDOUS ONLY' : 'ALL OBJECTS'}
        </button>
      </div>

      {/* Cache hit indicator */}
      {cacheHit && !error && (
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11,
          color: 'var(--green)', marginBottom: 10, letterSpacing: 1,
        }}>
          ⚡ LOADED FROM CACHE — instant result
        </div>
      )}

      {/* Error message */}
      {error && (
        <div style={{
          background: 'rgba(255,68,68,0.08)',
          border: '1px solid rgba(255,68,68,0.3)',
          borderRadius: 6, padding: '12px 18px', marginBottom: 16,
          fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--red)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          ⚠ {error}
        </div>
      )}

      {/* Main grid */}
      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 340px' : '1fr', gap: 20 }} className="main-grid">
        <div style={{ overflowX: 'auto' }}>
          {loading ? (
            <div className="state-box"><div className="spinner"/><span>FETCHING TELEMETRY...</span></div>
          ) : displayed.length === 0 && !error ? (
            <div className="state-box">
              <div style={{ fontSize: 36 }}>🔭</div>
              <span>SELECT DATES AND CLICK SEARCH</span>
            </div>
          ) : displayed.length === 0 ? null : (
            <table className="asteroid-table">
              <thead>
                <tr>
                  <th>DESIGNATION</th><th>DATE</th><th>MISS DIST</th>
                  <th>VELOCITY</th><th>SIZE</th><th>THREAT</th><th>ALERT</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map(neo => {
                  const threat = threatLevel(neo);
                  const sizeRel = relativeSize(neo.diamMaxKm);
                  return (
                    <tr key={neo.id}
                      className={selected?.id === neo.id ? 'selected' : ''}
                      onClick={() => setSelected(s => s?.id === neo.id ? null : neo)}
                    >
                      <td>
                        <div style={{ fontFamily:'var(--font-mono)', fontSize:13, color: neo.isHazardous ? 'var(--red)' : 'var(--text)' }}>
                          {neo.name}
                        </div>
                        <div style={{ fontSize:10, color:'var(--text2)', marginTop:2 }}>ID: {neo.id}</div>
                      </td>
                      <td style={{ color:'var(--gold)', fontSize:12 }}>{neo.approachDate}</td>
                      <td>
                        <div>{fmtKm(neo.missDistKm)}</div>
                        <div style={{ fontSize:10, color:'var(--text2)' }}>{neo.missDistLunar.toFixed(1)} LD</div>
                      </td>
                      <td>{(neo.velocityKph / 3600).toFixed(2)} km/s</td>
                      <td>
                        <div className="size-bar-wrap">
                          <div className={`size-bar${neo.isHazardous ? ' hazard' : ''}`}
                            style={{ width: Math.max(sizeRel * 80, 4) + 'px' }} />
                          <span style={{ fontSize:11, color:'var(--text2)' }}>{fmtDiam(neo.diamMinKm, neo.diamMaxKm)}</span>
                        </div>
                      </td>
                      <td>
                        <span className="threat-badge" style={{
                          color: threat.color, borderColor: threat.color + '55',
                          background: threat.color + '12', fontSize: 10,
                        }}>
                          {threat.label}
                        </span>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <BellButton asteroid={neo} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {selected && <AsteroidDetail neo={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}
