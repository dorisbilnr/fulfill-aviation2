const router = require('express').Router();
const db = require('../db/client');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/gallery');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g,'_')),
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg','image/png','image/webp','image/gif'].includes(file.mimetype);
    cb(ok ? null : new Error('Images only'), ok);
  },
});

// Ensure gallery table exists
db.exec(`CREATE TABLE IF NOT EXISTS gallery (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
)`);

// Public: get all gallery images
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM gallery ORDER BY sort_order ASC, created_at DESC').all();
  res.json(rows);
});

// Admin: upload image
router.post('/', auth, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = '/uploads/gallery/' + req.file.filename;
  const caption = req.body.caption || '';
  const sort_order = parseInt(req.body.sort_order) || 0;
  const result = db.prepare('INSERT INTO gallery(url,caption,sort_order) VALUES(?,?,?)').run(url, caption, sort_order);
  res.json({ success: true, id: result.lastInsertRowid, url, caption });
});

// Admin: update caption/order
router.put('/:id', auth, (req, res) => {
  const { caption, sort_order } = req.body;
  db.prepare('UPDATE gallery SET caption=?, sort_order=? WHERE id=?').run(caption||'', parseInt(sort_order)||0, req.params.id);
  res.json({ success: true });
});

// Admin: delete image
router.delete('/:id', auth, (req, res) => {
  const row = db.prepare('SELECT url FROM gallery WHERE id=?').get(req.params.id);
  if (row) {
    const fp = path.join(__dirname, '../..', row.url);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  db.prepare('DELETE FROM gallery WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
