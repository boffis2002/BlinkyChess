const games = require('../models/games');
const users = require('../models/users');
const chessEngine = require('../engine/chessEngine');
const clock = require('../engine/clock');
const elo = require('../engine/elo');

function colorOf(game, username) {
  if (game.players.white === username) return 'white';
  if (game.players.black === username) return 'black';
  return null;
}

function colorLetterToName(letter) {
  return letter === 'w' ? 'white' : 'black';
}

// Persists the end of a game: final position/status, plus ELO (if ranked) and
// win/loss/draw stats for both players. The one place this happens, called
// whether the game ended by checkmate/draw (submitMove) or by timeout
// (checkAndHandleTimeout) — so results are always recorded consistently.
async function finishGame(game, { reason, winnerColor }) {
  const updated = await games.saveGameState(game._id, {
    fen: game.fen,
    clock: game.clock,
    status: 'finished',
    result: { winner: winnerColor, reason },
  });

  const whiteUser = await users.getUserByUsername(game.players.white);
  const blackUser = await users.getUserByUsername(game.players.black);

  let eloResult = { deltaA: 0, deltaB: 0 };
  if (game.ranked && whiteUser && blackUser) {
    const outcome = winnerColor === 'white' ? 'A' : winnerColor === 'black' ? 'B' : 'draw';
    eloResult = elo.calculateEloChange(whiteUser.elo, blackUser.elo, outcome);
  }

  const whiteOutcome = winnerColor === 'white' ? 'win' : winnerColor === 'black' ? 'loss' : 'draw';
  const blackOutcome = winnerColor === 'black' ? 'win' : winnerColor === 'white' ? 'loss' : 'draw';

  if (whiteUser) await users.recordGameResult(game.players.white, { outcome: whiteOutcome, eloDelta: eloResult.deltaA });
  if (blackUser) await users.recordGameResult(game.players.black, { outcome: blackOutcome, eloDelta: eloResult.deltaB });

  return updated;
}

// Called before doing anything else with an active game: if the side to move
// has run out of time, finalize the game as a timeout right here — this is
// what makes a timeout get recorded even if the losing player's tab is
// closed, since any GET (a spectator polling, the opponent polling) triggers it.
async function checkAndHandleTimeout(game, now = Date.now()) {
  if (game.status !== 'active') return game;
  const activeColor = colorLetterToName(chessEngine.gameStatus(game.fen).turn);
  if (clock.isExpired(game.clock, activeColor, now)) {
    const winnerColor = activeColor === 'white' ? 'black' : 'white';
    return finishGame(game, { reason: 'timeout', winnerColor });
  }
  return game;
}

async function getGameView(id) {
  let game = await games.getGameById(id);
  if (!game) return null;
  game = await checkAndHandleTimeout(game);

  const now = Date.now();
  const status = chessEngine.gameStatus(game.fen);
  const activeColor = colorLetterToName(status.turn);
  return {
    ...game,
    turn: status.turn,
    isCheck: status.isCheck,
    liveClock: {
      white: activeColor === 'white' ? clock.computeRemaining(game.clock, 'white', now) : game.clock.white.remaining,
      black: activeColor === 'black' ? clock.computeRemaining(game.clock, 'black', now) : game.clock.black.remaining,
    },
  };
}

async function submitMove(id, username, movePayload) {
  const game = await games.getGameById(id);
  if (!game) return { ok: false, status: 404, error: 'game not found' };
  if (game.status !== 'active') return { ok: false, status: 409, error: 'game already finished' };

  const color = colorOf(game, username);
  if (!color) return { ok: false, status: 403, error: 'not a player in this game' };

  const activeColor = colorLetterToName(chessEngine.gameStatus(game.fen).turn);
  if (activeColor !== color) return { ok: false, status: 403, error: 'not your turn' };

  const now = Date.now();
  if (clock.isExpired(game.clock, activeColor, now)) {
    const winnerColor = activeColor === 'white' ? 'black' : 'white';
    const finished = await finishGame(game, { reason: 'timeout', winnerColor });
    return { ok: false, status: 409, error: 'time expired', game: finished };
  }

  const moveResult = chessEngine.applyMove(game.fen, movePayload);
  if (!moveResult.ok) {
    return { ok: false, status: 400, error: moveResult.error };
  }

  const increment = game.timeControl.increment || 0;
  const newClock = clock.applyMoveTime(game.clock, activeColor, now, increment);
  const moveEntry = {
    san: moveResult.san,
    from: movePayload.from,
    to: movePayload.to,
    promotion: movePayload.promotion || null,
    fen: moveResult.fen,
    at: new Date(now),
  };

  let updated = await games.saveGameState(id, { fen: moveResult.fen, clock: newClock, moveEntry });
  if (moveResult.over) {
    updated = await finishGame(updated, { reason: moveResult.reason, winnerColor: moveResult.winner });
  }

  return { ok: true, status: 200, game: updated };
}

module.exports = { getGameView, submitMove, finishGame, checkAndHandleTimeout };
