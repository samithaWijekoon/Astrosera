import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Header() {
  const { email, setEmail } = useUser();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft]     = useState('');
  const loc = useLocation();

  return (
    <header className="header">
      <Link to="/" className="header-brand">
        <div className="header-icon">☄</div>
        <div>
          <div className="header-title">ASTEROID<span>WATCH</span></div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--text2)', letterSpacing: 2 }}>
            NASA NEOWS · REAL-TIME TRACKING
          </div>
        </div>
      </Link>

      <nav className="header-nav">
        <Link to="/" className={`nav-link${loc.pathname === '/' ? ' active' : ''}`}>FEED</Link>
        <Link to="/alerts" className={`nav-link${loc.pathname === '/alerts' ? ' active' : ''}`}>
          MY ALERTS
        </Link>

        {editing ? (
          <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
            <input
              autoFocus
              type="email"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && draft.includes('@')) { setEmail(draft.trim()); setEditing(false); }
                if (e.key === 'Escape') setEditing(false);
              }}
              placeholder="mission@control.nasa"
              className="modal-input"
              style={{ marginBottom: 0, width: 200 }}
            />
            <button className="hud-btn" style={{ padding: '6px 12px' }}
              onClick={() => { if (draft.includes('@')) { setEmail(draft.trim()); setEditing(false); } }}>
              SET
            </button>
          </div>
        ) : (
          <div className="email-chip" onClick={() => { setDraft(email); setEditing(true); }} title="Set email for alerts">
            <div className="dot" />
            {email || 'SET EMAIL'}
          </div>
        )}
      </nav>
    </header>
  );
}
