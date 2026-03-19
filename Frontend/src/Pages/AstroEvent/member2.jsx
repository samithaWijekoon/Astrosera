import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFeed } from '../../services/api';
import { flattenFeed, threatLevel, fmtDiam, relativeSize } from '../../services/helpers';
import AsteroidDetail from '../../component/asteroid/AsteroidDetail';
import PlanetOrbitalViz from '../../component/asteroid/PlanetOrbitalViz';
import BellButton from '../../component/asteroid/BellButton';
import PlanetViz from '../../component/asteroid/PlanetViz';
import { useUser } from '../../context/AuthContext';

// ─── Planet Data ────────────────────────────────────────────────────────────
const PLANETS = [
  { id: 'mercury', name: 'Mercury', color: '#b5b5b5', glow: '#888',    size: 24 },
  { id: 'venus',   name: 'Venus',   color: '#e8cda0', glow: '#c8a96e', size: 36 },
  { id: 'earth',   name: 'Earth',   color: '#4b9cd3', glow: '#4b9cd3', size: 38 },
  { id: 'mars',    name: 'Mars',    color: '#c1440e', glow: '#c1440e', size: 30 },
  { id: 'jupiter', name: 'Jupiter', color: '#c88b3a', glow: '#c88b3a', size: 72 },
  { id: 'saturn',  name: 'Saturn',  color: '#e4d191', glow: '#c8b560', size: 64 },
  { id: 'uranus',  name: 'Uranus',  color: '#7de8e8', glow: '#7de8e8', size: 50 },
  { id: 'neptune', name: 'Neptune', color: '#3f54ba', glow: '#3f54ba', size: 48 },
];

const PLANET_DATA = {
  mercury: { meanRadius: 2439.7,  gravity: 3.7,   sideralOrbit: 87.969,   sideralRotation: 1407.6,   axialTilt: 0.034,   density: 5.427, escapeV: 4.25,  avgTemp: 167,  discoveredBy: 'Known since antiquity', discoveryDate: '—', moons: [],                                                          distFromSun: 57.9   },
  venus:   { meanRadius: 6051.8,  gravity: 8.87,  sideralOrbit: 224.701,  sideralRotation: -5832.5,  axialTilt: 177.4,   density: 5.243, escapeV: 10.36, avgTemp: 464,  discoveredBy: 'Known since antiquity', discoveryDate: '—', moons: [],                                                          distFromSun: 108.2  },
  earth:   { meanRadius: 6371.0,  gravity: 9.798, sideralOrbit: 365.256,  sideralRotation: 23.9345,  axialTilt: 23.4393, density: 5.514, escapeV: 11.19, avgTemp: 15,   discoveredBy: 'Known since antiquity', discoveryDate: '—', moons: ['Moon'],                                                    distFromSun: 149.6  },
  mars:    { meanRadius: 3389.5,  gravity: 3.721, sideralOrbit: 686.971,  sideralRotation: 24.6229,  axialTilt: 25.19,   density: 3.933, escapeV: 5.03,  avgTemp: -65,  discoveredBy: 'Known since antiquity', discoveryDate: '—', moons: ['Phobos', 'Deimos'],                                        distFromSun: 227.9  },
  jupiter: { meanRadius: 69911,   gravity: 24.79, sideralOrbit: 4332.589, sideralRotation: 9.9259,   axialTilt: 3.13,    density: 1.326, escapeV: 59.5,  avgTemp: -110, discoveredBy: 'Known since antiquity', discoveryDate: '—', moons: ['Io','Europa','Ganymede','Callisto','+ 91 more'],           distFromSun: 778.5  },
  saturn:  { meanRadius: 58232,   gravity: 10.44, sideralOrbit: 10759.22, sideralRotation: 10.656,   axialTilt: 26.73,   density: 0.687, escapeV: 35.5,  avgTemp: -140, discoveredBy: 'Known since antiquity', discoveryDate: '—', moons: ['Titan','Enceladus','Mimas','Rhea','+ 142 more'],          distFromSun: 1432   },
  uranus:  { meanRadius: 25362,   gravity: 8.87,  sideralOrbit: 30688.5,  sideralRotation: -17.24,   axialTilt: 97.77,   density: 1.27,  escapeV: 21.3,  avgTemp: -195, discoveredBy: 'William Herschel',      discoveryDate: '1781', moons: ['Miranda','Ariel','Umbriel','Titania','Oberon','+ 22 more'], distFromSun: 2867   },
  neptune: { meanRadius: 24622,   gravity: 11.15, sideralOrbit: 60182,    sideralRotation: 16.11,    axialTilt: 28.32,   density: 1.638, escapeV: 23.5,  avgTemp: -200, discoveredBy: 'Le Verrier / Adams',    discoveryDate: '1846', moons: ['Triton','Nereid','+ 14 more'],                            distFromSun: 4515   },
};

function fmtNum(n, unit) {
  if (n === undefined || n === null) return '—';
  return Number(n).toLocaleString() + (unit ? ' ' + unit : '');
}

