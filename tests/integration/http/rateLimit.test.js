import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const request = require('supertest');
const { startTestDb } = require('../setup');
const createApp = require('../../../api/_app');

describe('auth rate limiting', () => {
  let stopTestDb;
  let app;
  const originalNodeEnv = process.env.NODE_ENV;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'test-secret';
    stopTestDb = await startTestDb();
    // The limiter skips itself when NODE_ENV==='test' (every other test file
    // relies on that to fire many auth calls per run) — flip it just for
    // this file so the real behavior actually runs.
    process.env.NODE_ENV = 'rate-limit-test';
    app = createApp();
  });

  afterAll(async () => {
    process.env.NODE_ENV = originalNodeEnv;
    await stopTestDb();
  });

  it('blocks further login attempts from the same IP after the limit is hit', async () => {
    let lastRes;
    for (let i = 0; i < 11; i++) {
      lastRes = await request(app).post('/api/auth/login').send({ username: 'nobody', password: 'wrong' });
    }
    expect(lastRes.status).toBe(429);
    expect(lastRes.body.error).toBeTruthy();
  });

  it('shares the same budget between register and login', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'shouldbeblocked', password: 'hunter2' });
    expect(res.status).toBe(429);
  });
});
