const router = require('express').Router();
const db = require('../db/client');
const bcrypt = require('bcryptjs');

router.get('/check', (req, res) => {
  try {
    const admins = db.prepare('SELECT id, email, name, created_at, password FROM admins').all();
    const env = {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '(not set)',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '(not set)',
      ADMIN_PASSWORD_LENGTH: process.env.ADMIN_PASSWORD ? process.env.ADMIN_PASSWORD.length : 0,
      JWT_SECRET: process.env.JWT_SECRET ? 'set (' + process.env.JWT_SECRET.length + ' chars)' : '(not set)',
      NODE_ENV: process.env.NODE_ENV || 'not set',
    };
    // Test if env password matches stored hash
    const passwordTest = admins.length > 0 && process.env.ADMIN_PASSWORD 
      ? bcrypt.compareSync(process.env.ADMIN_PASSWORD, admins[0].password)
      : 'no admin or no env password';
    res.json({ env, admins_in_db: admins.map(a => ({...a, password: a.password.substring(0,20)+'...'})), password_matches_env: passwordTest });
  } catch(e) {
    res.json({ error: e.message });
  }
});

router.post('/reseed', (req, res) => {
  try {
    delete require.cache[require.resolve('../db/seed')];
    require('../db/seed');
    const admins = db.prepare('SELECT id, email FROM admins').all();
    res.json({ success: true, admins });
  } catch(e) {
    res.json({ error: e.message, stack: e.stack });
  }
});

router.post('/reset-password', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const hash = bcrypt.hashSync(password, 12);
    db.prepare('DELETE FROM admins WHERE LOWER(email) = LOWER(?)').run(email);
    db.prepare('INSERT INTO admins(email,password,name) VALUES(?,?,?)').run(email, hash, 'Administrator');
    const saved = db.prepare('SELECT * FROM admins WHERE LOWER(email) = LOWER(?)').get(email);
    const verified = bcrypt.compareSync(password, saved.password);
    console.log('[debug] Password reset for', email, '| verified:', verified);
    res.json({ success: true, verified, email: saved.email, hash_preview: hash.substring(0,20)+'...' });
  } catch(e) {
    res.json({ error: e.message });
  }
});

module.exports = router;
