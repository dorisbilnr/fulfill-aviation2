require('dotenv').config({ path: require('path').join(__dirname,'../../.env') });
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const db = new Database(path.join(__dirname, '../../data/fulfill.db'));
db.pragma('foreign_keys = ON');

// Admin account
const email = process.env.ADMIN_EMAIL || 'admin@fulfill-aviation.com';
const raw   = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
const hash  = bcrypt.hashSync(raw, 12);
db.prepare(`INSERT OR REPLACE INTO admins(email,password,name) VALUES(?,?,?)`).run(email,hash,'Administrator');
console.log('Admin created:', email);

// Default services
const svcs = [
  { name:'Flight Operations Support', slug:'flight-operations', description:'Foreign and domestic airline operational support — permits, handling, and coordination.', icon:'✈', sort_order:1 },
  { name:'Aviation Fuel Supply',       slug:'fuel-supply',        description:'JetA-1 / TS1 / JP8 / AvGas supply with global sourcing and competitive pricing.',       icon:'⛽', sort_order:2 },
  { name:'Charter & Ticketing',        slug:'charter-ticketing',  description:'Group charter / private charter / cargo charter / airline ticketing solutions.',        icon:'🛫', sort_order:3 },
  { name:'Ground Handling',            slug:'ground-handling',    description:'Professional ground handling services at major airports.',                               icon:'🏢', sort_order:4 },
];
const ins = db.prepare(`INSERT OR IGNORE INTO services(name,slug,description,icon,sort_order) VALUES(?,?,?,?,?)`);
svcs.forEach(s => ins.run(s.name,s.slug,s.description,s.icon,s.sort_order));
console.log('Default services seeded');

// Default settings
const defs = {
  company_name: 'Shanghai Fulfill Aviation Ground Service',
  company_tagline: '',
  address: 'Room 801, 600 Yunjin Road, Xuhui District, Shanghai',
  phone: '+86 21 XXXX XXXX',
  fax: '+86 21 XXXX XXXX',
  email: 'info@fulfill-aviation.com',
  wechat_qr: '',
  hero1_tag: 'Professional Aviation Services',
  hero1_title: 'Technology-Led, Talent-Driven, World-Class Aviation',
  hero1_sub: 'Professional. Reliable. Global.',
  hero2_tag: 'Expanding Horizons',
  hero2_title: 'Opening Skies, Enabling Journeys',
  hero2_sub: 'Making flight better for everyone.',
  stat_years: '10+',
  stat_destinations: '50+',
  stat_partners: '200+',
  intro_text: 'Shanghai Fulfill Aviation Ground Service is a professional aviation services company specializing in operational support and travel solutions for governments, enterprises, aircraft manufacturers, airlines, and aircraft owners.',
};
const setIns = db.prepare(`INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)`);
Object.entries(defs).forEach(([k,v]) => setIns.run(k,v));
console.log('Default settings seeded');

// Sample news
const newsIns = db.prepare(`INSERT OR IGNORE INTO news(title,slug,excerpt,body,published,featured,created_at) VALUES(?,?,?,?,1,1,?)`);
newsIns.run(
  'Welcome to Shanghai Fulfill Aviation Ground Service',
  'welcome-to-fulfill-aviation',
  'We are proud to launch our new website and look forward to serving aviation clients worldwide.',
  '<p>We are proud to launch our new website and look forward to serving aviation clients worldwide. Our team of experienced professionals is dedicated to providing world-class aviation ground services.</p>',
  new Date().toISOString()
);
console.log('Sample news seeded');

db.close();
console.log('Seed complete.');