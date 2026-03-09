import React, { useEffect, useRef } from 'react';

export default function OrbitalViz({ neo }) {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W / 2, cy = H / 2;

    ctx.clearRect(0, 0, W, H);

    // Earth orbit ring
    ctx.strokeStyle = 'rgba(147,51,234,0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 70, 0, Math.PI * 2); ctx.stroke();

    // Moon orbit ring
    ctx.strokeStyle = 'rgba(100,100,100,0.2)';
    ctx.beginPath(); ctx.arc(cx, cy, 90, 0, Math.PI * 2); ctx.stroke();

    // Earth
    ctx.fillStyle = '#1d4ed8';
    ctx.beginPath(); ctx.arc(cx, cy, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(147,51,234,0.2)';
    ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();

    // Asteroid
    const maxLD = 200;
    const ratio = Math.min(neo.missDistLunar, maxLD) / maxLD;
    const astR  = 30 + ratio * (W / 2 - 40);
    const angle = -Math.PI / 4;
    const ax = cx + astR * Math.cos(angle);
    const ay = cy + astR * Math.sin(angle);

    // Approach line
    ctx.setLineDash([3, 5]);
    ctx.strokeStyle = neo.isHazardous ? 'rgba(239,68,68,0.4)' : 'rgba(147,51,234,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ax, ay); ctx.stroke();
    ctx.setLineDash([]);

    // Asteroid dot
    const size = 4 + Math.min(neo.diamMaxKm * 8, 10);
    ctx.fillStyle = neo.isHazardous ? '#ef4444' : '#a855f7';
    ctx.shadowBlur = 12;
    ctx.shadowColor = neo.isHazardous ? '#ef4444' : '#a855f7';
    ctx.beginPath(); ctx.arc(ax, ay, size, 0, Math.PI * 2); ctx.fill();
    ctx.shadowBlur = 0;

    // Label
    ctx.fillStyle = '#6b7280';
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`${neo.missDistLunar.toFixed(1)} LD`, ax, ay - size - 6);
  }, [neo]);

  return (
    <div className="my-4">
      <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Orbital Approach</p>
      <canvas ref={canvasRef} width={220} height={220} className="block mx-auto" />
    </div>
  );
}
