const router = require('express').Router();
const db = require('../db/client');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = path.join(__dirname, '../../uploads/team');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: UPLOAD_DIR,
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-_]/g,'_')),
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg','image/png','image/webp'].includes(file.mimetype);
    cb(ok ? null : new Error('Images only'), ok);
  },
});

// Public: get all active team members
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM team_members WHERE active=1 ORDER BY sort_order ASC').all();
  res.json(rows);
});

// Admin: get all
router.get('/all', auth, (req, res) => {
  const rows = db.prepare('SELECT * FROM team_members ORDER BY sort_order ASC').all();
  res.json(rows);
});

// Admin: create
router.post('/', auth, upload.single('photo'), (req, res) => {
  const { name, name_zh, role, role_zh, sort_order = 0 } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const photo_url = req.file ? '/uploads/team/' + req.file.filename : null;
  const result = db.prepare('INSERT INTO team_members(name,name_zh,role,role_zh,photo_url,sort_order) VALUES(?,?,?,?,?,?)').run(name, name_zh||'', role||'', role_zh||'', photo_url, parseInt(sort_order));
  res.json({ success: true, id: result.lastInsertRowid });
});

// Admin: update
router.put('/:id', auth, upload.single('photo'), (req, res) => {
  const row = db.prepare('SELECT * FROM team_members WHERE id=?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  const { name, name_zh, role, role_zh, sort_order, active } = req.body;
  const photo_url = req.file ? '/uploads/team/' + req.file.filename : row.photo_url;
  db.prepare('UPDATE team_members SET name=?,name_zh=?,role=?,role_zh=?,photo_url=?,sort_order=?,active=? WHERE id=?')
    .run(name??row.name, name_zh??row.name_zh, role??row.role, role_zh??row.role_zh, photo_url, sort_order??row.sort_order, active!=null?parseInt(active):row.active, req.params.id);
  res.json({ success: true });
});

// Admin: delete
router.delete('/:id', auth, (req, res) => {
  const row = db.prepare('SELECT photo_url FROM team_members WHERE id=?').get(req.params.id);
  if (row && row.photo_url) {
    const fp = path.join(__dirname, '../..', row.photo_url);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  db.prepare('DELETE FROM team_members WHERE id=?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
