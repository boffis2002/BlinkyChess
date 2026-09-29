const rateLimit = require('express-rate-limit');

// One shared budget across register+login so switching endpoints doesn't
// reset an attacker's attempt count. Skipped entirely when NODE_ENV==='test'
// (Vitest's default) — every integration test file registers/logs in far
// more than 10 times per run against one long-lived app instance.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV === 'test',
  message: { error: 'too many attempts, try again later' },
});

module.exports = { authLimiter };
