import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './member3.css';

const API = 'http://localhost:5000/api';
const QUIZ_TIME_LIMIT_MS = 120_000;
/* ── Fisher-Yates ─────────────────────────────────────────────────────── */
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const formatTime = (ms) => {
    const s = Math.floor(Math.max(0, ms) / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/* ── Stars ────────────────────────────────────────────────────────────── */
const Stars = () => {
    const stars = useMemo(() =>
        Array.from({ length: 90 }, (_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2.2 + 0.4,
            dur: `${(Math.random() * 4 + 2).toFixed(1)}s`,
            delay: `${(Math.random() * 6).toFixed(1)}s`,
            op: (Math.random() * 0.5 + 0.15).toFixed(2),
        })), []);
    return (
        <>
            {stars.map(s => (
                <span key={s.id} className="star-dot" style={{
                    top: s.top, left: s.left,
                    width: s.size, height: s.size,
                    '--base-op': s.op, opacity: s.op,
                    '--dur': s.dur, '--delay': s.delay,
                }} />
            ))}
        </>
    );
};

/* ── Background scene ─────────────────────────────────────────────────── */
const SpaceScene = () => (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#060614]">
        <Stars />
        {/* Nebula blobs */}
        <div className="nebula-blob" style={{ width: 500, height: 500, top: '-120px', left: '-180px', background: 'rgba(99,60,245,0.18)', '--nb-dur': '12s', '--nb-delay': '0s' }} />
        <div className="nebula-blob" style={{ width: 420, height: 420, bottom: '-80px', right: '-100px', background: 'rgba(6,182,212,0.13)', '--nb-dur': '15s', '--nb-delay': '3s' }} />
        <div className="nebula-blob" style={{ width: 300, height: 300, top: '38%', left: '38%', background: 'rgba(236,72,153,0.09)', '--nb-dur': '10s', '--nb-delay': '6s' }} />

        {/* Gas giant — top right */}
        <div className="absolute rounded-full" style={{
            width: 230, height: 230, top: '-55px', right: '-55px',
            background: 'radial-gradient(circle at 38% 38%, rgba(124,58,237,0.4), rgba(30,10,74,0.5) 55%, rgba(0,0,0,0.7))',
            boxShadow: '0 0 70px rgba(124,58,237,0.18), inset -18px -14px 36px rgba(0,0,0,0.6)',
        }}>
            {/* Ring */}
            <div style={{
                position: 'absolute', top: '42%', left: '-28%',
                width: '156%', height: '16%',
                borderRadius: '50%',
                border: '2px solid rgba(167,139,250,0.22)',
                transform: 'rotateX(74deg)',
            }} />
        </div>

        {/* Tiny moon */}
        <div className="absolute rounded-full" style={{
            width: 13, height: 13, top: '58px', right: '136px',
            background: 'radial-gradient(circle at 35% 35%, #c4b5fd, #4c1d95)',
            boxShadow: '0 0 10px rgba(196,181,253,0.5)',
            animation: 'float 9s ease-in-out infinite',
        }} />

        {/* Small teal planet bottom-left */}
        <div className="absolute rounded-full hidden sm:block" style={{
            width: 100, height: 100, bottom: '70px', left: '-25px',
            background: 'radial-gradient(circle at 32% 32%, rgba(8,145,178,0.45), rgba(12,74,110,0.5) 55%, rgba(0,0,0,0.7))',
            boxShadow: '0 0 40px rgba(8,145,178,0.15)',
            animation: 'float 14s ease-in-out infinite',
        }} />

        {/* Deep radial vignette */}
        <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #060614 90%)' }} />
    </div>
);/* Fisher-Yates */
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const formatTime = (ms) => {
    const s = Math.floor(Math.max(0, ms) / 1000);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
};

/* Stars */
const Stars = () => {
    const stars = useMemo(() =>
        Array.from({ length: 90 }, (_, i) => ({
            id: i,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            size: Math.random() * 2.2 + 0.4,
            dur: `${(Math.random() * 4 + 2).toFixed(1)}s`,
            delay: `${(Math.random() * 6).toFixed(1)}s`,
            op: (Math.random() * 0.5 + 0.15).toFixed(2),
        })), []);
    return (
        <>
            {stars.map(s => (
                <span key={s.id} className="star-dot" style={{
                    top: s.top, left: s.left,
                    width: s.size, height: s.size,
                    '--base-op': s.op, opacity: s.op,
                    '--dur': s.dur, '--delay': s.delay,
                }} />
            ))}
        </>
    );
};

/* Background scene */
const SpaceScene = () => (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#060614]">
        <Stars />
        {/* Nebula blobs */}
        <div className="nebula-blob" style={{ width: 500, height: 500, top: '-120px', left: '-180px', background: 'rgba(99,60,245,0.18)', '--nb-dur': '12s', '--nb-delay': '0s' }} />
        <div className="nebula-blob" style={{ width: 420, height: 420, bottom: '-80px', right: '-100px', background: 'rgba(6,182,212,0.13)', '--nb-dur': '15s', '--nb-delay': '3s' }} />
        <div className="nebula-blob" style={{ width: 300, height: 300, top: '38%', left: '38%', background: 'rgba(236,72,153,0.09)', '--nb-dur': '10s', '--nb-delay': '6s' }} />

        {/* Gas giant — top right */}
        <div className="absolute rounded-full" style={{
            width: 230, height: 230, top: '-55px', right: '-55px',
            background: 'radial-gradient(circle at 38% 38%, rgba(124,58,237,0.4), rgba(30,10,74,0.5) 55%, rgba(0,0,0,0.7))',
            boxShadow: '0 0 70px rgba(124,58,237,0.18), inset -18px -14px 36px rgba(0,0,0,0.6)',
        }}>
            {/* Ring */}
            <div style={{
                position: 'absolute', top: '42%', left: '-28%',
                width: '156%', height: '16%',
                borderRadius: '50%',
                border: '2px solid rgba(167,139,250,0.22)',
                transform: 'rotateX(74deg)',
            }} />
        </div>

        {/* Tiny moon */}
        <div className="absolute rounded-full" style={{
            width: 13, height: 13, top: '58px', right: '136px',
            background: 'radial-gradient(circle at 35% 35%, #c4b5fd, #4c1d95)',
            boxShadow: '0 0 10px rgba(196,181,253,0.5)',
            animation: 'float 9s ease-in-out infinite',
        }} />

        {/* Small teal planet bottom-left */}
        <div className="absolute rounded-full hidden sm:block" style={{
            width: 100, height: 100, bottom: '70px', left: '-25px',
            background: 'radial-gradient(circle at 32% 32%, rgba(8,145,178,0.45), rgba(12,74,110,0.5) 55%, rgba(0,0,0,0.7))',
            boxShadow: '0 0 40px rgba(8,145,178,0.15)',
            animation: 'float 14s ease-in-out infinite',
        }} />

        {/* Deep radial vignette */}
        <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #060614 90%)' }} />
    </div>
);