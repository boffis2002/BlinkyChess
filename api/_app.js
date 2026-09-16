require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const { router: usersRoutes, getLeaderboard } = require('./routes/users');
const queueRoutes = require('./routes/queue');
const gamesRoutes = require('./routes/games');

function assertRequiredEnv() {
  const missing = ['MONGODB_URI', 'JWT_SECRET'].filter((name) => !process.env[name]);
  if (missing.length) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
}

function createApp() {
  assertRequiredEnv();
  const app = express();

  app.use(express.json({ limit: '1MB' }));
  app.use(cookieParser());

  app.use('/api/auth', authRoutes);
  app.get('/api/leaderboard', getLeaderboard);
  app.use('/api/users', usersRoutes);
  app.use('/api/queue', queueRoutes);
  app.use('/api/games', gamesRoutes);

  app.use((req, res) => {
    res.status(404).json({ error: 'not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err && err.name === 'BSONError') {
      return res.status(400).json({ error: 'invalid id' });
    }
    console.error(err);
    res.status(500).json({ error: 'internal server error' });
  });

  return app;
}

module.exports = createApp;