// ─── Planet Card ─────────────────────────────────────────────────────────────
function PlanetCard({ planet, isSelected, onClick }) {
  const data = PLANET_DATA[planet.id];
  return (
    <button onClick={onClick}
      className={`relative flex flex-col items-center p-4 rounded-xl border transition-all duration-300 cursor-pointer w-full ${
        isSelected ? 'border-purple-500 bg-purple-900/30' : 'border-gray-800 bg-gray-900/40 hover:border-purple-800 hover:bg-gray-900/70'
      }`}>
      <div className="rounded-full mb-3 flex-shrink-0" style={{
        width: Math.max(planet.size, 32) + 'px', height: Math.max(planet.size, 32) + 'px',
        background: `radial-gradient(circle at 35% 35%, ${planet.color}cc, ${planet.color}44)`,
        boxShadow: isSelected ? `0 0 20px ${planet.glow}66` : `0 0 8px ${planet.glow}33`,
        border: `1px solid ${planet.color}44`,
      }} />
      {planet.id === 'saturn' && (
        <div className="absolute" style={{ top: '22px', left: '50%', transform: 'translateX(-50%)', width: '90px', height: '12px', border: `2px solid #e4d19155`, borderRadius: '50%', pointerEvents: 'none' }} />
      )}
      <p className="text-white text-xs font-semibold uppercase tracking-wider">{planet.name}</p>
      <p className="text-gray-500 text-xs mt-0.5">{fmtNum(data.distFromSun)} M km</p>
    </button>
  );
}

