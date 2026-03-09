import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFeed } from '../../services/api';
import { flattenFeed, threatLevel, fmtKm, fmtDiam, relativeSize } from '../../services/helpers';
import AsteroidDetail from '../../component/asteroid/AsteroidDetail';
import BellButton from '../../component/asteroid/BellButton';
import { useUser } from '../../context/UserContext';

function fmt(d) { return d.toISOString().split('T')[0]; }
const sessionCache = {};

export default function Member2() {
  const { email, saveEmail } = useUser();
  const [asteroids,  setAsteroids]  = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');
  const [selected,   setSelected]   = useState(null);
  const [hazardOnly, setHazardOnly] = useState(false);
  const [sortBy,     setSortBy]     = useState('date');
  const [editEmail,  setEditEmail]  = useState(false);
  const [draftEmail, setDraftEmail] = useState('');
  const loaded = useRef(false);

  const START = useMemo(() => fmt(new Date()), []);
  const END   = useMemo(() => fmt(new Date(Date.now() + 6 * 86400000)), []);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    load();
  }, []); // eslint-disable-line

  async function load() {
    const key = `${START}_${END}`;
    setError(''); setSelected(null);
    if (sessionCache[key]) { setAsteroids(sessionCache[key]); setLoading(false); return; }
    setLoading(true);
    try {
      const data = await getFeed(START, END);
      const flat = flattenFeed(data);
      sessionCache[key] = flat;
      setAsteroids(flat);
    } catch (err) {
      setError(err?.response?.status === 429
        ? 'NASA API rate limit reached. Please wait a moment and try again.'
        : 'Could not connect to backend. Make sure it is running on port 5000.');
      setAsteroids([]);
    } finally { setLoading(false); }
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
    fastest:   asteroids.length ? (Math.max(...asteroids.map(a => a.velocityKph)) / 3600).toFixed(1) : '—',
  }), [asteroids]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-6 md:px-12 font-outfit">

      {/* Page Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
          Asteroid <span className="text-purple-400">Tracker</span>
        </h1>
        <p className="text-gray-400 text-sm">
          Live near-Earth objects for {START} → {END} · Powered by NASA NeoWs API
        </p>
      </div>

      {/* Email bar */}
      <div className="max-w-7xl mx-auto mb-6 flex items-center gap-3 flex-wrap">
        <span className="text-gray-500 text-xs uppercase tracking-widest">Observer Email:</span>
        {editEmail ? (
          <div className="flex gap-2">
            <input
              type="email"
              value={draftEmail}
              onChange={e => setDraftEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-gray-900 border border-gray-700 text-white text-xs px-3 py-1.5 rounded focus:outline-none focus:border-purple-500"
            />
            <button onClick={() => { saveEmail(draftEmail); setEditEmail(false); }}
              className="text-xs px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700">Save</button>
            <button onClick={() => setEditEmail(false)}
              className="text-xs px-3 py-1.5 border border-gray-700 text-gray-400 rounded hover:border-gray-500">Cancel</button>
          </div>
        ) : (
          <button onClick={() => { setDraftEmail(email); setEditEmail(true); }}
            className="text-xs px-3 py-1.5 border border-gray-700 rounded text-purple-400 hover:border-purple-600 transition-colors">
            {email || '+ Set email for alerts'}
          </button>
        )}
        <Link to="/asteroid-alerts" className="text-xs px-3 py-1.5 border border-purple-800 text-purple-400 rounded hover:bg-purple-900/30 transition-colors ml-auto">
          My Alerts →
        </Link>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Objects',        value: loading ? '—' : stats.total,     sub: '7-day window',       color: 'text-white' },
          { label: 'Potentially Hazardous',value: loading ? '—' : stats.hazardous, sub: 'PHO classified',     color: stats.hazardous > 0 ? 'text-red-400' : 'text-green-400' },
          { label: 'Closest Approach',     value: loading ? '—' : stats.closest,   sub: 'lunar distances',    color: 'text-purple-400' },
          { label: 'Max Velocity',         value: loading ? '—' : stats.fastest,   sub: 'km/s fastest object',color: 'text-white' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900/60 border border-purple-900/30 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-600 to-transparent" />
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">{s.label}</p>
            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-gray-600 text-xs mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="max-w-7xl mx-auto flex gap-3 mb-6 flex-wrap items-center">
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-gray-300 text-xs px-3 py-2 rounded focus:outline-none focus:border-purple-500">
          <option value="date">Sort: Date</option>
          <option value="distance">Sort: Closest</option>
          <option value="size">Sort: Largest</option>
          <option value="velocity">Sort: Fastest</option>
        </select>

        <button onClick={() => setHazardOnly(h => !h)}
          className={`text-xs px-3 py-2 rounded border transition-colors ${
            hazardOnly ? 'border-red-500 text-red-400 bg-red-500/10' : 'border-gray-700 text-gray-400 hover:border-gray-500'
          }`}>
          ⚠ {hazardOnly ? 'Hazardous Only' : 'All Objects'}
        </button>

        <button onClick={load}
          className="text-xs px-3 py-2 rounded border border-purple-700 text-purple-400 hover:bg-purple-700/20 transition-colors">
          ↻ Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6 bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3 text-red-400 text-sm">
          ⚠ {error}
        </div>
      )}

      {/* Main content */}
      <div className={`max-w-7xl mx-auto grid gap-6 ${selected ? 'grid-cols-1 lg:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
              <div className="w-10 h-10 border-2 border-gray-700 border-t-purple-500 rounded-full animate-spin" />
              <span className="text-xs uppercase tracking-widest">Fetching telemetry...</span>
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
              <span className="text-5xl">🔭</span>
              <span className="text-xs uppercase tracking-widest">No objects found</span>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800">
                  {['Designation', 'Date', 'Miss Dist', 'Velocity', 'Size', 'Threat', 'Alert'].map(h => (
                    <th key={h} className="text-left text-xs text-gray-500 uppercase tracking-widest pb-3 px-3 font-normal whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayed.map(neo => {
                  const threat    = threatLevel(neo);
                  const sizeRel   = relativeSize(neo.diamMaxKm);
                  const cleanName = neo.name.replace(/^\(|\)$/g, '');
                  const isNamed   = !neo.name.startsWith('(');
                  const isSelected = selected?.id === neo.id;

                  return (
                    <tr key={neo.id}
                      onClick={() => setSelected(s => s?.id === neo.id ? null : neo)}
                      className={`cursor-pointer border-b border-gray-900 transition-colors ${
                        isSelected ? 'bg-purple-900/20' : 'hover:bg-gray-900/60'
                      }`}
                    >
                      <td className="px-3 py-3">
                        <div className={`font-mono text-xs font-semibold ${neo.isHazardous ? 'text-red-400' : 'text-gray-200'}`}>
                          {neo.name}
                        </div>
                        {isNamed && <div className="text-yellow-500/60 text-xs italic mt-0.5">{cleanName}</div>}
                        <div className="text-gray-600 text-xs mt-0.5">ID: {neo.id}</div>
                      </td>
                      <td className="px-3 py-3 text-yellow-400 text-xs whitespace-nowrap">{neo.approachDate}</td>
                      <td className="px-3 py-3">
                        <div className="text-gray-300 text-xs">{fmtKm(neo.missDistKm)}</div>
                        <div className="text-gray-600 text-xs">{neo.missDistLunar.toFixed(1)} LD</div>
                      </td>
                      <td className="px-3 py-3 text-gray-300 text-xs whitespace-nowrap">
                        {(neo.velocityKph / 3600).toFixed(2)} km/s
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-1 rounded-full ${neo.isHazardous ? 'bg-red-500' : 'bg-purple-500'}`}
                            style={{ width: Math.max(sizeRel * 60, 4) + 'px' }} />
                          <span className="text-gray-500 text-xs">{fmtDiam(neo.diamMinKm, neo.diamMaxKm)}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <span className="text-xs px-2 py-0.5 rounded border" style={{ color: threat.color, borderColor: threat.color + '55', background: threat.color + '15' }}>
                          {threat.label}
                        </span>
                      </td>
                      <td className="px-3 py-3" onClick={e => e.stopPropagation()}>
                        <BellButton asteroid={neo} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Detail panel */}
        {selected && <AsteroidDetail neo={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}
