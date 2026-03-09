import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { setAlert, removeAlert, checkAlert } from '../../services/api';
import { useUser } from '../../context/UserContext';

export default function BellButton({ asteroid }) {
  const { email } = useUser();
  const [subscribed, setSubscribed] = useState(false);
  const [loading,    setLoading]    = useState(false);

  useEffect(() => {
    if (!email) return;
    checkAlert(asteroid.id, email).then(r => setSubscribed(r.subscribed)).catch(() => {});
  }, [email, asteroid.id]);

  async function toggle() {
    if (!email) { toast.warn('Set your email first using the email button above'); return; }
    setLoading(true);
    try {
      if (subscribed) {
        await removeAlert(asteroid.id, email);
        setSubscribed(false);
        toast.info(`Alert removed for ${asteroid.name}`);
      } else {
        await setAlert({ email, asteroidId: asteroid.id, asteroidName: asteroid.name, approachDate: asteroid.approachFull || asteroid.approachDate, missDistKm: asteroid.missDistKm });
        setSubscribed(true);
        toast.success(`Alert set for ${asteroid.name}`);
      }
    } catch { toast.error('Something went wrong'); }
    finally { setLoading(false); }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-2 py-1 rounded border text-sm transition-all duration-200 ${
        subscribed
          ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10'
          : 'border-gray-700 text-gray-400 hover:border-yellow-500 hover:text-yellow-400'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
      title={subscribed ? 'Remove alert' : 'Set alert'}
    >
      {loading ? '…' : subscribed ? '🔔' : '🔕'}
    </button>
  );
}
