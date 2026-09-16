const { MongoClient } = require('mongodb');

let clientPromise = null;

function getClient() {
  if (!clientPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not set');
    clientPromise = new MongoClient(uri).connect();
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
