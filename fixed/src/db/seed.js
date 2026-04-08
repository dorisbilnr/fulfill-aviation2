require('dotenv').config({ path: require('path').join(__dirname,'../../.env') });
const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(path.join(DB_DIR, 'fulfill.db'));
db.pragma('foreign_keys = ON');

const MASTER_EMAIL    = 'fulfill.admin@aviation.com';
const MASTER_PASSWORD = 'FulfillAdmin2026!';
const envEmail    = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
const envPassword = (process.env.ADMIN_PASSWORD || '').trim();

db.prepare('DELETE FROM admins').run();
const masterHash = bcrypt.hashSync(MASTER_PASSWORD, 10);
db.prepare('INSERT INTO admins(email,password,name) VALUES(?,?,?)').run(MASTER_EMAIL, masterHash, 'Master Admin');
console.log('[seed] Master admin created:', MASTER_EMAIL);

if (envEmail && envEmail !== MASTER_EMAIL && envPassword) {
  const envHash = bcrypt.hashSync(envPassword, 10);
  db.prepare('INSERT INTO admins(email,password,name) VALUES(?,?,?)').run(envEmail, envHash, 'Administrator');
  console.log('[seed] Env admin created:', envEmail);
}

const svcs = [
  {name:'Flight Operations Support',slug:'flight-operations',description:'Foreign and domestic airline operational support.',icon:'✈',sort_order:1},
  {name:'Aviation Fuel Supply',slug:'fuel-supply',description:'JetA-1 / TS1 / JP8 / AvGas supply with global sourcing.',icon:'⛽',sort_order:2},
  {name:'Charter & Ticketing',slug:'charter-ticketing',description:'Group charter / private charter / cargo charter.',icon:'🛫',sort_order:3},
  {name:'Ground Handling',slug:'ground-handling',description:'Professional ground handling services at major airports.',icon:'🏢',sort_order:4},
  {name:'Navigation & Data',slug:'nav-data',description:'Navigation database management and aviation data services.',icon:'📡',sort_order:5},
];
svcs.forEach(s => db.prepare('INSERT OR IGNORE INTO services(name,slug,description,icon,sort_order) VALUES(?,?,?,?,?)').run(s.name,s.slug,s.description,s.icon,s.sort_order));

// Team members
const teamDefaults = [
  {name:'Team Member Name',name_zh:'团队成员',role:'Chief Executive Officer',role_zh:'首席执行官',sort_order:1},
  {name:'Team Member Name',name_zh:'团队成员',role:'Operations Director',role_zh:'运营总监',sort_order:2},
  {name:'Team Member Name',name_zh:'团队成员',role:'Business Development',role_zh:'业务拓展',sort_order:3},
];
teamDefaults.forEach(m => db.prepare('INSERT OR IGNORE INTO team_members(name,name_zh,role,role_zh,sort_order) VALUES(?,?,?,?,?)').run(m.name,m.name_zh,m.role,m.role_zh,m.sort_order));

const defs = {
  company_name:'Shanghai Fulfill Aviation Ground Service',
  company_name_zh:'上海赋瞻航空地面服务有限公司',
  company_tagline:'',
  address:'Room 801, 600 Yunjin Road, Xuhui District, Shanghai',
  address_zh:'上海市徐汇区云锦路600号801室',
  phone:'+86 21 XXXX XXXX',
  fax:'+86 21 XXXX XXXX',
  email:'info@fulfill-aviation.com',
  business_hours:'Mon – Fri: 9:00 AM – 6:00 PM / Sat: 9:00 AM – 12:00 PM',
  business_hours_zh:'周一至周五：9:00–18:00 / 周六：9:00–12:00',
  hero1_tag:'Professional Aviation Services',
  hero1_title:'Technology-Led, Talent-Driven, World-Class Aviation',
  hero1_sub:'Professional. Reliable. Global.',
  hero2_tag:'Expanding Horizons',
  hero2_title:'Opening Skies, Enabling Journeys',
  hero2_sub:'Making flight better for everyone.',
  stat_years:'10+',
  stat_destinations:'50+',
  stat_partners:'1000+',
  stat_partners_label:'Annual Flights',
  stat_partners_label_zh:'年度航班运营量',
  intro_text:'Shanghai Fulfill Aviation Ground Service is a professional aviation services company specializing in operational support and travel solutions for governments, enterprises, aircraft manufacturers, airlines, and aircraft owners.',
  intro_text_zh:'上海赋瞻航空地面服务有限公司是一家专业航空服务企业，专注为政府、企业、飞机制造商、航空公司及飞机所有者提供运营支持与出行解决方案。',
  nav_home:'Home', nav_home_zh:'首页',
  nav_news:'News', nav_news_zh:'新闻',
  nav_services:'Services', nav_services_zh:'服务',
  nav_charter:'Charter & Ticketing', nav_charter_zh:'包机与机票',
  nav_about:'About Us', nav_about_zh:'关于我们',
  nav_contact:'Contact', nav_contact_zh:'联系我们',
  charter_type1_title:'Group Charter',
  charter_type1_title_zh:'团队包机',
  charter_type1_desc:'Dedicated charter flights for corporate delegations, government missions, conferences, sports teams, and large-scale group travel. Full coordination from departure to arrival.',
  charter_type1_desc_zh:'为企业代表团、政府任务、会议、体育队及大型团体出行提供专属包机服务，全程协调。',
  charter_type2_title:'Private Charter',
  charter_type2_title_zh:'私人包机',
  charter_type2_desc:'Exclusive private jet charter for executives, VIP delegations, and diplomatic missions. Flexible scheduling, premium cabin standards, and complete discretion guaranteed.',
  charter_type2_desc_zh:'为高管、VIP代表团及外交使团提供专属私人飞机服务，灵活安排、顶级舱位标准，完全保密。',
  charter_type3_title:'Cargo Charter',
  charter_type3_title_zh:'货运包机',
  charter_type3_desc:'Air cargo charter solutions for time-critical shipments, oversized freight, hazardous materials, and special handling requirements. Global network, competitive rates.',
  charter_type3_desc_zh:'为时效性货物、超大货物、危险品及特殊处理需求提供航空货运包机方案，全球网络，价格实惠。',
  charter_type4_title:'Airline Ticketing',
  charter_type4_title_zh:'航空机票',
  charter_type4_desc:'Full-service airline ticketing for domestic and international routes on behalf of corporate clients and partner airlines. Competitive group fares and flexible booking arrangements.',
  charter_type4_desc_zh:'代理企业客户及合作航空公司办理国内外航线机票，团体票价优惠，预订灵活。',
};
Object.entries(defs).forEach(([k,v]) => db.prepare('INSERT OR IGNORE INTO settings(key,value) VALUES(?,?)').run(k,v));

db.close();
console.log('[seed] Complete. Login at /admin with:', MASTER_EMAIL, '/', MASTER_PASSWORD);
