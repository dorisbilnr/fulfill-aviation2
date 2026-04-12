const router = require('express').Router();
const db = require('../db/client');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/partners');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g,'_')),
});
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg','image/png','image/webp'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPG, PNG, WebP allowed'), ok);
  },
});

// Public: list active partners ordered by sort_order
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT id,name,logo_url,website_url,sort_order FROM partners WHERE active=1 ORDER BY sort_order ASC, id ASC').all();
  res.json(rows);
});

// Admin: list all partners
router.get('/admin/all', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM partners ORDER BY sort_order ASC, id ASC').all();
  res.json(rows);
});

// Admin: create partner
router.post('/', auth, upload.single('logo'), (req, res) => {
  const { name, website_url, sort_order = 0, active = 1 } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const logo_url = req.file ? '/uploads/partners/' + req.file.filename : null;
  const result = db.prepare(
    `INSERT INTO partners(name,logo_url,website_url,sort_order,active) VALUES(?,?,?,?,?)`
  ).run(name, logo_url, website_url||null, parseInt(sort_order), parseInt(active));
  res.json({ success: true, id: result.lastInsertRowid });
});

// Admin: update partner
router.put('/:id', auth, upload.single('logo'), (req, res) => {
  const row = db.prepare('SELECT * FROM partners WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const { name, website_url, sort_order, active } = req.body;
  const logo_url = req.file ? '/uploads/partners/' + req.file.filename : row.logo_url;
  db.prepare(
    `UPDATE partners SET name=?,logo_url=?,website_url=?,sort_order=?,active=? WHERE id=?`
  ).run(
    name ?? row.name,
    logo_url,
    website_url ?? row.website_url,
    sort_order != null ? parseInt(sort_order) : row.sort_order,
    active != null ? parseInt(active) : row.active,
    req.params.id
  );
  res.json({ success: true });
});

// Admin: delete partner (also removes logo file)
router.delete('/:id', auth, (req, res) => {
  const row = db.prepare('SELECT logo_url FROM partners WHERE id=?').get(req.params.id);
  if (row && row.logo_url) {
    const fp = path.join(__dirname, '../..', row.logo_url);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  db.prepare('DELETE FROM partners WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
