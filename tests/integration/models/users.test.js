import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const { startTestDb } = require('../setup');
const users = require('../../../src/models/users');

describe('users model (integration, in-memory MongoDB)', () => {
  let stopTestDb;

  beforeAll(async () => {
    stopTestDb = await startTestDb();
  });

  afterAll(async () => {
    await stopTestDb();
  });

  it('creates a user with default stats', async () => {
    const user = await users.createUser({ username: 'alice', passwordHash: 'hashed' });
    expect(user.username).toBe('alice');
    expect(user.elo).toBe(1200);
    expect(user.wins).toBe(0);
    expect(user.lastResults).toBe('nnnnnnnnnn');
  });

  it('refuses to create a duplicate username', async () => {
    await users.createUser({ username: 'bob', passwordHash: 'hashed' });
    const duplicate = await users.createUser({ username: 'bob', passwordHash: 'other-hash' });
    expect(duplicate).toBeNull();
  });

  it('fetches a user by username', async () => {
    await users.createUser({ username: 'carol', passwordHash: 'hashed' });
    const found = await users.getUserByUsername('carol');
    expect(found).not.toBeNull();
    expect(found.username).toBe('carol');
  });

  it('returns null for a user that does not exist', async () => {
    const found = await users.getUserByUsername('nobody');
    expect(found).toBeNull();
  });

  it('records a win: increments wins/elo and shifts the results string', async () => {
    await users.createUser({ username: 'dave', passwordHash: 'hashed' });
    const updated = await users.recordGameResult('dave', { outcome: 'win', eloDelta: 16 });
    expect(updated.wins).toBe(1);
    expect(updated.elo).toBe(1216);
    expect(updated.lastResults).toBe('nnnnnnnnnw');
  });

  it('records a loss and a draw correctly, shifting results each time', async () => {
    await users.createUser({ username: 'erin', passwordHash: 'hashed' });
    await users.recordGameResult('erin', { outcome: 'loss', eloDelta: -12 });
    const afterDraw = await users.recordGameResult('erin', { outcome: 'draw', eloDelta: 0 });
    expect(afterDraw.losses).toBe(1);
    expect(afterDraw.draws).toBe(1);
    expect(afterDraw.elo).toBe(1188);
    expect(afterDraw.lastResults).toBe('nnnnnnnnld');
  });

  it('lists the leaderboard sorted by elo descending', async () => {
    await users.createUser({ username: 'frank', passwordHash: 'h' });
    await users.recordGameResult('frank', { outcome: 'win', eloDelta: 200 });
    const board = await users.listLeaderboard(5);
    expect(board[0].username).toBe('frank');
    expect(board[0].elo).toBeGreaterThanOrEqual(board[1].elo);
  });
});
