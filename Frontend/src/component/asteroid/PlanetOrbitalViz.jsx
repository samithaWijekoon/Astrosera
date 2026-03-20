import React, { useEffect, useRef } from 'react';

// Orbital periods in Earth days & reference date (J2000 = Jan 1 2000)
const ORBITAL = {
  mercury: { period: 87.969,   color: '#b5b5b5', radius: 0.387 },
  venus:   { period: 224.701,  color: '#e8cda0', radius: 0.723 },
  earth:   { period: 365.256,  color: '#4b9cd3', radius: 1.000 },
  mars:    { period: 686.971,  color: '#c1440e', radius: 1.524 },
  jupiter: { period: 4332.589, color: '#c88b3a', radius: 5.203 },
  saturn:  { period: 10759.22, color: '#e4d191', radius: 9.537 },
  uranus:  { period: 30688.5,  color: '#7de8e8', radius: 19.19 },
  neptune: { period: 60182,    color: '#3f54ba', radius: 30.07 },
};

// Known angles at J2000 (approximate, in degrees)
const J2000_ANGLES = {
  mercury: 252.3, venus: 181.9, earth: 100.5,
  mars: 355.4, jupiter: 34.4, saturn: 50.1,
  uranus: 314.1, neptune: 304.9,
};

// Days since J2000
function daysSinceJ2000() {
  const j2000 = new Date('2000-01-01T12:00:00Z');
  return (Date.now() - j2000.getTime()) / 86400000;
}

// Current angle in radians for a planet
function currentAngle(planetId) {
  const o = ORBITAL[planetId];
  const j = J2000_ANGLES[planetId];
  const days = daysSinceJ2000();
  const deg = j + (360 / o.period) * days;
  return (deg * Math.PI) / 180;
}

// Draw Saturn's iconic ring system on canvas
function drawSaturnRings(ctx, px, py, dotSize, alpha = 1) {
  const TILT = Math.PI / 6; // 30-degree tilt for visual clarity
  const ringW = dotSize * 3.0;
  const ringH = dotSize * 0.8;

  // Outer ring (slightly translucent)
  ctx.save();
  ctx.globalAlpha = 0.55 * alpha;
  ctx.beginPath();
  ctx.ellipse(px, py, ringW * 1.2, ringH * 1.2, TILT, 0, Math.PI * 2);
  ctx.strokeStyle = '#c8b060';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Inner bright ring
  ctx.globalAlpha = 0.80 * alpha;
  ctx.beginPath();
  ctx.ellipse(px, py, ringW, ringH, TILT, 0, Math.PI * 2);
  ctx.strokeStyle = '#e4d191';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.restore();
}

