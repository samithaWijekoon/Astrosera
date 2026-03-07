import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../context/UserContext';
import { checkAlert, setAlert, removeAlert } from '../services/api';

export default function BellButton({ asteroid, onNeedEmail }) {
  const { email } = useUser();
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading]       = useState(true);

  const check = useCallback(async () => {
    if (!email || !asteroid?.id) { setLoading(false); return; }
    try {
      const r = await checkAlert(asteroid.id, email);
      setSubscribed(r.subscribed);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [email, asteroid?.id]);

  useEffect(() => { setLoading(true); check(); }, [check]);

  const toggle = async (e) => {
    e.stopPropagation();
    if (!email) { onNeedEmail?.(); toast.info('Set your email first to receive alerts.'); return; }
    setLoading(true);
    try {
      if (subscribed) {
        await removeAlert(asteroid.id, email);
        setSubscribed(false);
        toast.success(`Alert removed for ${asteroid.name}`);
      } else {
        await setAlert({
          asteroidId: asteroid.id,
          asteroidName: asteroid.name,
          approachDate: asteroid.approachDate,
          isHazardous: asteroid.isHazardous,
          userEmail: email,
        });
        setSubscribed(true);
        toast.success(`🔔 Alert set! We'll email you 1hr before ${asteroid.name} approaches Earth.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Something went wrong.');
    } finally { setLoading(false); }
  };

  return (
    <button
      className={`bell-btn${subscribed ? ' on' : ''}${loading ? ' loading' : ''}`}
      onClick={toggle}
      title={subscribed ? 'Remove alert' : 'Set approach alert'}
    >
      {loading ? '···' : subscribed ? '🔔' : '🔕'}
    </button>
  );
}
