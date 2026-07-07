require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Setup DB schema and seed default data on every boot
const DB_PATH = path.join(__dirname, '../data/fulfill.db');
console.log('[boot] DB path:', DB_PATH);
console.log('[boot] DB exists:', fs.existsSync(DB_PATH));
require('./db/setup');
require('./db/seed');
console.log('[boot] DB ready.');

const { apiLimiter } = require('./middleware/rateLimit');

const app = express();

// ── Security headers ────────────────────────────────────────────────────────
app.set('trust proxy', 1);
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-hashes'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
    },
  },
}));

// ── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = (process.env.ALLOWED_ORIGINS || process.env.BASE_URL || '*').split(',');
app.use(cors({
  origin: allowedOrigins[0] === '*' ? '*' : (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
}));

// ── Middleware ───────────────────────────────────────────────────────────────
app.use(compression());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ── Static files ─────────────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
app.use('/uploads', express.static(UPLOADS_DIR, { maxAge: '7d' }));

const PUBLIC_DIR = path.join(__dirname, '../public');
if (fs.existsSync(PUBLIC_DIR)) app.use(express.static(PUBLIC_DIR, { maxAge: '1d' }));

// ── API routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',     require('./routes/auth'));
app.use('/api', apiLimiter);
app.use('/api/contacts', require('./routes/contact'));
app.use('/api/news',     require('./routes/news'));
app.use('/api/services', require('./routes/services'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/upload',   require('./routes/upload'));
app.use('/api/stats',    require('./routes/stats'));
app.use('/api/gallery',  require('./routes/gallery'));
app.use('/api/team',     require('./routes/team'));
app.use('/api/partners', require('./routes/partners'));
app.use('/api/flights',  require('./routes/flights'));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// ── Admin SPA ─────────────────────────────────────────────────────────────────
const ADMIN_DIR = path.join(__dirname, '../admin');
if (fs.existsSync(ADMIN_DIR)) {
  app.use('/admin', express.static(ADMIN_DIR));
  app.get('/admin/*', (req, res) => res.sendFile(path.join(ADMIN_DIR, 'index.html')));
}

// ── Frontend SPA fallback ─────────────────────────────────────────────────────
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/admin') || req.path.startsWith('/uploads')) return next();
  const index = path.join(PUBLIC_DIR, 'index.html');
  if (fs.existsSync(index)) res.sendFile(index);
  else res.status(404).send('Not found');
});

// ── 404 / error handlers ─────────────────────────────────────────────────────
app.use('/api/*', (req, res) => res.status(404).json({ error: 'API endpoint not found' }));

app.use((err, req, res, next) => {
  console.error('[error]', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ error: 'File too large' });
  res.status(err.status || 500).json({ error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message });
});

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT) || 3000;
app.listen(PORT, () => {
  console.log('Fulfill Aviation backend running on port', PORT);
  console.log('Admin panel: http://localhost:' + PORT + '/admin');
  console.log('API health:  http://localhost:' + PORT + '/api/health');
});
