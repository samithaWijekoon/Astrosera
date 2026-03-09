import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAlerts, removeAlert } from '../../services/api';
import { useUser } from '../../context/UserContext';
import { toast } from 'react-toastify';

export default function AsteroidAlerts() {
  const { email } = useUser();
  const [alerts,  setAlerts]  = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) return;
    setLoading(true);
    getAlerts(email).then(setAlerts).catch(() => {}).finally(() => setLoading(false));
  }, [email]);

  async function remove(asteroidId, name) {
    try {
      await removeAlert(asteroidId, email);
      setAlerts(a => a.filter(x => x.asteroidId !== asteroidId));
      toast.info(`Removed alert for ${name}`);
    } catch { toast.error('Could not remove alert'); }
  }

  const statusColor = { WATCHING: 'text-purple-400 border-purple-700 bg-purple-900/20', NOTIFIED: 'text-yellow-400 border-yellow-700 bg-yellow-900/20', PASSED: 'text-gray-500 border-gray-700' };

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-6 md:px-12 font-outfit">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">My <span className="text-purple-400">Alerts</span></h1>
            {email && <p className="text-gray-500 text-sm font-mono">{email}</p>}
          </div>
          <Link to="/events" className="text-xs px-4 py-2 border border-purple-700 text-purple-400 rounded hover:bg-purple-900/30 transition-colors">
            ← Back to Tracker
          </Link>
        </div>

        {!email ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
            <span className="text-5xl">📡</span>
            <p className="text-xs uppercase tracking-widest">Set your email on the Events page to view alerts</p>
            <Link to="/events" className="text-xs px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
              Go to Tracker
            </Link>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
            <div className="w-10 h-10 border-2 border-gray-700 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-xs uppercase tracking-widest">Loading...</span>
          </div>
        ) : alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-500">
            <span className="text-5xl">🔕</span>
            <p className="text-xs uppercase tracking-widest">No alerts set yet</p>
            <Link to="/events" className="text-xs px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
              Browse Asteroids
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className="bg-gray-900/60 border border-purple-900/30 rounded-xl px-5 py-4 flex justify-between items-center">
                <div>
                  <p className="font-mono text-sm text-white">{alert.asteroidName}</p>
                  <p className="text-gray-500 text-xs mt-1">Approach: {alert.approachDate}</p>
                  <p className="text-gray-500 text-xs">Miss dist: {(alert.missDistKm / 1e6).toFixed(2)} M km</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded border ${statusColor[alert.status] || statusColor.PASSED}`}>
                    {alert.status}
                  </span>
                  <button
                    onClick={() => remove(alert.asteroidId, alert.asteroidName)}
                    className="text-xs px-3 py-1.5 border border-red-800 text-red-400 rounded hover:bg-red-900/20 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
