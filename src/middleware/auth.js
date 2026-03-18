const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const auth = req.headers['authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const secret = String(process.env.JWT_SECRET || 'default_dev_secret_abc123');
    const payload = jwt.verify(auth.slice(7), secret);
    req.admin = payload;
    next();
  } catch(e) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
