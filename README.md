# Fulfill Aviation — Backend

Production-ready Node.js backend for Shanghai Fulfill Aviation Ground Service website.

## Quick Start (5 minutes)

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env — set JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, SMTP settings
```

### 3. Start server
```bash
npm start
# Database is created automatically on first run
# Admin is seeded from your .env credentials
```

### 4. Access
- Frontend: http://localhost:3000
- Admin panel: http://localhost:3000/admin
- API health: http://localhost:3000/api/health

---

## API Reference

### Public Endpoints (no auth)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/contacts | Submit contact form |
| GET  | /api/news | List published news |
| GET  | /api/news/:slug | Get single news article |
| GET  | /api/services | List active services |
| GET  | /api/services/:slug | Get single service |
| GET  | /api/settings/public | Get public site settings |

### Admin Endpoints (Bearer token required)
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/login | Login → returns JWT |
| POST | /api/auth/change-password | Change admin password |
| GET  | /api/stats | Dashboard stats |
| GET  | /api/contacts | List all contacts |
| PATCH | /api/contacts/:id/status | Update contact status |
| DELETE | /api/contacts/:id | Delete contact |
| GET/POST/PUT/DELETE | /api/news/* | Full news CRUD |
| GET/POST/PUT/DELETE | /api/services/* | Full services CRUD |
| GET/PUT | /api/settings | Get/update site settings |
| POST | /api/upload | Upload image file |

---

## Connecting Your Frontend

Add this script to your HTML pages to load dynamic content from the backend:

```html
<script>
fetch('/api/settings/public')
  .then(r => r.json())
  .then(settings => {
    document.querySelector('.hero-title').textContent = settings.hero1_title;
    // etc.
  });
</script>
```

---

## Production Deployment (DigitalOcean / VPS)

```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
npm install -g pm2

# Clone/upload your project, then:
npm install --production
cp .env.example .env && nano .env   # fill in your values
npm start                           # first run creates DB

# Start with PM2
pm2 start src/server.js --name fulfill-aviation
pm2 save
pm2 startup
```

## Deploy to Railway / Render (easiest)
1. Push this folder to a GitHub repo
2. Connect Railway.app or Render.com to that repo
3. Add your .env variables in the platform dashboard
4. Deploy — done

## File Structure
```
fulfill-backend/
├── src/
│   ├── server.js          # Main entry point
│   ├── db/
│   │   ├── client.js      # SQLite connection
│   │   ├── setup.js       # Table creation
│   │   └── seed.js        # Initial data
│   ├── routes/
│   │   ├── auth.js        # Login / change password
│   │   ├── contact.js     # Contact form
│   │   ├── news.js        # News CRUD
│   │   ├── services.js    # Services CRUD
│   │   ├── settings.js    # Site settings
│   │   ├── upload.js      # File uploads
│   │   └── stats.js       # Dashboard stats
│   ├── middleware/
│   │   ├── auth.js        # JWT verification
│   │   └── rateLimit.js   # Rate limiting
│   └── utils/
│       ├── mailer.js      # Email notifications
│       └── slug.js        # URL slug helper
├── admin/
│   └── index.html         # Admin panel SPA
├── uploads/               # Uploaded images (auto-created)
├── data/                  # SQLite database (auto-created)
├── public/                # Put your HTML files here
├── .env.example
└── package.json
```
