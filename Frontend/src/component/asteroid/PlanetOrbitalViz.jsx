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

export default function PlanetOrbitalViz({ planet }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    const o = ORBITAL[planet.id];
    if (!o) return;

    // Figure out which planets to show (inner or outer system)
    const isOuter = ['jupiter','saturn','uranus','neptune'].includes(planet.id);
    const planetsToShow = isOuter
      ? ['jupiter','saturn','uranus','neptune']
      : ['mercury','venus','earth','mars'];

    // Scale: map the largest orbit radius to fit canvas
    const maxR = Math.max(...planetsToShow.map(p => ORBITAL[p].radius));
    const padding = 28;
    const scale = (Math.min(W, H) / 2 - padding) / maxR;

    // Sun
    const sunSize = isOuter ? 5 : 8;
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, sunSize);
    gradient.addColorStop(0, '#fff9c4');
    gradient.addColorStop(0.4, '#f59e0b');
    gradient.addColorStop(1, '#f59e0b00');
    ctx.beginPath();
    ctx.arc(cx, cy, sunSize, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw all planet orbits + dots
    planetsToShow.forEach(pid => {
      const po = ORBITAL[pid];
      const orbitR = po.radius * scale;
      const angle = currentAngle(pid);
      const px = cx + orbitR * Math.cos(angle);
      const py = cy + orbitR * Math.sin(angle);
      const isSelected = pid === planet.id;

      // Orbit ring
      ctx.beginPath();
      ctx.arc(cx, cy, orbitR, 0, Math.PI * 2);
      ctx.strokeStyle = isSelected ? po.color + '55' : '#ffffff11';
      ctx.lineWidth = isSelected ? 1.5 : 0.8;
      ctx.setLineDash(isSelected ? [] : [2, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Planet dot
      const dotSize = isSelected ? (isOuter ? 7 : 6) : (isOuter ? 4 : 3);
      ctx.beginPath();
      ctx.arc(px, py, dotSize, 0, Math.PI * 2);
      ctx.fillStyle = po.color;
      ctx.shadowBlur = isSelected ? 14 : 4;
      ctx.shadowColor = po.color;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Saturn rings
      if (pid === 'saturn') {
        ctx.beginPath();
        ctx.ellipse(px, py, dotSize * 2.2, dotSize * 0.7, angle + 0.4, 0, Math.PI * 2);
        ctx.strokeStyle = '#e4d19188';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Label for selected planet
      if (isSelected) {
        ctx.fillStyle = po.color;
        ctx.font = `bold 9px monospace`;
        ctx.textAlign = 'center';
        ctx.fillText(planet.name.toUpperCase(), px, py - dotSize - 6);
      }
    });

  }, [planet]);

  return (
    <div className="my-4">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Current Orbital Position</p>
      <canvas ref={canvasRef} width={220} height={220} className="block mx-auto" />
      <p className="text-gray-600 text-xs text-center mt-1">
        {['jupiter','saturn','uranus','neptune'].includes(planet.id) ? 'Outer Solar System' : 'Inner Solar System'}
        {' · '}Real-time position
      </p>
    </div>
  );
}
