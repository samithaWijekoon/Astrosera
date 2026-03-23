const API_BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.error || data.message || `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export function getFeed(start, end) {
  const params = new URLSearchParams();
  if (start) params.set('start', start);
  if (end) params.set('end', end);
  const qs = params.toString();
  return request(`/asteroids/feed${qs ? `?${qs}` : ''}`);
}

export function checkAlert(asteroidId, email) {
  const params = new URLSearchParams();
  if (email) params.set('email', email);
  return request(`/alerts/check/${asteroidId}?${params.toString()}`);
}

export function setAlert(payload) {
  return request('/alerts', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function removeAlert(asteroidId, email) {
  return request(`/alerts/${asteroidId}`, {
    method: 'DELETE',
    body: JSON.stringify({ email }),
  });
}

export function getAlerts(email) {
  const params = new URLSearchParams();
  if (email) params.set('email', email);
  return request(`/alerts?${params.toString()}`);
}
