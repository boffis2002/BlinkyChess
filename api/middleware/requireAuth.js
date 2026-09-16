const { verifyToken } = require('../../src/auth/jwt');

function requireAuth(req, res, next) {
  const token = req.cookies && req.cookies.token;
  const payload = token && verifyToken(token);
  if (!payload || typeof payload.username !== 'string') {
    return res.status(401).json({ error: 'unauthorized' });
  }
  req.user = { username: payload.username };
  next();
}

module.exports = requireAuth;
