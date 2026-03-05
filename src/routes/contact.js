const router = require('express').Router();
const db = require('../db/client');
const auth = require('../middleware/auth');
const { contactLimiter } = require('../middleware/rateLimit');
const { body, validationResult } = require('express-validator');
const { sendContactNotification, sendContactAutoReply } = require('../utils/mailer');

// Public: Submit contact form
router.post('/', contactLimiter, [
  body('first_name').trim().notEmpty().isLength({ max: 80 }).escape(),
  body('last_name').trim().notEmpty().isLength({ max: 80 }).escape(),
  body('email').isEmail().normalizeEmail(),
  body('company').optional().trim().isLength({ max: 120 }).escape(),
  body('service').optional().trim().isLength({ max: 80 }).escape(),
  body('message').trim().notEmpty().isLength({ min: 10, max: 2000 }).escape(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: 'Please fill in all required fields correctly.', details: errors.array() });
  }

  const { first_name, last_name, email, company, service, message } = req.body;
  const ip = req.ip || req.connection.remoteAddress;

  const result = db.prepare(
    `INSERT INTO contacts(first_name,last_name,email,company,service,message,ip) VALUES(?,?,?,?,?,?,?)`
  ).run(first_name, last_name, email, company || null, service || null, message, ip);

  // Send emails async — don't block response
  const contact = { first_name, last_name, email, company, service, message };
  sendContactNotification(contact).catch(e => console.error('[mailer] notification error:', e));
  sendContactAutoReply(contact).catch(e => console.error('[mailer] autoreply error:', e));

  res.json({ success: true, id: result.lastInsertRowid, message: 'Thank you! We will be in touch within 1-2 business days.' });
});

// Admin: Get all contacts
router.get('/', auth, (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  let query = 'SELECT * FROM contacts';
  const params = [];
  if (status) { query += ' WHERE status = ?'; params.push(status); }
  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(parseInt(limit), parseInt(offset));

  const rows = db.prepare(query).all(...params);
  const total = db.prepare('SELECT COUNT(*) as n FROM contacts' + (status ? ' WHERE status=?' : '')).get(...(status ? [status] : [])).n;
  res.json({ data: rows, total, page: parseInt(page), pages: Math.ceil(total / limit) });
});

// Admin: Update contact status
router.patch('/:id/status', auth, (req, res) => {
  const { status } = req.body;
  if (!['new','read','replied'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE contacts SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

// Admin: Delete contact
router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;