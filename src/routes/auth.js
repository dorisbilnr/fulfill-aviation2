const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/client');
const { loginLimiter } = require('../middleware/rateLimit');
const { body, validationResult } = require('express-validator');

router.post('/login', loginLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Invalid credentials' });

  const { email, password } = req.body;
  const admin = db.prepare('SELECT * FROM admins WHERE email = ?').get(email);
  if (!admin || !bcrypt.compareSync(password, admin.password)) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  db.prepare('UPDATE admins SET last_login = datetime("now") WHERE id = ?').run(admin.id);
  const token = jwt.sign({ id: admin.id, email: admin.email, name: admin.name }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, name: admin.name, email: admin.email });
});

router.post('/change-password', require('../middleware/auth'), [
  body('currentPassword').notEmpty(),
  body('newPassword').isLength({ min: 8 }),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: 'Password must be at least 8 characters' });

  const admin = db.prepare('SELECT * FROM admins WHERE id = ?').get(req.admin.id);
  if (!bcrypt.compareSync(req.body.currentPassword, admin.password)) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }
  const hash = bcrypt.hashSync(req.body.newPassword, 12);
  db.prepare('UPDATE admins SET password = ? WHERE id = ?').run(hash, req.admin.id);
  res.json({ success: true });
});

module.exports = router;