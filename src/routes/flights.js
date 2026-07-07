// 航班查询模块：把 admin 后台的指令转发给本机 8300 端口的航班追踪服务
const express = require('express');
const http = require('http');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/command', auth, (req, res) => {
  const payload = JSON.stringify({
    text: (req.body && req.body.text) || '',
    user: (req.admin && (req.admin.username || req.admin.user)) || 'admin',
  });
  const fr = http.request(
    { host: '127.0.0.1', port: 8300, path: '/internal/command', method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) },
      timeout: 45000 },
    (pr) => {
      let buf = '';
      pr.on('data', (c) => (buf += c));
      pr.on('end', () => {
        try { res.json(JSON.parse(buf)); }
        catch (e) { res.status(502).json({ error: 'flight service bad response' }); }
      });
    }
  );
  fr.on('timeout', () => { fr.destroy(); res.status(504).json({ error: 'flight service timeout' }); });
  fr.on('error', () => res.status(502).json({ error: 'flight service unavailable' }));
  fr.write(payload);
  fr.end();
});

module.exports = router;
