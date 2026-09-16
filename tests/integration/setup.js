const { MongoMemoryServer } = require('mongodb-memory-server');
const { resetConnection } = require('../../src/models/db');

// Shared helper for integration tests: starts a fresh in-memory MongoDB
// instance, points MONGODB_URI at it, and returns a teardown function.
async function startTestDb() {
  const mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await resetConnection();
  return async function stopTestDb() {
    await resetConnection();
    await mongod.stop();
  };
}

module.exports = { startTestDb };
