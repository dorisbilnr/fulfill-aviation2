const router = require('express').Router();
const db = require('../db/client');
const auth = require('../middleware/auth');

// Public: get non-sensitive settings (used by frontend to render dynamic content)
const PUBLIC_KEYS = ['company_name','company_tagline','address','phone','fax','email','hero1_tag','hero1_title','hero1_sub','hero2_tag','hero2_title','hero2_sub','stat_years','stat_destinations','stat_partners','intro_text','nav_home','nav_news','nav_services','nav_charter','nav_about','nav_contact'];

router.get('/public', (req, res) => {
  const rows = db.prepare(`SELECT key,value FROM settings WHERE key IN (${PUBLIC_KEYS.map(()=>'?').join(',')})`)
    .all(...PUBLIC_KEYS);
  const obj = {};
  rows.forEach(r => obj[r.key] = r.value);
  res.json(obj);
});

// Admin: get all settings
router.get('/', auth, (req, res) => {
  const rows = db.prepare('SELECT key,value,updated_at FROM settings ORDER BY key').all();
  const obj = {};
  rows.forEach(r => obj[r.key] = r.value);
  res.json(obj);
});

// Admin: update settings (bulk)
router.put('/', auth, (req, res) => {
  const upsert = db.prepare(`INSERT INTO settings(key,value,updated_at) VALUES(?,?,datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at`);
  const tx = db.transaction((obj) => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof k === 'string' && k.length < 100) upsert.run(k, String(v));
    }
  });
  tx(req.body);
  res.json({ success: true });
});

module.exports = router;