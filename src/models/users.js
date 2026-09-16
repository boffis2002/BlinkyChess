const { getDb } = require('./db');

function shiftResults(lastResults, resultChar) {
  const chars = (lastResults || 'nnnnnnnnnn').split('');
  for (let i = 1; i < 10; i++) chars[i - 1] = chars[i];
  chars[9] = resultChar;
  return chars.join('');
}

async function createUser({ username, passwordHash }) {
  const db = await getDb();
  const collection = db.collection('users');
  const existing = await collection.findOne({ username });
  if (existing) return null;

  const user = {
    username,
    passwordHash,
    elo: 1200,
    wins: 0,
    losses: 0,
    draws: 0,
    lastResults: 'nnnnnnnnnn',
    createdAt: new Date(),
  };
  await collection.insertOne(user);
  return user;
}

async function getUserByUsername(username) {
  const db = await getDb();
  return db.collection('users').findOne({ username });
}

// outcome: 'win' | 'loss' | 'draw'
async function recordGameResult(username, { outcome, eloDelta }) {
  const db = await getDb();
  const collection = db.collection('users');
  const user = await collection.findOne({ username });
  if (!user) throw new Error('user not found');

  const resultChar = outcome === 'win' ? 'w' : outcome === 'loss' ? 'l' : 'd';
  await collection.updateOne(
    { username },
    {
      $inc: {
        elo: eloDelta,
        wins: outcome === 'win' ? 1 : 0,
        losses: outcome === 'loss' ? 1 : 0,
        draws: outcome === 'draw' ? 1 : 0,
      },
      $set: { lastResults: shiftResults(user.lastResults, resultChar) },
    }
  );
  return collection.findOne({ username });
}

async function listLeaderboard(limit = 50) {
  const db = await getDb();
  return db.collection('users').find({}).sort({ elo: -1 }).limit(limit).toArray();
}

module.exports = { createUser, getUserByUsername, recordGameResult, listLeaderboard, shiftResults };
