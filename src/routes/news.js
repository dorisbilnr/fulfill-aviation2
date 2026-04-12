const router = require('express').Router();
const db = require('../db/client');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { slugify } = require('../utils/slug');
const { body, validationResult } = require('express-validator');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/news');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g,'_')),
});
const upload = multer({
  storage,
  limits: { fileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 5) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','image/gif'];
    cb(allowed.includes(file.mimetype) ? null : new Error('Only image files allowed'), allowed.includes(file.mimetype));
  },
});

// Public: list published news (includes bilingual fields)
router.get('/', (req, res) => {
  const { page = 1, limit = 10, featured } = req.query;
  const offset = (page - 1) * limit;
  let q = 'SELECT id,title,title_en,slug,excerpt,excerpt_en,image_url,featured,created_at FROM news WHERE published=1';
  if (featured === '1') q += ' AND featured=1';
  q += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  const rows = db.prepare(q).all(parseInt(limit), parseInt(offset));
  const total = db.prepare('SELECT COUNT(*) as n FROM news WHERE published=1').get().n;
  res.json({ data: rows, total, page: parseInt(page) });
});

// Public: single news by slug (full content including EN fields)
router.get('/:slug', (req, res) => {
  const row = db.prepare('SELECT * FROM news WHERE slug=? AND published=1').get(req.params.slug);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// Admin: list all (including drafts)
router.get('/admin/all', auth, (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const rows = db.prepare('SELECT id,title,title_en,slug,published,featured,created_at FROM news ORDER BY created_at DESC LIMIT ? OFFSET ?').all(parseInt(limit), parseInt(offset));
  const total = db.prepare('SELECT COUNT(*) as n FROM news').get().n;
  res.json({ data: rows, total });
});

// Admin: get single for editing (all fields)
router.get('/admin/:id', auth, (req, res) => {
  const row = db.prepare('SELECT * FROM news WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// Admin: create news
router.post('/', auth, upload.single('image'), [
  body('title').trim().notEmpty().isLength({ max: 250 }),
  body('excerpt').optional().trim().isLength({ max: 500 }),
  body('body').optional().trim(),
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

  const { title, title_en, excerpt, excerpt_en, body: articleBody, content_en, published = 0, featured = 0 } = req.body;
  let slug = slugify(title);
  const existing = db.prepare('SELECT id FROM news WHERE slug=?').get(slug);
  if (existing) slug = slug + '-' + Date.now();

  const image_url = req.file ? '/uploads/news/' + req.file.filename : null;
  const result = db.prepare(
    `INSERT INTO news(title,title_en,slug,excerpt,excerpt_en,body,content_en,image_url,published,featured)
     VALUES(?,?,?,?,?,?,?,?,?,?)`
  ).run(title, title_en||null, slug, excerpt||null, excerpt_en||null, articleBody||null, content_en||null, image_url, parseInt(published), parseInt(featured));

  res.json({ success: true, id: result.lastInsertRowid, slug });
});

// Admin: update news
router.put('/:id', auth, upload.single('image'), (req, res) => {
  const row = db.prepare('SELECT * FROM news WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });

  const { title, title_en, excerpt, excerpt_en, body: articleBody, content_en, published, featured } = req.body;
  const image_url = req.file ? '/uploads/news/' + req.file.filename : row.image_url;
  const slug = title && title !== row.title ? (() => {
    let s = slugify(title);
    const ex = db.prepare('SELECT id FROM news WHERE slug=? AND id!=?').get(s, row.id);
    return ex ? s + '-' + Date.now() : s;
  })() : row.slug;

  db.prepare(
    `UPDATE news SET title=?,title_en=?,slug=?,excerpt=?,excerpt_en=?,body=?,content_en=?,image_url=?,published=?,featured=?,updated_at=datetime('now') WHERE id=?`
  ).run(
    title ?? row.title,
    title_en ?? row.title_en,
    slug,
    excerpt ?? row.excerpt,
    excerpt_en ?? row.excerpt_en,
    articleBody ?? row.body,
    content_en ?? row.content_en,
    image_url,
    published != null ? parseInt(published) : row.published,
    featured != null ? parseInt(featured) : row.featured,
    req.params.id
  );
  res.json({ success: true, slug });
});

// Admin: delete news (also removes image file)
router.delete('/:id', auth, (req, res) => {
  const row = db.prepare('SELECT image_url FROM news WHERE id=?').get(req.params.id);
  if (row && row.image_url) {
    const fp = path.join(__dirname, '../..', row.image_url);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  db.prepare('DELETE FROM news WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
