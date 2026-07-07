const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/client');

router.post('/login', (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '').trim();

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = db.prepare('SELECT * FROM admins WHERE LOWER(email) = ?').get(email);
    if (!admin) {
      console.log('[auth] No admin found for:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const match = bcrypt.compareSync(password, admin.password);
    console.log('[auth] Login attempt:', email, '| match:', match);
    if (!match) return res.status(401).json({ error: 'Invalid email or password' });

    const secret = String(process.env.JWT_SECRET || '');
    if (!secret) { return res.status(500).json({ error: 'Server misconfigured' }); }
    console.log('[auth] JWT secret length:', secret.length);
    
    const token = jwt.sign(
      { id: admin.id, email: admin.email, name: admin.name },
      secret,
      { expiresIn: '8h' }
    );

    db.prepare("UPDATE admins SET last_login = datetime('now') WHERE id = ?").run(admin.id);
    return res.json({ token, name: admin.name, email: admin.email });

  } catch(e) {
    console.error('[auth] CRASH:', e.message, e.stack);
    return res.status(500).json({ error: 'Login failed: ' + e.message });
  }
});

router.post('/change-password', require('../middleware/auth'), (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Min 6 characters' });
    const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.id);
    if (!bcrypt.compareSync(currentPassword, admin.password)) {
      return res.status(401).json({ error: 'Wrong current password' });
    }
    db.prepare('UPDATE admins SET password = ? WHERE id = ?').run(bcrypt.hashSync(newPassword, 10), req.admin.id);
    res.json({ success: true });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
