import axios from 'axios';

// Vite proxy in vite.config.js routes /api → http://localhost:5000
const API = axios.create({ baseURL: '/api', timeout: 20000 });

export const getFeed     = (start, end) => API.get('/asteroids/feed', { params: { start, end } }).then(r => r.data);
export const getUpcoming = (days = 7)   => API.get('/asteroids/upcoming', { params: { days } }).then(r => r.data);
export const getAsteroid = (id)         => API.get(`/asteroids/${id}`).then(r => r.data);

export const setAlert    = (data)              => API.post('/alerts', data).then(r => r.data);
export const removeAlert = (asteroidId, email) => API.delete(`/alerts/${asteroidId}`, { data: { email } }).then(r => r.data);
export const checkAlert  = (asteroidId, email) => API.get(`/alerts/check/${asteroidId}`, { params: { email } }).then(r => r.data);
export const getAlerts   = (email)             => API.get('/alerts', { params: { email } }).then(r => r.data);
