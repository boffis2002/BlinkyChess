const { ObjectId } = require('mongodb');
const { getDb } = require('./db');
const { createGame } = require('./games');

// Atomically claims ONE waiting entry matching these preferences, excluding the
// caller's own username. The status flip (waiting -> matched) happens in the
// same operation Mongo performs, so two concurrent callers can never both
// claim the same waiting entry.
async function claimOpponent(collection, username, timeControl, ranked) {
  const result = await collection.findOneAndUpdate(
    {
      status: 'waiting',
      username: { $ne: username },
      ranked,
      'timeControl.initial': timeControl.initial,
      'timeControl.increment': timeControl.increment,
    },
    { $set: { status: 'matched' } },
    { sort: { createdAt: 1 }, returnDocument: 'after' }
  );
  // Tolerate both driver response shapes (raw document vs. {value: document}).
  return (result && result.value !== undefined ? result.value : result) || null;
}

async function pairUp(collection, opponentEntry, me) {
  const white = Math.random() < 0.5 ? opponentEntry.username : me.username;
  const black = white === opponentEntry.username ? me.username : opponentEntry.username;
  const game = await createGame({
    white,
    black,
    ranked: opponentEntry.ranked,
    timeControl: opponentEntry.timeControl,
  });
  await collection.updateOne({ _id: opponentEntry._id }, { $set: { gameId: game._id } });
  return game;
}

async function joinQueue({ username, timeControl, ranked }) {
  const db = await getDb();
  const collection = db.collection('matchQueue');

  const opponent = await claimOpponent(collection, username, timeControl, ranked);
  if (opponent) {
    const game = await pairUp(collection, opponent, { username, timeControl, ranked });
    return { matched: true, game };
  }

  const entry = { username, timeControl, ranked, status: 'waiting', gameId: null, createdAt: new Date() };
  const { insertedId } = await collection.insertOne(entry);
  return { matched: false, queueEntryId: insertedId };
}

// Called while a client is waiting. Checks whether it has since been matched
// by someone else's joinQueue, and — if not — opportunistically tries to
// claim a newer waiting entry itself. This is what guarantees two players
// who joined at the same instant (and so both landed in "waiting") still end
// up paired on the very next poll, instead of waiting forever.
async function pollQueue(queueEntryId) {
  const db = await getDb();
  const collection = db.collection('matchQueue');
  const entry = await collection.findOne({ _id: new ObjectId(queueEntryId) });
  if (!entry) return { matched: false, gameId: null };
  if (entry.status === 'matched' && entry.gameId) {
    return { matched: true, gameId: entry.gameId };
  }

  const opponent = await claimOpponent(collection, entry.username, entry.timeControl, entry.ranked);
  if (opponent) {
    const game = await pairUp(collection, opponent, entry);
    await collection.updateOne({ _id: entry._id }, { $set: { status: 'matched', gameId: game._id } });
    return { matched: true, gameId: game._id };
  }
  return { matched: false, gameId: null };
}

async function leaveQueue(queueEntryId) {
  const db = await getDb();
  await db.collection('matchQueue').deleteOne({ _id: new ObjectId(queueEntryId), status: 'waiting' });
}

module.exports = { joinQueue, pollQueue, leaveQueue };
