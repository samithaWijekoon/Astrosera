import React, { useEffect, useRef } from 'react';

// Relative orbital distances (AU scaled)
const ORBIT_AU = {
  mercury: 0.39, venus: 0.72, earth: 1.0,
  mars: 1.52, jupiter: 5.2, saturn: 9.58,
  uranus: 19.2, neptune: 30.05,
};

const PLANET_COLORS = {
  mercury: '#b5b5b5', venus: '#e8cda0', earth: '#4b9cd3',
  mars: '#c1440e', jupiter: '#c88b3a', saturn: '#e4d191',
  uranus: '#7de8e8', neptune: '#3f54ba',
};

// Approximate current angle (degrees) based on orbital period
function currentAngle(orbitalPeriodDays) {
  const now = Date.now();
  const dayMs = 86400000;
  const daysSinceEpoch = now / dayMs;
  return ((daysSinceEpoch / orbitalPeriodDays) * 360) % 360;
}

const ORBITAL_PERIODS = {
  mercury: 87.97, venus: 224.7, earth: 365.25,
  mars: 686.97, jupiter: 4332.6, saturn: 10759.2,
  uranus: 30688.5, neptune: 60182,
};

export default function PlanetViz({ planet }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    const targetAU = ORBIT_AU[planet.id];

    // Decide which planets to show based on target
    const innerPlanets = ['mercury','venus','earth','mars'];
    const allPlanets   = ['mercury','venus','earth','mars','jupiter','saturn','uranus','neptune'];
    const showList     = innerPlanets.includes(planet.id)
      ? ['mercury','venus','earth','mars']
      : allPlanets;

    // Scale: fit all shown orbits
    const maxAU  = ORBIT_AU[showList[showList.length - 1]];
    const radius = (W / 2) - 18;
    const scale  = au => (au / maxAU) * radius;

    // Draw Sun
    const sunGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 10);
    sunGrad.addColorStop(0, '#fff7aa');
    sunGrad.addColorStop(1, '#f59e0b');
    ctx.shadowBlur = 18; ctx.shadowColor = '#f59e0b88';
    ctx.fillStyle = sunGrad;
    ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Draw orbits + planets
    showList.forEach(pid => {
      const au    = ORBIT_AU[pid];
      const r     = scale(au);
      const color = PLANET_COLORS[pid];
      const angle = (currentAngle(ORBITAL_PERIODS[pid]) * Math.PI) / 180;
      const px    = cx + r * Math.cos(angle);
      const py    = cy + r * Math.sin(angle);
      const isTarget = pid === planet.id;
      const isEarth  = pid === 'earth';

      // Orbit ring
      ctx.strokeStyle = isTarget
        ? `${color}55`
        : isEarth ? 'rgba(75,156,211,0.25)' : 'rgba(255,255,255,0.08)';
      ctx.lineWidth   = isTarget ? 1.5 : 1;
      ctx.setLineDash(isTarget ? [4, 4] : []);
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);

      // Planet dot
      const dotSize = isTarget ? 6 : isEarth ? 5 : 3.5;
      ctx.shadowBlur  = isTarget ? 14 : isEarth ? 8 : 0;
      ctx.shadowColor = color;
      ctx.fillStyle   = color;
      ctx.beginPath(); ctx.arc(px, py, dotSize, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur  = 0;

      // Label for target and Earth
      if (isTarget || isEarth) {
        ctx.fillStyle  = isTarget ? color : 'rgba(75,156,211,0.8)';
        ctx.font       = `${isTarget ? 'bold ' : ''}9px monospace`;
        ctx.textAlign  = 'center';
        ctx.fillText(isTarget ? planet.name.toUpperCase() : 'Earth', px, py - dotSize - 5);
      }

      // Saturn ring
      if (pid === 'saturn') {
        ctx.strokeStyle = '#e4d19155';
        ctx.lineWidth   = 1.5;
        ctx.beginPath();
        ctx.ellipse(px, py, dotSize + 5, dotSize + 1.5, angle, 0, Math.PI * 2);
        ctx.stroke();
      }
    });

    // Distance line: Earth → target planet
    const earthAngle  = (currentAngle(ORBITAL_PERIODS.earth)  * Math.PI) / 180;
    const targetAngle = (currentAngle(ORBITAL_PERIODS[planet.id]) * Math.PI) / 180;
    const ex = cx + scale(1.0) * Math.cos(earthAngle);
    const ey = cy + scale(1.0) * Math.sin(earthAngle);
    const tx = cx + scale(targetAU) * Math.cos(targetAngle);
    const ty = cy + scale(targetAU) * Math.sin(targetAngle);

    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = `${PLANET_COLORS[planet.id]}66`;
    ctx.lineWidth   = 1;
    ctx.beginPath(); ctx.moveTo(ex, ey); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.setLineDash([]);

    // Current distance label
    const dx   = tx - ex, dy = ty - ey;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const auDist = (targetAU === 1.0 ? 0 : Math.abs(targetAU - 1.0)).toFixed(2);
    const mx = (ex + tx) / 2, my = (ey + ty) / 2;
    ctx.fillStyle  = 'rgba(150,150,150,0.7)';
    ctx.font       = '8px monospace';
    ctx.textAlign  = 'center';
    if (dist > 20) ctx.fillText(`~${auDist} AU from Earth`, mx, my - 4);

  }, [planet]);

  return (
    <div className="my-4">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Current Position</p>
      <canvas ref={canvasRef} width={220} height={220} className="block mx-auto" />
      <p className="text-center text-gray-600 text-xs mt-1">Top-down view · Positions approximate</p>
    </div>
  );
}
