const express = require('express');
const router = express.Router();

const users = require('../../src/models/users');
const { hashPassword, verifyPassword } = require('../../src/auth/password');
const { signToken } = require('../../src/auth/jwt');
const { isValidUsername, isValidPassword } = require('../lib/validate');
const asyncHandler = require('../lib/asyncHandler');
const publicUser = require('../lib/publicUser');
const requireAuth = require('../middleware/requireAuth');

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days, matches the JWT expiry

function setSessionCookie(res, username) {
  const token = signToken({ username });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE_MS,
  });
}

router.post('/register', asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  if (!isValidUsername(username) || !isValidPassword(password)) {
    return res.status(400).json({ error: 'invalid username or password' });
  }

  const passwordHash = await hashPassword(password);
  const user = await users.createUser({ username, passwordHash });
  if (!user) {
    return res.status(409).json({ error: 'username already taken' });
  }

  setSessionCookie(res, username);
  res.status(201).json(publicUser(user));
}));

router.post('/login', asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  if (!isValidUsername(username) || !isValidPassword(password)) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  const user = await users.getUserByUsername(username);
  const valid = user && (await verifyPassword(password, user.passwordHash));
  if (!valid) {
    return res.status(401).json({ error: 'invalid username or password' });
  }

  setSessionCookie(res, username);
  res.status(200).json(publicUser(user));
}));

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.status(204).end();
});

// Lets the client discover who's logged in without ever reading the
// httpOnly cookie itself — used to restore the session after a page refresh.
router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({ username: req.user.username });
});

module.exports = router;
