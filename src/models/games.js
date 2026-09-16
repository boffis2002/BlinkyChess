const { ObjectId } = require('mongodb');
const { getDb } = require('./db');

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

async function createGame({ white, black, ranked, timeControl }) {
  const db = await getDb();
  const now = new Date();
  const game = {
    players: { white, black },
    status: 'active',
    fen: START_FEN,
    moveHistory: [],
    ranked,
    timeControl,
    clock: {
      white: { remaining: timeControl.initial },
      black: { remaining: timeControl.initial },
      turnStartedAt: now,
    },
    result: null,
    createdAt: now,
    updatedAt: now,
  };
  const { insertedId } = await db.collection('games').insertOne(game);
  return { ...game, _id: insertedId };
}

async function getGameById(id) {
  const db = await getDb();
  return db.collection('games').findOne({ _id: new ObjectId(id) });
}

async function listActiveGames() {
  const db = await getDb();
  return db.collection('games').find({ status: 'active' }).toArray();
}

async function listFinishedGamesForUser(username) {
  const db = await getDb();
  return db
    .collection('games')
    .find({ status: 'finished', $or: [{ 'players.white': username }, { 'players.black': username }] })
    .sort({ updatedAt: -1 })
    .toArray();
}

// moveEntry (optional): { san, from, to, promotion, fen, at }
// status/result (optional): set when the game just ended
async function saveGameState(id, { fen, clock, moveEntry, status, result }) {
  const db = await getDb();
  const update = {
    $set: {
      fen,
      clock,
      updatedAt: new Date(),
      ...(status ? { status } : {}),
      ...(result !== undefined ? { result } : {}),
    },
  };
  if (moveEntry) update.$push = { moveHistory: moveEntry };
  await db.collection('games').updateOne({ _id: new ObjectId(id) }, update);
  return getGameById(id);
}

module.exports = {
  createGame,
  getGameById,
  listActiveGames,
  listFinishedGamesForUser,
  saveGameState,
  START_FEN,
};
