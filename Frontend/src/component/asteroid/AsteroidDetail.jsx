import React from 'react';
import { threatLevel, fmtKm, fmtDiam } from '../../services/helpers';
import OrbitalViz from './OrbitalViz';
import BellButton from './BellButton';

export default function AsteroidDetail({ neo, onClose }) {
  const threat    = threatLevel(neo);
  const cleanName = neo.name.replace(/^\(|\)$/g, '');

  return (
    <div className="bg-gray-900/80 border border-purple-900/40 rounded-xl p-5 sticky top-24 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-start mb-1">
        <h3 className="text-purple-400 font-mono text-sm font-bold pr-4 break-words">{neo.name}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white text-lg leading-none flex-shrink-0">✕</button>
      </div>
      <p className="text-yellow-400/70 text-xs italic mb-3">{cleanName}</p>

      <span className="inline-block text-xs px-2 py-0.5 rounded border mb-4" style={{ color: threat.color, borderColor: threat.color + '55', background: threat.color + '15' }}>
        {threat.label}
      </span>

      <OrbitalViz neo={neo} />

      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 mt-2">Telemetry</p>

      {[
        ['Approach',  neo.approachFull || neo.approachDate],
        ['Miss Dist', fmtKm(neo.missDistKm)],
        ['Lunar Dist',neo.missDistLunar.toFixed(2) + ' LD'],
        ['Velocity',  (neo.velocityKph / 3600).toFixed(2) + ' km/s'],
        ['Diameter',  fmtDiam(neo.diamMinKm, neo.diamMaxKm)],
        ['Hazardous', neo.isHazardous ? '⚠ YES' : 'NO'],
      ].map(([k, v]) => (
        <div key={k} className="flex justify-between py-2 border-b border-gray-800 last:border-0">
          <span className="text-gray-500 text-xs uppercase tracking-wide">{k}</span>
          <span className={`font-mono text-xs ${k === 'Hazardous' && neo.isHazardous ? 'text-red-400' : 'text-gray-300'}`}>{v}</span>
        </div>
      ))}

      <div className="flex gap-3 mt-4">
        <BellButton asteroid={neo} />
        <a href={neo.nasaJplUrl} target="_blank" rel="noreferrer"
          className="text-xs px-3 py-1.5 border border-purple-700 text-purple-400 rounded hover:bg-purple-700/20 transition-colors">
          JPL DATA →
        </a>
      </div>
    </div>
  );
}
