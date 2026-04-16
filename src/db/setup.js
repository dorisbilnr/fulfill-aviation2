const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '../../data');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(path.join(DB_DIR, 'fulfill.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    name TEXT NOT NULL DEFAULT 'Admin',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    last_login TEXT
  );
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT,
    service TEXT,
    message TEXT NOT NULL,
    ip TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_contacts_status ON contacts(status);
  CREATE INDEX IF NOT EXISTS idx_contacts_created ON contacts(created_at DESC);
  CREATE TABLE IF NOT EXISTS news (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    body TEXT,
    image_url TEXT,
    published INTEGER NOT NULL DEFAULT 0,
    featured INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_news_published ON news(published, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_news_slug ON news(slug);
  CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    details TEXT,
    icon TEXT,
    image_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS team_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL DEFAULT 'Team Member Name',
    name_zh TEXT NOT NULL DEFAULT '团队成员',
    role TEXT NOT NULL DEFAULT 'Position',
    role_zh TEXT NOT NULL DEFAULT '职位',
    photo_url TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS partners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    sort_order INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

// Add new columns to existing tables if they don't already exist
// (ALTER TABLE IF NOT EXISTS col is not supported in SQLite; use try/catch)
const addColumn = (table, col, type) => {
  try {
    db.prepare(`ALTER TABLE ${table} ADD COLUMN ${col} ${type}`).run();
    console.log(`[setup] Added column ${table}.${col}`);
  } catch (e) {
    // Column already exists — ignore
  }
};

// services: bilingual fields
addColumn('services', 'name_zh', 'TEXT');
addColumn('services', 'description_zh', 'TEXT');
addColumn('services', 'details_zh', 'TEXT');

// news: English fields
addColumn('news', 'title_en', 'TEXT');
addColumn('news', 'excerpt_en', 'TEXT');
addColumn('news', 'content_en', 'TEXT');
// news: editable publish date
addColumn('news', 'publish_date', 'TEXT');

console.log('[setup] Database setup complete.');
db.close();
