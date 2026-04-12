const router = require('express').Router();
const db = require('../db/client');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { slugify } = require('../utils/slug');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/services');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g,'_')),
});
const upload = multer({ storage, limits: { fileSize: 5*1024*1024 }, fileFilter: (req,file,cb) => {
  const ok = ['image/jpeg','image/png','image/webp'].includes(file.mimetype);
  cb(ok ? null : new Error('Images only'), ok);
}});

// Public: list active services (includes bilingual fields)
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM services WHERE active=1 ORDER BY sort_order ASC').all();
  res.json(rows);
});

// Public: single service by slug
router.get('/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM services WHERE slug=? AND active=1').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// Admin: get single by ID (for edit modal)
router.get('/id/:id', auth, (req, res) => {
  const row = db.prepare('SELECT * FROM services WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// Admin: create service
router.post('/', auth, upload.single('image'), (req, res) => {
  const { name, name_zh, description, description_zh, details, details_zh, icon, sort_order = 0 } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const slug = slugify(name);
  const image_url = req.file ? '/uploads/services/' + req.file.filename : null;
  const result = db.prepare(
    `INSERT INTO services(name,name_zh,slug,description,description_zh,details,details_zh,icon,image_url,sort_order)
     VALUES(?,?,?,?,?,?,?,?,?,?)`
  ).run(name, name_zh||null, slug, description||null, description_zh||null, details||null, details_zh||null, icon||null, image_url, parseInt(sort_order));
  res.json({ success: true, id: result.lastInsertRowid });
});

// Admin: update service
router.put('/:id', auth, upload.single('image'), (req, res) => {
  const row = db.prepare('SELECT * FROM services WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const { name, name_zh, description, description_zh, details, details_zh, icon, sort_order, active } = req.body;
  const image_url = req.file ? '/uploads/services/' + req.file.filename : row.image_url;
  db.prepare(
    `UPDATE services SET name=?,name_zh=?,description=?,description_zh=?,details=?,details_zh=?,icon=?,image_url=?,sort_order=?,active=? WHERE id=?`
  ).run(
    name ?? row.name,
    name_zh ?? row.name_zh,
    description ?? row.description,
    description_zh ?? row.description_zh,
    details ?? row.details,
    details_zh ?? row.details_zh,
    icon ?? row.icon,
    image_url,
    sort_order ?? row.sort_order,
    active != null ? parseInt(active) : row.active,
    req.params.id
  );
  res.json({ success: true });
});

// Admin: delete service
router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM services WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
