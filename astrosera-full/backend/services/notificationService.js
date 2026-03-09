const cron       = require('node-cron');
const nodemailer = require('nodemailer');
const db         = require('./db');

function getTransport() {
  if (!process.env.SMTP_USER || process.env.SMTP_USER === 'your_email@gmail.com') return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
}

async function checkAlerts() {
  const transport = getTransport();
  if (!transport) return;
  const alerts = db.getAll().filter(a => a.status === 'WATCHING');
  const now    = Date.now();
  for (const alert of alerts) {
    const approachMs = new Date(alert.approachDate).getTime();
    const diff = approachMs - now;
    if (diff > 0 && diff <= 60 * 60 * 1000) {
      try {
        await transport.sendMail({
          from:    process.env.SMTP_FROM,
          to:      alert.email,
          subject: `🚨 AstroSera Alert: ${alert.asteroidName} approaches in 1 hour`,
          html:    `<h2>Asteroid Alert</h2><p><b>${alert.asteroidName}</b> will make its closest approach to Earth in approximately 1 hour.</p><p>Miss distance: ${alert.missDistKm} km</p>`,
        });
        db.updateStatus(alert.id, 'NOTIFIED');
      } catch (e) { console.error('Email error:', e.message); }
    } else if (diff < 0) {
      db.updateStatus(alert.id, 'PASSED');
    }
  }
}

function startCron() {
  cron.schedule('*/30 * * * *', checkAlerts);
}

module.exports = { startCron };
