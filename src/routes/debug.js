const router = require('express').Router();
const db = require('../db/client');

// Temporary debug route — shows if admin exists (no passwords exposed)
router.get('/check', (req, res) => {
  try {
    const admins = db.prepare('SELECT id, email, name, created_at FROM admins').all();
    const env = {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ? '✅ set' : '❌ missing',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? '✅ set' : '❌ missing',
      JWT_SECRET: process.env.JWT_SECRET ? '✅ set' : '❌ missing',
      NODE_ENV: process.env.NODE_ENV || 'not set',
    };
    res.json({ env, admins_in_db: admins });
  } catch(e) {
    res.json({ error: e.message });
  }
});

// Force re-seed admin right now
router.post('/reseed', (req, res) => {
  try {
    require('../db/seed');
    const admins = db.prepare('SELECT id, email, name FROM admins').all();
    res.json({ success: true, admins });
  } catch(e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