// ─── Planet Detail ────────────────────────────────────────────────────────────
function PlanetDetail({ planet }) {
  const data = PLANET_DATA[planet.id];
  if (!data) return null;
  const rows = [
    ['Radius',           fmtNum(data.meanRadius, 'km')],
    ['Gravity',          fmtNum(data.gravity, 'm/s²')],
    ['Distance from Sun',fmtNum(data.distFromSun, 'M km')],
    ['Orbital Period',   data.sideralOrbit >= 365 ? (data.sideralOrbit / 365.25).toFixed(2) + ' years' : fmtNum(data.sideralOrbit, 'days')],
    ['Rotation Period',  Math.abs(data.sideralRotation) > 100
      ? (Math.abs(data.sideralRotation) / 24).toFixed(1) + ' days' + (data.sideralRotation < 0 ? ' (retrograde)' : '')
      : fmtNum(Math.abs(data.sideralRotation), 'hrs') + (data.sideralRotation < 0 ? ' (retrograde)' : '')],
    ['Axial Tilt',       fmtNum(data.axialTilt, '°')],
    ['Density',          fmtNum(data.density, 'g/cm³')],
    ['Escape Velocity',  fmtNum(data.escapeV, 'km/s')],
    ['Avg Temperature',  fmtNum(data.avgTemp, '°C')],
    ['Type',             ['mercury','venus','earth','mars'].includes(planet.id) ? 'Terrestrial' : 'Gas / Ice Giant'],
    ['Discovered By',    data.discoveredBy],
    ['Discovery Year',   data.discoveryDate],
  ];
  return (
    <div className="bg-gray-900/70 border border-purple-900/40 rounded-xl p-6 mt-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="rounded-full flex-shrink-0" style={{
          width: 52, height: 52,
          background: `radial-gradient(circle at 35% 35%, ${planet.color}cc, ${planet.color}44)`,
          boxShadow: `0 0 24px ${planet.glow}55`,
          border: `1px solid ${planet.color}44`,
        }} />
        <div>
          <h2 className="text-white text-2xl font-bold">{planet.name}</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Solar System Planet</p>
        </div>
      </div>
      <PlanetOrbitalViz planet={planet} />

      <div className="space-y-0 mb-5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between py-2 border-b border-gray-800/60 last:border-0">
            <span className="text-gray-500 text-xs uppercase tracking-wide">{k}</span>
            <span className="text-gray-200 text-xs font-mono text-right max-w-[55%]">{v}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Moons ({data.moons.length === 0 ? 'None' : data.moons.length})</p>
      {data.moons.length === 0 ? (
        <p className="text-gray-600 text-xs">No natural satellites</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {data.moons.map(m => (
            <span key={m} className="text-xs px-2 py-1 rounded border border-purple-900/50 text-purple-300 bg-purple-900/20">{m}</span>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Planets Tab ─────────────────────────────────────────────────────────────
function PlanetsTab() {
  const [selected, setSelected] = useState(PLANETS[2]);
  return (
    <div>
      {/* Sun banner */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/20 border border-yellow-800/30 rounded-xl p-4 mb-6 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full flex-shrink-0" style={{
          background: 'radial-gradient(circle at 35% 35%, #fff7aa, #f59e0b88)',
          boxShadow: '0 0 30px #f59e0b66',
        }} />
        <div>
          <p className="text-yellow-300 font-semibold">The Sun</p>
          <p className="text-gray-400 text-xs">Radius: 695,700 km · Mass: 1.989 × 10³⁰ kg · Surface Temp: 5,778 K · Age: ~4.6 billion years</p>
        </div>
      </div>

      {/* Planet grid */}
      <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">Select a Planet</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
        {PLANETS.map(p => (
          <PlanetCard key={p.id} planet={p} isSelected={selected?.id === p.id} onClick={() => setSelected(p)} />
        ))}
      </div>

      {selected && <PlanetDetail planet={selected} />}

      {/* Quick facts */}
      <div className="bg-gray-900/40 border border-gray-800 rounded-xl p-5 mt-6">
        <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">Quick Facts</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: 'Largest Planet',  value: 'Jupiter', sub: '69,911 km radius' },
            { label: 'Smallest Planet', value: 'Mercury', sub: '2,439 km radius'  },
            { label: 'Hottest Planet',  value: 'Venus',   sub: '464°C avg'        },
            { label: 'Coldest Planet',  value: 'Neptune', sub: '-200°C avg'       },
            { label: 'Most Moons',      value: 'Saturn',  sub: '146 moons'        },
            { label: 'Longest Day',     value: 'Venus',   sub: '243 Earth days'   },
          ].map(f => (
            <div key={f.label} className="bg-black/30 rounded-lg p-3">
              <p className="text-gray-500 text-xs">{f.label}</p>
              <p className="text-purple-400 font-semibold text-sm mt-1">{f.value}</p>
              <p className="text-gray-600 text-xs">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(d) { return d.toISOString().split('T')[0]; }
const sessionCache = {};

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function Member2() {
  const { email, saveEmail } = useUser();
  const [tab,        setTab]        = useState('asteroids'); // 'asteroids' | 'planets'
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
        : 'Could not connect to backend. Make sure it is running on port 5001.');
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
    <div className="relative min-h-screen bg-gradient-to-b from-[#020617] via-[#0f172a] to-[#020617] font-outfit">
      
      {/* Stars Background Layer */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40 z-0" 
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='1' fill='%23ffffff'/%3E%3Ccircle cx='75' cy='45' r='1.5' fill='%23ffffff'/%3E%3Ccircle cx='45' cy='85' r='0.8' fill='%23ffffff'/%3E%3Ccircle cx='85' cy='10' r='1' fill='%23ffffff'/%3E%3C/svg%3E\")" }}
      ></div>

      <div className="relative z-10 pt-24 pb-16 px-6 md:px-12">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Space <span className="text-purple-400">Explorer</span>
          </h1>
          <p className="text-gray-400 text-sm">Near-Earth objects & Solar System planets · Powered by NASA</p>
        </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex gap-1 bg-gray-900/60 border border-gray-800 rounded-xl p-1 w-fit">
          {[
            { key: 'asteroids', label: '🪨 Small Bodies' },
            { key: 'planets',   label: '🪐 Planets'      },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === t.key
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── PLANETS TAB ── */}
      {tab === 'planets' && (
        <div className="max-w-7xl mx-auto">
          <PlanetsTab />
        </div>
      )}

      {/* ── ASTEROIDS TAB ── */}
      {tab === 'asteroids' && (
        <>
          {/* Email bar */}
          <div className="max-w-7xl mx-auto mb-6 flex items-center gap-3 flex-wrap">
            <span className="text-gray-500 text-xs uppercase tracking-widest">Observer Email:</span>
            {editEmail ? (
              <div className="flex gap-2">
                <input type="email" value={draftEmail} onChange={e => setDraftEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-gray-900 border border-gray-700 text-white text-xs px-3 py-1.5 rounded focus:outline-none focus:border-purple-500" />
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
              { label: 'Total Objects',         value: loading ? '—' : stats.total,     sub: '7-day window',        color: 'text-white' },
              { label: 'Potentially Hazardous', value: loading ? '—' : stats.hazardous, sub: 'PHO classified',      color: stats.hazardous > 0 ? 'text-red-400' : 'text-green-400' },
              { label: 'Closest Approach',      value: loading ? '—' : stats.closest,   sub: 'lunar distances',     color: 'text-purple-400' },
              { label: 'Max Velocity',          value: loading ? '—' : stats.fastest,   sub: 'km/s fastest object', color: 'text-white' },
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

          {/* Table + Detail */}
          <div className={`max-w-7xl mx-auto grid gap-6 ${selected ? 'grid-cols-1 lg:grid-cols-[1fr_360px]' : 'grid-cols-1'}`}>
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
                      {['Designation', 'Date', 'Velocity', 'Size', 'Threat', 'Alert'].map(h => (
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
                          className={`cursor-pointer border-b border-gray-900 transition-colors ${isSelected ? 'bg-purple-900/20' : 'hover:bg-gray-900/60'}`}>
                          <td className="px-3 py-3">
                            <div className={`font-mono text-xs font-semibold ${neo.isHazardous ? 'text-red-400' : 'text-gray-200'}`}>{neo.name}</div>
                            {isNamed && <div className="text-yellow-500/60 text-xs italic mt-0.5">{cleanName}</div>}
                            <div className="text-gray-600 text-xs mt-0.5">ID: {neo.id}</div>
                          </td>
                          <td className="px-3 py-3 text-yellow-400 text-xs whitespace-nowrap">{neo.approachDate}</td>
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
            {selected && <AsteroidDetail neo={selected} onClose={() => setSelected(null)} />}
          </div>
        </>
      )}
      </div>
    </div>
  );
}
