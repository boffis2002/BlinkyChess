import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const { startTestDb } = require('../setup');
const queue = require('../../../src/models/queue');
const { getDb } = require('../../../src/models/db');

const TIME_CONTROL = { initial: 300, increment: 15 };

describe('matchmaking queue (integration, bug #6: race condition creating duplicate games)', () => {
  let stopTestDb;

  beforeAll(async () => {
    stopTestDb = await startTestDb();
  });

  afterAll(async () => {
    await stopTestDb();
  });

  it('matches a second joiner against a waiting player (normal sequential path)', async () => {
    const first = await queue.joinQueue({ username: 'alice', timeControl: TIME_CONTROL, ranked: true });
    expect(first.matched).toBe(false);

    const second = await queue.joinQueue({ username: 'bob', timeControl: TIME_CONTROL, ranked: true });
    expect(second.matched).toBe(true);
    expect([second.game.players.white, second.game.players.black].sort()).toEqual(['alice', 'bob']);
  });

  it('never creates two games when two players race for the same waiting opponent', async () => {
    const waiting = await queue.joinQueue({ username: 'carol', timeControl: TIME_CONTROL, ranked: false });
    expect(waiting.matched).toBe(false);

    // Two different players simultaneously try to claim "carol" from the queue.
    const [resultA, resultB] = await Promise.all([
      queue.joinQueue({ username: 'dave', timeControl: TIME_CONTROL, ranked: false }),
      queue.joinQueue({ username: 'erin', timeControl: TIME_CONTROL, ranked: false }),
    ]);

    const matchedResults = [resultA, resultB].filter((r) => r.matched);
    // Exactly one of the two concurrent callers wins the race and gets paired with carol.
    expect(matchedResults).toHaveLength(1);
    expect([matchedResults[0].game.players.white, matchedResults[0].game.players.black]).toContain('carol');

    // The loser of the race falls back to waiting, it does not create a second game.
    const db = await getDb();
    const gamesInvolvingCarol = await db
      .collection('games_v2')
      .find({ $or: [{ 'players.white': 'carol' }, { 'players.black': 'carol' }] })
      .toArray();
    expect(gamesInvolvingCarol).toHaveLength(1);
  });

  it('recovers a match via polling when two joiners land in "waiting" at the same instant', async () => {
    // Simulate the rare true-race outcome where neither joinQueue call saw the
    // other yet, so both ended up as separate waiting entries.
    const db = await getDb();
    const now = new Date();
    const { insertedId: frankId } = await db.collection('matchQueue').insertOne({
      username: 'frank',
      timeControl: TIME_CONTROL,
      ranked: true,
      status: 'waiting',
      gameId: null,
      createdAt: now,
    });
    const { insertedId: graceId } = await db.collection('matchQueue').insertOne({
      username: 'grace',
      timeControl: TIME_CONTROL,
      ranked: true,
      status: 'waiting',
      gameId: null,
      createdAt: now,
    });

    const pollResult = await queue.pollQueue(frankId);
    expect(pollResult.matched).toBe(true);

    // The other side's entry must now point at the same game.
    const graceEntry = await db.collection('matchQueue').findOne({ _id: graceId });
    expect(graceEntry.status).toBe('matched');
    expect(graceEntry.gameId.toString()).toBe(pollResult.gameId.toString());

    const gracePoll = await queue.pollQueue(graceId);
    expect(gracePoll.matched).toBe(true);
    expect(gracePoll.gameId.toString()).toBe(pollResult.gameId.toString());
  });

  it('leaveQueue removes a waiting entry', async () => {
    const { queueEntryId } = await queue.joinQueue({ username: 'henry', timeControl: { initial: 60, increment: 0 }, ranked: false });
    await queue.leaveQueue(queueEntryId);
    const db = await getDb();
    const entry = await db.collection('matchQueue').findOne({ _id: queueEntryId });
    expect(entry).toBeNull();
  });
});
