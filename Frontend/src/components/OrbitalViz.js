import React from 'react';

export default function OrbitalViz({ missDistLunar = 10, isHazardous = false }) {
  // Lunar distance: 1 LD = 384,400 km. Show up to 50 LD on chart.
  const maxLD  = 50;
  const norm   = Math.min(missDistLunar / maxLD, 1);
  const cx     = 110; // center (Earth)
  const cy     = 110;
  const R      = 80;  // max orbit radius in px
  const astR   = norm * R;
  const astX   = cx + astR;
  const astY   = cy;
  const color  = isHazardous ? '#ff4444' : '#f5a623';
  const moonR  = (1 / maxLD) * R; // 1 LD ring
  const moonX  = cx + moonR;

  return (
    <svg width="220" height="220" viewBox="0 0 220 220" style={{ overflow: 'visible' }}>
      <defs>
        <radialGradient id="earthGrad" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#1a6dab" />
          <stop offset="100%" stopColor="#0a3050" />
        </radialGradient>
        <radialGradient id="astGrad" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#c8b090" />
          <stop offset="100%" stopColor="#5a4020" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Orbit rings */}
      {[0.25, 0.5, 0.75, 1].map(f => (
        <circle key={f} cx={cx} cy={cy} r={f * R}
          fill="none" stroke="rgba(245,166,35,0.08)" strokeWidth="1" strokeDasharray="3,4" />
      ))}

      {/* Moon orbit ring (1 LD) */}
      <circle cx={cx} cy={cy} r={moonR}
        fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />

      {/* Moon marker */}
      <circle cx={moonX} cy={cy} r={2.5} fill="rgba(255,255,255,0.4)" />
      <text x={moonX + 4} y={cy + 4} fill="rgba(255,255,255,0.3)" fontSize="7" fontFamily="monospace">1LD</text>

      {/* Radar sweep */}
      <g className="radar-ring">
        <line x1={cx} y1={cy} x2={cx + R} y2={cy}
          stroke={`${color}30`} strokeWidth="1.5" />
      </g>

      {/* Distance line */}
      <line x1={cx} y1={cy} x2={astX} y2={astY}
        stroke={`${color}40`} strokeWidth="1" strokeDasharray="4,3" />

      {/* Earth */}
      <circle cx={cx} cy={cy} r={10} fill="url(#earthGrad)" />
      <circle cx={cx} cy={cy} r={10} fill="none" stroke="rgba(100,180,255,0.3)" strokeWidth="1" />
      <text x={cx} y={cy + 20} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="monospace">EARTH</text>

      {/* Asteroid */}
      <circle cx={astX} cy={astY} r={5} fill="url(#astGrad)" filter="url(#glow)" />
      <circle cx={astX} cy={astY} r={8} fill="none" stroke={`${color}60`} strokeWidth="1" />
      <text x={astX} y={astY + 18} textAnchor="middle" fill={color} fontSize="8" fontFamily="monospace">
        {missDistLunar.toFixed(1)} LD
      </text>

      {/* Pulsing alert if hazardous */}
      {isHazardous && (
        <circle cx={astX} cy={astY} r={12} fill="none" stroke={color} strokeWidth="1" opacity="0.6">
          <animate attributeName="r" from="8" to="18" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" from="0.8" to="0" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
    </svg>
  );
}
