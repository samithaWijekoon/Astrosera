import React from 'react';
import { threatLevel, fmtKm, fmtDiam, relativeSize } from '../services/helpers';
import OrbitalViz from './OrbitalViz';
import BellButton from './BellButton';

export default function AsteroidDetail({ neo, onClose }) {
  if (!neo) return (
    <div className="detail-panel" style={{ minHeight: 400 }}>
      <div className="state-box" style={{ paddingTop: 80 }}>
        <div style={{ fontSize: 40, opacity: 0.3 }}>☄</div>
        <div>SELECT AN ASTEROID</div>
        <div style={{ fontSize: 11, color: 'var(--text3)' }}>Click any row to inspect</div>
      </div>
    </div>
  );

  const threat = threatLevel(neo);
  const sizeRel = relativeSize(neo.diamMaxKm);

  return (
    <div className="detail-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div className="section-label">// OBJECT REPORT</div>
          <div className="detail-name">{neo.name}</div>
          <div className="detail-id">ID: {neo.id} · JPL</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <BellButton asteroid={neo} />
          <button onClick={onClose} style={{ background:'none', border:'1px solid var(--border)', color:'var(--text2)', borderRadius:4, width:32, height:32, cursor:'pointer', fontFamily:'var(--font-mono)', fontSize:14 }}>✕</button>
        </div>
      </div>

      {/* Threat badge */}
      <div style={{ marginBottom: 16 }}>
        <span className="threat-badge" style={{
          color: threat.color,
          borderColor: threat.color + '55',
          background: threat.color + '12',
        }}>
          {threat.level >= 3 ? '▲' : '●'} THREAT: {threat.label}
        </span>
        {neo.isHazardous && (
          <span className="threat-badge" style={{ marginLeft: 8, color:'var(--red)', borderColor:'rgba(255,68,68,0.4)', background:'var(--red-dim)' }}>
            ⚠ PHO CLASSIFIED
          </span>
        )}
      </div>

      {/* Orbital visualization */}
      <div className="orbital-viz">
        <OrbitalViz missDistLunar={neo.missDistLunar} isHazardous={neo.isHazardous} />
      </div>

      {/* Data rows */}
      <div className="detail-row">
        <span className="detail-key">APPROACH DATE</span>
        <span className="detail-val highlight">{neo.approachDate}</span>
      </div>
      <div className="detail-row">
        <span className="detail-key">MISS DISTANCE</span>
        <span className="detail-val">{fmtKm(neo.missDistKm)}</span>
      </div>
      <div className="detail-row">
        <span className="detail-key">LUNAR DISTANCE</span>
        <span className={`detail-val ${neo.missDistLunar < 5 ? 'danger' : neo.missDistLunar < 20 ? '' : 'safe'}`}>
          {neo.missDistLunar.toFixed(2)} LD
        </span>
      </div>
      <div className="detail-row">
        <span className="detail-key">VELOCITY</span>
        <span className="detail-val">{(neo.velocityKph / 1000).toFixed(1)} km/s</span>
      </div>
      <div className="detail-row">
        <span className="detail-key">EST. DIAMETER</span>
        <span className="detail-val">{fmtDiam(neo.diamMinKm, neo.diamMaxKm)}</span>
      </div>
      <div className="detail-row">
        <span className="detail-key">RELATIVE SIZE</span>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{
            height: 6, borderRadius: 3,
            width: Math.max(sizeRel * 100, 4) + 'px',
            background: neo.isHazardous ? 'var(--red)' : 'var(--gold)',
          }} />
          <span className="detail-val" style={{ fontSize: 11 }}>{(neo.diamMaxKm * 1000).toFixed(0)}m max</span>
        </div>
      </div>
      <div className="detail-row">
        <span className="detail-key">ABS. MAGNITUDE</span>
        <span className="detail-val">{neo.absoluteMagnitude} H</span>
      </div>
      <div className="detail-row">
        <span className="detail-key">ORBITING</span>
        <span className="detail-val">{neo.orbitingBody}</span>
      </div>

      <a
        href={`https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${neo.id}`}
        target="_blank"
        rel="noreferrer"
        className="hud-btn"
        style={{ display:'block', textAlign:'center', marginTop:20, textDecoration:'none' }}
      >
        VIEW NASA JPL DATA →
      </a>
    </div>
  );
}
