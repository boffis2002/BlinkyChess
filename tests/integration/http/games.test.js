import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const request = require('supertest');
const { startTestDb } = require('../setup');
const createApp = require('../../../api/_app');
const gamesModel = require('../../../src/models/games');

async function registerAndCreateGame(app, { white, black, ranked = false, fen, timeControl = { initial: 300, increment: 15 } }) {
  const whiteAgent = request.agent(app);
  const blackAgent = request.agent(app);
  await whiteAgent.post('/api/auth/register').send({ username: white, password: 'pw' });
  await blackAgent.post('/api/auth/register').send({ username: black, password: 'pw' });

  const game = await gamesModel.createGame({ white, black, ranked, timeControl });
  if (fen) {
    await gamesModel.saveGameState(game._id, { fen, clock: game.clock });
  }
  return { whiteAgent, blackAgent, gameId: game._id };
}

describe('games routes', () => {
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

  it('lets the player to move make a legal move', async () => {
    const { whiteAgent, gameId } = await registerAndCreateGame(app, { white: 'p1', black: 'p2' });
    const res = await whiteAgent.post(`/api/games/${gameId}/moves`).send({ from: 'e2', to: 'e4' });
    expect(res.status).toBe(200);
    expect(res.body.moveHistory).toHaveLength(1);
    expect(res.body.moveHistory[0].san).toBe('e4');
  });

  it('rejects a move from the player who is not on turn (403)', async () => {
    const { blackAgent, gameId } = await registerAndCreateGame(app, { white: 'p3', black: 'p4' });
    const res = await blackAgent.post(`/api/games/${gameId}/moves`).send({ from: 'e7', to: 'e5' });
    expect(res.status).toBe(403);
  });

  it('rejects an illegal move (400), leaving the position unchanged', async () => {
    const { whiteAgent, gameId } = await registerAndCreateGame(app, { white: 'p5', black: 'p6' });
    const res = await whiteAgent.post(`/api/games/${gameId}/moves`).send({ from: 'e2', to: 'e5' });
    expect(res.status).toBe(400);

    const state = await whiteAgent.get(`/api/games/${gameId}`);
    expect(state.body.fen).toBe(gamesModel.START_FEN);
  });

  it('rejects a request from a user who is not one of the two players', async () => {
    const { gameId } = await registerAndCreateGame(app, { white: 'p7', black: 'p8' });
    const outsider = request.agent(app);
    await outsider.post('/api/auth/register').send({ username: 'p9', password: 'pw' });
    const res = await outsider.post(`/api/games/${gameId}/moves`).send({ from: 'e2', to: 'e4' });
    expect(res.status).toBe(403);
  });

  it('performs castling through the real endpoint (bug #1, now end-to-end)', async () => {
    const { whiteAgent, gameId } = await registerAndCreateGame(app, {
      white: 'p10',
      black: 'p11',
      fen: 'r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1',
    });
    const res = await whiteAgent.post(`/api/games/${gameId}/moves`).send({ from: 'e1', to: 'g1' });
    expect(res.status).toBe(200);
    expect(res.body.moveHistory[0].san).toBe('O-O');
  });

  it('performs promotion through the real endpoint (bug #2, now end-to-end)', async () => {
    const { whiteAgent, gameId } = await registerAndCreateGame(app, {
      white: 'p12',
      black: 'p13',
      fen: '8/P6k/8/8/8/8/7K/8 w - - 0 1',
    });
    const res = await whiteAgent.post(`/api/games/${gameId}/moves`).send({ from: 'a7', to: 'a8', promotion: 'q' });
    expect(res.status).toBe(200);
    expect(res.body.moveHistory[0].san).toBe('a8=Q');
    expect(res.body.status).toBe('active');
  });

  it('ends the game on checkmate and updates both players\' stats and ELO', async () => {
    const { blackAgent, gameId } = await registerAndCreateGame(app, {
      white: 'p14',
      black: 'p15',
      ranked: true,
      // Fool's mate, one move before the end: white just played 2.g4, black to deliver Qh4#.
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2',
    });

    const res = await blackAgent.post(`/api/games/${gameId}/moves`).send({ from: 'd8', to: 'h4' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('finished');
    expect(res.body.result).toEqual({ winner: 'black', reason: 'checkmate' });

    const winner = await blackAgent.get('/api/users/p15');
    const loser = await blackAgent.get('/api/users/p14');
    expect(winner.body.wins).toBe(1);
    expect(loser.body.losses).toBe(1);
    expect(winner.body.elo).toBeGreaterThan(1200);
    expect(loser.body.elo).toBeLessThan(1200);
  });

  it('finalizes a game as a timeout when the side to move has run out of time (bug #4, now server-detected)', async () => {
    const { whiteAgent, gameId } = await registerAndCreateGame(app, { white: 'p16', black: 'p17', timeControl: { initial: 60, increment: 0 } });
    // Simulate 400 seconds having passed since white's turn started (60s clock).
    await gamesModel.saveGameState(gameId, {
      fen: gamesModel.START_FEN,
      clock: { white: { remaining: 60 }, black: { remaining: 60 }, turnStartedAt: new Date(Date.now() - 400_000) },
    });

    const res = await whiteAgent.get(`/api/games/${gameId}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('finished');
    expect(res.body.result).toEqual({ winner: 'black', reason: 'timeout' });

    const winner = await whiteAgent.get('/api/users/p17');
    expect(winner.body.wins).toBe(1);
  });

  it('lists finished games history for a user', async () => {
    // p15 won the checkmate test above — that game should show up here.
    const res = await request(app).get('/api/games/history/p15');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].result.winner).toBe('black');
  });
});
