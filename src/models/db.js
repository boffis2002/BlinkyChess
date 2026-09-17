const { MongoClient } = require('mongodb');

let clientPromise = null;

// Every lookup by username/status/player was doing a full collection scan —
// harmless with a handful of test documents, but it's the kind of thing that
// quietly turns into real latency as the collections grow. Cheap to run on
// every cold start since createIndex is a no-op once the index exists.
async function ensureIndexes(client) {
  const db = client.db('BlinkyChess');
  await Promise.all([
    db.collection('users_v2').createIndex({ username: 1 }, { unique: true }),
    db.collection('games_v2').createIndex({ status: 1 }),
    db.collection('games_v2').createIndex({ 'players.white': 1 }),
    db.collection('games_v2').createIndex({ 'players.black': 1 }),
  ]);
}

function getClient() {
  if (!clientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    clientPromise = new MongoClient(uri).connect().then(async (client) => {
      await ensureIndexes(client);
      return client;
    });
  }
  return clientPromise;
}

async function getDb(dbName = 'BlinkyChess') {
  const client = await getClient();
  return client.db(dbName);
}

// Test-only: drop the cached connection so the next getDb() call reconnects
// (used to point at a fresh mongodb-memory-server instance between test files).
async function resetConnection() {
  if (clientPromise) {
    const client = await clientPromise;
    await client.close();
  }
  clientPromise = null;
}

module.exports = { getClient, getDb, resetConnection };