export default function PlanetOrbitalViz({ planet }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Dark background with subtle radial glow at center
    ctx.fillStyle = 'rgba(2,6,23,0.9)';
    ctx.fillRect(0, 0, W, H);
    const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, W * 0.45);
    bgGlow.addColorStop(0, 'rgba(80,40,180,0.08)');
    bgGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = bgGlow;
    ctx.fillRect(0, 0, W, H);

    const o = ORBITAL[planet.id];
    if (!o) return;

    const isOuter = ['jupiter','saturn','uranus','neptune'].includes(planet.id);
    const planetsToShow = isOuter
      ? ['jupiter','saturn','uranus','neptune']
      : ['mercury','venus','earth','mars'];

    // Scale with more breathing room for outer system
    const maxR = Math.max(...planetsToShow.map(p => ORBITAL[p].radius));
    const padding = isOuter ? 40 : 32;
    const scale = (Math.min(W, H) / 2 - padding) / maxR;

    // Sun glow
    const sunSize = isOuter ? 6 : 10;
    const sunGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunSize * 3);
    sunGlow.addColorStop(0, '#fffde7');
    sunGlow.addColorStop(0.3, '#f59e0b');
    sunGlow.addColorStop(1, 'rgba(245,158,11,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, sunSize * 3, 0, Math.PI * 2);
    ctx.fillStyle = sunGlow;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy, sunSize, 0, Math.PI * 2);
    ctx.fillStyle = '#fff9c4';
    ctx.fill();

    // Collect planet positions for drawing
    const planetPositions = [];
    planetsToShow.forEach(pid => {
      const po = ORBITAL[pid];
      const orbitR = po.radius * scale;
      const angle = currentAngle(pid);
      const px = cx + orbitR * Math.cos(angle);
      const py = cy + orbitR * Math.sin(angle);
      const isSelected = pid === planet.id;
      planetPositions.push({ pid, po, orbitR, angle, px, py, isSelected });
    });

    // Draw orbit rings first
    planetPositions.forEach(({ pid, po, orbitR, isSelected }) => {
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? po.color + '44' : '#ffffff18';
      ctx.lineWidth = isSelected ? 1.5 : 0.8;
      ctx.setLineDash(isSelected ? [] : [3, 5]);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    // Draw planets: Saturn rings (back half) first, then planet body, then rings (front half)
    planetPositions.forEach(({ pid, po, px, py, isSelected }) => {
      const dotSize = isSelected
        ? (isOuter ? 9 : 7)
        : (isOuter ? 5 : 4);

      if (pid === 'saturn') {
        // Draw back half of rings (behind planet body)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(px, py, dotSize * 3.0, dotSize * 0.9, Math.PI / 6, Math.PI, Math.PI * 2);
        ctx.strokeStyle = '#e4d191cc';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(px, py, dotSize * 3.6, dotSize * 1.0, Math.PI / 6, Math.PI, Math.PI * 2);
        ctx.strokeStyle = '#c8b06066';
        ctx.lineWidth = isSelected ? 2 : 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Planet body with glow
      const grd = ctx.createRadialGradient(px - dotSize * 0.3, py - dotSize * 0.3, 0, px, py, dotSize);
      grd.addColorStop(0, po.color + 'ff');
      grd.addColorStop(1, po.color + '88');
      ctx.beginPath();
      ctx.arc(px, py, dotSize, 0, Math.PI * 2);
      ctx.shadowBlur = isSelected ? 18 : 8;
      ctx.shadowColor = po.color;
      ctx.fillStyle = grd;
      ctx.fill();
      ctx.shadowBlur = 0;

      if (pid === 'saturn') {
        // Draw front half of rings (in front of planet body)
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(px, py, dotSize * 3.0, dotSize * 0.9, Math.PI / 6, 0, Math.PI);
        ctx.strokeStyle = '#e4d191cc';
        ctx.lineWidth = isSelected ? 3 : 2;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(px, py, dotSize * 3.6, dotSize * 1.0, Math.PI / 6, 0, Math.PI);
        ctx.strokeStyle = '#c8b06066';
        ctx.lineWidth = isSelected ? 2 : 1.5;
        ctx.stroke();
        ctx.restore();
      }

      // Label for selected planet
      if (isSelected) {
        ctx.fillStyle = po.color;
        ctx.font = `bold ${isOuter ? 11 : 10}px monospace`;
        ctx.textAlign = 'center';
        const labelY = py - dotSize - (pid === 'saturn' ? dotSize * 1.2 : 0) - 8;
        ctx.fillText(planet.name.toUpperCase(), px, labelY);
      }
    });

  }, [planet]);

  const isOuter = ['jupiter','saturn','uranus','neptune'].includes(planet.id);

  return (
    <div className="my-4 bg-[#020617]/80 rounded-xl p-3 border border-white/5">
      <p className="text-sm text-gray-400 uppercase tracking-widest mb-3 text-center">Current Orbital Position</p>
      <canvas ref={canvasRef} width={320} height={320} className="block mx-auto rounded-lg" />
      <p className="text-gray-400 text-sm text-center mt-3 font-medium">
        {isOuter ? 'Outer Solar System' : 'Inner Solar System'}
        <span className="text-gray-600 mx-2">·</span>
        <span className="text-purple-400">Real-time position</span>
      </p>
    </div>
  );
}
