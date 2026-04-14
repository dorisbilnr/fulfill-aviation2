const router = require('express').Router();
const db = require('../db/client');
const auth = require('../middleware/auth');

const PUBLIC_KEYS = [
  // 公司基础信息
  'company_name', 'company_name_zh', 'company_tagline',
  'address', 'address_zh',
  'phone', 'fax', 'email',
  'business_hours', 'business_hours_zh',
  // 简介与统计
  'intro_text', 'intro_text_zh',
  'stat_years', 'stat_destinations', 'stat_partners',
  'stat_partners_label', 'stat_partners_label_zh',
  // 导航标签
  'nav_home', 'nav_home_zh',
  'nav_news', 'nav_news_zh',
  'nav_services', 'nav_services_zh',
  'nav_charter', 'nav_charter_zh',
  'nav_about', 'nav_about_zh',
  'nav_contact', 'nav_contact_zh',
  // Hero 区（含中文字段）
  'hero1_tag', 'hero1_tag_zh',
  'hero1_title', 'hero1_title_zh',
  'hero1_sub', 'hero1_sub_zh',
  'hero2_tag', 'hero2_tag_zh',
  'hero2_title', 'hero2_title_zh',
  'hero2_sub', 'hero2_sub_zh',
  // 包机页面
  'charter_intro', 'charter_intro_zh',
  'charter_type1_title', 'charter_type1_title_zh',
  'charter_type1_desc', 'charter_type1_desc_zh',
  'charter_type1_image',
  'charter_type2_title', 'charter_type2_title_zh',
  'charter_type2_desc', 'charter_type2_desc_zh',
  'charter_type2_image',
  'charter_type3_title', 'charter_type3_title_zh',
  'charter_type3_desc', 'charter_type3_desc_zh',
  'charter_type3_image',
  'charter_type4_title', 'charter_type4_title_zh',
  'charter_type4_desc', 'charter_type4_desc_zh',
  'charter_type4_image',
  // 关于我们
  'about_title', 'about_title_zh',
  'about_body', 'about_body_zh',
  // 微信二维码
  'wechat_qr',
];

// Public: get frontend-facing settings (no auth required)
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

// Admin: bulk upsert settings
router.put('/', auth, (req, res) => {
  const upsert = db.prepare(`INSERT INTO settings(key,value,updated_at) VALUES(?,?,datetime('now')) ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=excluded.updated_at`);
  const tx = db.transaction((obj) => {
    for (const [k, v] of Object.entries(obj)) {
      if (typeof k === 'string' && k.length < 100) upsert.run(k, String(v ?? ''));
    }
  });
  tx(req.body);
  res.json({ success: true });
});

module.exports = router;
