import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/AuthContext';
import { getAlerts, removeAlert } from '../../services/api';

export default function AsteroidAlerts() {
  const { email } = useUser();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) return;
    setLoading(true);
    setError('');
    getAlerts(email)
      .then(setAlerts)
      .catch(() => setError('Could not load alerts. Is the backend running on port 5000?'))
      .finally(() => setLoading(false));
  }, [email]);

  async function onRemove(asteroidId) {
    try {
      await removeAlert(asteroidId, email);
      setAlerts(prev => prev.filter(a => a.asteroidId !== asteroidId));
    } catch {
      setError('Failed to remove alert.');
    }
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">My Asteroid Alerts</h1>
        <p className="text-gray-400 text-sm mb-6">Alerts tied to your observer email.</p>

        {!email && (
          <div className="bg-yellow-900/20 border border-yellow-800/40 rounded-lg px-4 py-3 text-yellow-300 text-sm">
            Add an email in the events page to manage alerts.
          </div>
        )}

        {email && loading && (
          <div className="text-gray-500 text-sm">Loading alerts...</div>
        )}

        {email && error && (
          <div className="bg-red-900/20 border border-red-800/40 rounded-lg px-4 py-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        {email && !loading && !error && (
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="text-gray-500 text-sm">No alerts yet.</div>
            ) : (
              alerts.map(alert => (
                <div key={alert.id} className="bg-gray-900/60 border border-gray-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="text-white font-semibold">{alert.asteroidName || alert.asteroidId}</div>
                    <div className="text-gray-500 text-xs">
                      Approach: {alert.approachDate || 'Unknown'} · Miss Distance: {alert.missDistKm ? `${alert.missDistKm} km` : 'Unknown'}
                    </div>
                  </div>
                  <button
                    onClick={() => onRemove(alert.asteroidId)}
                    className="text-xs px-3 py-1.5 border border-red-700 text-red-400 rounded hover:bg-red-900/20 transition-colors"
                  >
                    Remove Alert
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
