import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const request = require('supertest');
const { startTestDb } = require('../setup');
const createApp = require('../../../api/_app');

describe('users & leaderboard routes', () => {
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

  it('fetches a public user profile without the password hash', async () => {
    await request(app).post('/api/auth/register').send({ username: 'erin', password: 'pw' });
    const res = await request(app).get('/api/users/erin');
    expect(res.status).toBe(200);
    expect(res.body.elo).toBe(1200);
    expect(res.body.passwordHash).toBeUndefined();
  });

  it('404s for a user that does not exist', async () => {
    const res = await request(app).get('/api/users/nobody-here');
    expect(res.status).toBe(404);
  });

  it('lists the leaderboard sorted by elo, without password hashes', async () => {
    await request(app).post('/api/auth/register').send({ username: 'frank', password: 'pw' });
    const res = await request(app).get('/api/leaderboard');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.every((u) => u.passwordHash === undefined)).toBe(true);
  });
});
