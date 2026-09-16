import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const request = require('supertest');
const { startTestDb } = require('../setup');
const createApp = require('../../../api/_app');

describe('auth routes', () => {
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

  it('registers a new user, sets a session cookie, never returns the password hash', async () => {
    const res = await request(app).post('/api/auth/register').send({ username: 'alice', password: 'hunter2' });
    expect(res.status).toBe(201);
    expect(res.body.username).toBe('alice');
    expect(res.body.passwordHash).toBeUndefined();
    expect(res.headers['set-cookie'][0]).toMatch(/^token=/);
    expect(res.headers['set-cookie'][0]).toMatch(/HttpOnly/);
  });

  it('rejects registering a username that is already taken', async () => {
    await request(app).post('/api/auth/register').send({ username: 'bob', password: 'hunter2' });
    const res = await request(app).post('/api/auth/register').send({ username: 'bob', password: 'something-else' });
    expect(res.status).toBe(409);
  });

  it('rejects registration with an invalid username (e.g. containing a space, or a NoSQL-injection-shaped body)', async () => {
    const withSpace = await request(app).post('/api/auth/register').send({ username: 'has space', password: 'hunter2' });
    expect(withSpace.status).toBe(400);

    const injected = await request(app)
      .post('/api/auth/register')
      .send({ username: { $ne: null }, password: 'hunter2' });
    expect(injected.status).toBe(400);
  });

  it('logs in with correct credentials', async () => {
    await request(app).post('/api/auth/register').send({ username: 'carol', password: 'correct-password' });
    const res = await request(app).post('/api/auth/login').send({ username: 'carol', password: 'correct-password' });
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('carol');
  });

  it('rejects login with a wrong password', async () => {
    await request(app).post('/api/auth/register').send({ username: 'dave', password: 'correct-password' });
    const res = await request(app).post('/api/auth/login').send({ username: 'dave', password: 'wrong-password' });
    expect(res.status).toBe(401);
  });

  it('rejects login for a user that does not exist', async () => {
    const res = await request(app).post('/api/auth/login').send({ username: 'nobody', password: 'whatever' });
    expect(res.status).toBe(401);
  });

  it('logout clears the session cookie', async () => {
    const res = await request(app).post('/api/auth/logout');
    expect(res.status).toBe(204);
    expect(res.headers['set-cookie'][0]).toMatch(/^token=;/);
  });

  it('me returns the logged-in username from the cookie, without needing it re-sent', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').send({ username: 'erin', password: 'hunter2' });
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.username).toBe('erin');
  });

  it('me rejects a request with no session cookie', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});
