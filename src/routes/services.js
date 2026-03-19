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
  cb(['image/jpeg','image/png','image/webp'].includes(file.mimetype)?null:new Error('Images only'),['image/jpeg','image/png','image/webp'].includes(file.mimetype));
}});

// Public
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM services WHERE active=1 ORDER BY sort_order ASC').all();
  res.json(rows);
});

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

// Admin
router.post('/', auth, upload.single('image'), (req, res) => {
  const { name, description, details, icon, sort_order = 0 } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const slug = slugify(name);
  const image_url = req.file ? '/uploads/services/' + req.file.filename : null;
  const result = db.prepare(`INSERT INTO services(name,slug,description,details,icon,image_url,sort_order) VALUES(?,?,?,?,?,?,?)`).run(name,slug,description||null,details||null,icon||null,image_url,parseInt(sort_order));
  res.json({ success: true, id: result.lastInsertRowid });
});

router.put('/:id', auth, upload.single('image'), (req, res) => {
  const row = db.prepare('SELECT * FROM services WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const { name, description, details, icon, sort_order, active } = req.body;
  const image_url = req.file ? '/uploads/services/' + req.file.filename : row.image_url;
  db.prepare(`UPDATE services SET name=?,description=?,details=?,icon=?,image_url=?,sort_order=?,active=? WHERE id=?`)
    .run(name??row.name, description??row.description, details??row.details, icon??row.icon, image_url, sort_order??row.sort_order, active!=null?parseInt(active):row.active, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', auth, (req, res) => {
  db.prepare('DELETE FROM services WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;