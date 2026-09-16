import { describe, it, expect, beforeAll, afterAll } from 'vitest';
const { startTestDb } = require('../setup');
const games = require('../../../src/models/games');

describe('games model (integration, in-memory MongoDB)', () => {
  let stopTestDb;

  beforeAll(async () => {
    stopTestDb = await startTestDb();
  });

  afterAll(async () => {
    await stopTestDb();
  });

  it('creates a game with the standard starting position and full clocks', async () => {
    const game = await games.createGame({
      white: 'alice',
      black: 'bob',
      ranked: true,
      timeControl: { initial: 300, increment: 15 },
    });
    expect(game.fen).toBe(games.START_FEN);
    expect(game.status).toBe('active');
    expect(game.clock.white.remaining).toBe(300);
    expect(game.clock.black.remaining).toBe(300);
    expect(game.moveHistory).toEqual([]);
  });

  it('fetches a game by id', async () => {
    const created = await games.createGame({
      white: 'alice',
      black: 'bob',
      ranked: false,
      timeControl: { initial: 60, increment: 0 },
    });
    const found = await games.getGameById(created._id);
    expect(found.players).toEqual({ white: 'alice', black: 'bob' });
  });

  it('lists only active games', async () => {
    const active = await games.createGame({
      white: 'a1',
      black: 'b1',
      ranked: false,
      timeControl: { initial: 60, increment: 0 },
    });
    const toFinish = await games.createGame({
      white: 'a2',
      black: 'b2',
      ranked: false,
      timeControl: { initial: 60, increment: 0 },
    });
    await games.saveGameState(toFinish._id, {
      fen: games.START_FEN,
      clock: toFinish.clock,
      status: 'finished',
      result: { winner: 'white', reason: 'checkmate' },
    });

    const activeGames = await games.listActiveGames();
    const activeIds = activeGames.map((g) => g._id.toString());
    expect(activeIds).toContain(active._id.toString());
    expect(activeIds).not.toContain(toFinish._id.toString());
  });

  it('appends a move to the history and updates the fen', async () => {
    const game = await games.createGame({
      white: 'alice',
      black: 'bob',
      ranked: false,
      timeControl: { initial: 300, increment: 15 },
    });
    const nextFen = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
    const updated = await games.saveGameState(game._id, {
      fen: nextFen,
      clock: game.clock,
      moveEntry: { san: 'e4', from: 'e2', to: 'e4', fen: nextFen, at: new Date() },
    });
    expect(updated.fen).toBe(nextFen);
    expect(updated.moveHistory).toHaveLength(1);
    expect(updated.moveHistory[0].san).toBe('e4');
  });

  it('lists finished games for a user, most recent first', async () => {
    const g1 = await games.createGame({ white: 'gary', black: 'x', ranked: false, timeControl: { initial: 60, increment: 0 } });
    await games.saveGameState(g1._id, { fen: games.START_FEN, clock: g1.clock, status: 'finished', result: { winner: 'white', reason: 'checkmate' } });
    const g2 = await games.createGame({ white: 'x', black: 'gary', ranked: false, timeControl: { initial: 60, increment: 0 } });
    await games.saveGameState(g2._id, { fen: games.START_FEN, clock: g2.clock, status: 'finished', result: { winner: 'black', reason: 'checkmate' } });

    const history = await games.listFinishedGamesForUser('gary');
    expect(history).toHaveLength(2);
    expect(history[0].updatedAt.getTime()).toBeGreaterThanOrEqual(history[1].updatedAt.getTime());
  });
});
