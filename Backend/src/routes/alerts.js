const express = require('express');
const router  = express.Router();
const { v4: uuidv4 } = require('uuid');
const db      = require('../services/db');
const nodemailer = require('nodemailer');

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS || process.env.SMTP_PASSWORD
    }
});

router.get('/', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email required' });
  res.json(db.getByEmail(email));
});

router.get('/check/:asteroidId', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'email required' });
  const alert = db.findOne({ asteroidId: req.params.asteroidId, email });
  res.json({ subscribed: !!alert, alert: alert || null });
});

router.post('/', (req, res) => {
  const { email, asteroidId, asteroidName, approachDate, missDistKm } = req.body;
  if (!email || !asteroidId) return res.status(400).json({ error: 'email and asteroidId required' });
  const existing = db.findOne({ asteroidId, email });
  if (existing) return res.json(existing);
  const doc = { id: uuidv4(), email, asteroidId, asteroidName, approachDate, missDistKm, status: 'WATCHING', createdAt: new Date().toISOString() };
  db.insert(doc);
  res.status(201).json(doc);
});

router.delete('/:asteroidId', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'email required' });
  db.remove({ asteroidId: req.params.asteroidId, email });
  res.json({ success: true });
});

// New endpoint for sending event reminders via email
router.post('/event-reminder', async (req, res) => {
    const { email, eventName, reminderType, scheduledTime } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const mailOptions = {
            from: process.env.SMTP_FROM || '"AstroSera Team" <astrosera.connect@gmail.com>',
            to: email,
            subject: `Reminder Configured: ${eventName || 'Astronomy Event'}`,
            html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #4f46e5; text-align: center;">Astronomy Event Reminder Setup</h2>
                <p>Hello Explorer,</p>
                <p>You have successfully configured a <strong>${reminderType || 'Smart'}</strong> reminder for <strong>${eventName || 'upcoming astronomical events'}</strong>.</p>
                ${scheduledTime ? `<p><strong>Time:</strong> ${scheduledTime}</p>` : ''}
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                    <p style="margin: 0; font-size: 16px;">We'll automatically ping you before the event starts so you don't miss the show in the sky! 🚀</p>
                </div>
                <p>Keep your eyes on the stars,</p>
                <p><strong>The Astrosera Team</strong></p>
            </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Event reminder email sent: %s', info.messageId);
        
        res.status(200).json({ success: true, message: 'Reminder configured and email dispatched' });
    } catch (error) {
        console.error('Error sending reminder email:', error);
        res.status(500).json({ error: 'Failed to configure reminder and send email' });
    }
});

module.exports = router;
