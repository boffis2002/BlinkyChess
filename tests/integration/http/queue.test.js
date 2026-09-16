import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const request = require('supertest');
const { startTestDb } = require('../setup');
const createApp = require('../../../api/_app');

const TIME_CONTROL = { initial: 300, increment: 15 };

describe('queue routes', () => {
  let stopTestDb;
  let app;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    stopTestDb = await startTestDb();
    app = createApp();
  });

  afterAll(async () => {
    await stopTestDb();
  });

  it('rejects joining the queue without a session cookie', async () => {
    const res = await request(app).post('/api/queue/join').send({ timeControl: TIME_CONTROL, ranked: false });
    expect(res.status).toBe(401);
  });

  it('matches two players who join with the same preferences, and the resulting game uses their real usernames (never a client-supplied one)', async () => {
    const alice = request.agent(app);
    const bob = request.agent(app);
    await alice.post('/api/auth/register').send({ username: 'alice', password: 'pw' });
    await bob.post('/api/auth/register').send({ username: 'bob', password: 'pw' });

    const first = await alice.post('/api/queue/join').send({ timeControl: TIME_CONTROL, ranked: true });
    expect(first.body.matched).toBe(false);

    const second = await bob.post('/api/queue/join').send({ timeControl: TIME_CONTROL, ranked: true });
    expect(second.body.matched).toBe(true);

    const game = await alice.get(`/api/games/${second.body.gameId}`);
    expect([game.body.players.white, game.body.players.black].sort()).toEqual(['alice', 'bob']);
  });

  it('a queue/join body cannot impersonate another username — the game always uses the cookie identity', async () => {
    const carol = request.agent(app);
    await carol.post('/api/auth/register').send({ username: 'carol', password: 'pw' });
    // Try to sneak in as someone else via the body.
    const res = await carol.post('/api/queue/join').send({ username: 'someone-else', timeControl: TIME_CONTROL, ranked: false });
    expect(res.status).toBe(200);
    expect(res.body.matched).toBe(false);

    const dave = request.agent(app);
    await dave.post('/api/auth/register').send({ username: 'dave', password: 'pw' });
    const matchResult = await dave.post('/api/queue/join').send({ timeControl: TIME_CONTROL, ranked: false });
    expect(matchResult.body.matched).toBe(true);

    const game = await dave.get(`/api/games/${matchResult.body.gameId}`);
    expect([game.body.players.white, game.body.players.black]).not.toContain('someone-else');
    expect([game.body.players.white, game.body.players.black].sort()).toEqual(['carol', 'dave']);
  });

  it('status reports matched:false while alone, then true once paired', async () => {
    const erin = request.agent(app);
    await erin.post('/api/auth/register').send({ username: 'erin', password: 'pw' });
    const joinRes = await erin.post('/api/queue/join').send({ timeControl: { initial: 60, increment: 0 }, ranked: false });
    expect(joinRes.body.matched).toBe(false);

    const statusBefore = await erin.get(`/api/queue/status?queueEntryId=${joinRes.body.queueEntryId}`);
    expect(statusBefore.body.matched).toBe(false);

    const frank = request.agent(app);
    await frank.post('/api/auth/register').send({ username: 'frank', password: 'pw' });
    await frank.post('/api/queue/join').send({ timeControl: { initial: 60, increment: 0 }, ranked: false });

    const statusAfter = await erin.get(`/api/queue/status?queueEntryId=${joinRes.body.queueEntryId}`);
    expect(statusAfter.body.matched).toBe(true);
  });

  it('leaveQueue removes a waiting entry so it is never matched later', async () => {
    const gary = request.agent(app);
    await gary.post('/api/auth/register').send({ username: 'gary', password: 'pw' });
    const joinRes = await gary.post('/api/queue/join').send({ timeControl: { initial: 90, increment: 0 }, ranked: false });
    await gary.delete('/api/queue/leave').send({ queueEntryId: joinRes.body.queueEntryId });

    const status = await gary.get(`/api/queue/status?queueEntryId=${joinRes.body.queueEntryId}`);
    expect(status.body.matched).toBe(false);
    expect(status.body.gameId).toBeNull();
  });
});
