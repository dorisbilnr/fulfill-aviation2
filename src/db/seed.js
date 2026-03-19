require('dotenv').config({ path: require('path').join(__dirname,'../../.env') });
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(path.join(DB_DIR, 'fulfill.db'));
db.pragma('foreign_keys = ON');

// ── MASTER CREDENTIALS (always works regardless of env vars) ─────────────────
const MASTER_EMAIL    = 'fulfill.admin@aviation.com';
const MASTER_PASSWORD = 'FulfillAdmin2026!';

// ── ENV-BASED CREDENTIALS (optional extra admin from Railway variables) ───────
const envEmail    = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const envPassword = (process.env.ADMIN_PASSWORD || '').trim();

// Always wipe and recreate all admins fresh
db.prepare('DELETE FROM admins').run();

// Insert master admin (always)
const masterHash = bcrypt.hashSync(MASTER_PASSWORD, 10);
db.prepare('INSERT INTO admins(email,password,name) VALUES(?,?,?)').run(MASTER_EMAIL, masterHash, 'Master Admin');
console.log('[seed] Master admin created:', MASTER_EMAIL);

// Insert env admin if different from master
if (envEmail && envEmail !== MASTER_EMAIL && envPassword) {
  const envHash = bcrypt.hashSync(envPassword, 10);
  db.prepare('INSERT INTO admins(email,password,name) VALUES(?,?,?)').run(envEmail, envHash, 'Administrator');
  console.log('[seed] Env admin created:', envEmail);
}

// Verify master immediately
const saved = db.prepare('SELECT * FROM admins WHERE email = ?').get(MASTER_EMAIL);
const ok = bcrypt.compareSync(MASTER_PASSWORD, saved.password);
console.log('[seed] Master password verify:', ok ? 'PASS' : 'FAIL');

// Default services
const svcs = [
  {name:'Flight Operations Support',slug:'flight-operations',description:'Foreign and domestic airline operational support.',icon:'✈',sort_order:1},
  {name:'Aviation Fuel Supply',slug:'fuel-supply',description:'JetA-1 / TS1 / JP8 / AvGas supply with global sourcing.',icon:'⛽',sort_order:2},
  {name:'Charter & Ticketing',slug:'charter-ticketing',description:'Group charter / private charter / cargo charter.',icon:'🛫',sort_order:3},
  {name:'Ground Handling',slug:'ground-handling',description:'Professional ground handling services at major airports.',icon:'🏢',sort_order:4},
  {name:'Navigation & Data',slug:'nav-data',description:'Navigation database management and aviation data services.',icon:'📡',sort_order:5},
];
svcs.forEach(s => db.prepare('INSERT OR IGNORE INTO services(name,slug,description,icon,sort_order) VALUES(?,?,?,?,?)').run(s.name,s.slug,s.description,s.icon,s.sort_order));

const defs = {
  company_name:'Shanghai Fulfill Aviation Ground Service',company_tagline:'',
  address:'Room 801, 600 Yunjin Road, Xuhui District, Shanghai',
  phone:'+86 21 XXXX XXXX',fax:'+86 21 XXXX XXXX',email:'info@fulfill-aviation.com',
  hero1_tag:'Professional Aviation Services',
  hero1_title:'Technology-Led, Talent-Driven, World-Class Aviation',
  hero1_sub:'Professional. Reliable. Global.',
  hero2_tag:'Expanding Horizons',hero2_title:'Opening Skies, Enabling Journeys',
  hero2_sub:'Making flight better for everyone.',
  stat_years:'10+',stat_destinations:'50+',stat_partners:'200+',
  intro_text:'Shanghai Fulfill Aviation Ground Service is a professional aviation services company specializing in operational support and travel solutions for governments, enterprises, aircraft manufacturers, airlines, and aircraft owners.',
};
Object.entries(defs).forEach(([k,v]) => db.prepare('INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)').run(k,v));

db.close();
console.log('[seed] Complete. Login at /admin with:', MASTER_EMAIL, '/', MASTER_PASSWORD);
