const jwt = require('jsonwebtoken');

const DEFAULT_EXPIRY = '7d';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
}

function signToken(payload, expiresIn = DEFAULT_EXPIRY) {
  return jwt.sign(payload, getSecret(), { expiresIn });
}

// Returns the decoded payload, or null if the token is missing/invalid/expired.
function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch {
    return null;
  }
}

module.exports = { signToken, verifyToken };
