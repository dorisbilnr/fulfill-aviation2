const router = require('express').Router();
const db = require('../db/client');
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
  const totalContacts = db.prepare('SELECT COUNT(*) as n FROM contacts').get().n;
  const newContacts   = db.prepare("SELECT COUNT(*) as n FROM contacts WHERE status='new'").get().n;
  const totalNews     = db.prepare('SELECT COUNT(*) as n FROM news').get().n;
  const publishedNews = db.prepare('SELECT COUNT(*) as n FROM news WHERE published=1').get().n;
  const totalServices = db.prepare('SELECT COUNT(*) as n FROM services WHERE active=1').get().n;
  const recentContacts = db.prepare("SELECT first_name,last_name,email,service,created_at FROM contacts ORDER BY created_at DESC LIMIT 5").all();
  res.json({ totalContacts, newContacts, totalNews, publishedNews, totalServices, recentContacts });
});

module.exports = router;