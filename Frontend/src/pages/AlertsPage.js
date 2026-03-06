import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { getAlerts, removeAlert } from '../services/api';

export default function AlertsPage() {
  const { email, setEmail } = useUser();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState('');

  useEffect(() => { if (email) load(); }, [email]);

  async function load() {
    setLoading(true);
    try {
      const r = await getAlerts(email);
      setAlerts(r.alerts || []);
    } catch { setAlerts([]); }
    finally { setLoading(false); }
  }

  async function handleRemove(alert) {
    try {
      await removeAlert(alert.asteroidId, email);
      setAlerts(a => a.filter(x => x._id !== alert._id));
      toast.success(`Alert removed for ${alert.asteroidName}`);
    } catch { toast.error('Failed to remove alert.'); }
  }

  if (!email) return (
    <div className="alerts-page">
      <div className="section-label">// ALERT MANAGEMENT</div>
      <div className="page-heading">MY <span>ALERTS</span></div>
      <p style={{ fontFamily:'var(--font-mono)', fontSize:13, color:'var(--text2)', margin:'16px 0 24px' }}>
        Enter your email to manage asteroid approach alerts.
      </p>
      <div style={{ display:'flex', gap:10, maxWidth:400 }}>
        <input
          className="modal-input" type="email" placeholder="mission@control.nasa"
          value={draft} onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && draft.includes('@') && setEmail(draft.trim())}
          style={{ marginBottom:0, flex:1 }}
        />
        <button className="hud-btn" onClick={() => draft.includes('@') && setEmail(draft.trim())}>SET</button>
      </div>
    </div>
  );

  return (
    <div className="alerts-page">
      <div className="section-label">// ALERT MANAGEMENT</div>
      <div className="page-heading">MY <span>ALERTS</span></div>
      <div style={{ fontFamily:'var(--font-mono)', fontSize:12, color:'var(--text2)', margin:'8px 0 24px', display:'flex', alignItems:'center', gap:12 }}>
        <span>OPERATOR: {email}</span>
        <button className="hud-btn" style={{ padding:'4px 12px', fontSize:11 }} onClick={load}>↻</button>
      </div>

      {loading ? (
        <div className="state-box"><div className="spinner"/><span>LOADING...</span></div>
      ) : alerts.length === 0 ? (
        <div className="state-box" style={{ paddingTop:60 }}>
          <div style={{ fontSize:48, opacity:0.3 }}>🔕</div>
          <div>NO ACTIVE ALERTS</div>
          <div style={{ fontSize:11, color:'var(--text3)' }}>Go to the feed and click 🔕 on any asteroid</div>
        </div>
      ) : (
        <>
          <div style={{ fontFamily:'var(--font-mono)', fontSize:11, color:'var(--text2)', marginBottom:16 }}>
            You'll receive an email 1 hour before each asteroid's closest approach.
          </div>
          {alerts.map(alert => {
            const isPast = new Date(alert.approachDate) < new Date();
            return (
              <div key={alert._id} className="alert-card" style={alert.isHazardous ? { borderColor:'rgba(255,68,68,0.3)' } : {}}>
                <div style={{ fontSize:28 }}>{alert.isHazardous ? '⚠️' : '☄'}</div>
                <div className="alert-card-info">
                  <div className="alert-name">{alert.asteroidName}</div>
                  <div className="alert-meta">
                    ID: {alert.asteroidId} · APPROACH: {alert.approachDate}
                    {isPast && <span style={{ color:'var(--green)', marginLeft:10 }}>✓ PASSED</span>}
                    {alert.notified && <span style={{ color:'var(--cyan)', marginLeft:10 }}>✓ NOTIFIED</span>}
                    {!alert.notified && !isPast && (
                      <span style={{ color:'var(--gold)', marginLeft:10, animation:'blink 1.5s step-end infinite' }}>● WATCHING</span>
                    )}
                  </div>
                </div>
                {alert.isHazardous && (
                  <span className="threat-badge" style={{ color:'var(--red)', borderColor:'rgba(255,68,68,0.4)', background:'var(--red-dim)', flexShrink:0 }}>
                    PHO
                  </span>
                )}
                <button className="hud-btn danger" style={{ flexShrink:0 }} onClick={() => handleRemove(alert)}>
                  REMOVE
                </button>
              </div>
            );
          })}
        </>
      )}

      <style>{`@keyframes blink { 50% { opacity: 0.3; } }`}</style>
    </div>
  );
}
