const express = require('express');
const router = express.Router();

const games = require('../../src/models/games');
const gameService = require('../../src/services/gameService');
const requireAuth = require('../middleware/requireAuth');
const asyncHandler = require('../lib/asyncHandler');

const SQUARE_RE = /^[a-h][1-8]$/;
const PROMOTION_PIECES = ['q', 'r', 'b', 'n'];

function isValidMovePayload({ from, to, promotion }) {
  if (!SQUARE_RE.test(from) || !SQUARE_RE.test(to)) return false;
  if (promotion !== undefined && !PROMOTION_PIECES.includes(promotion)) return false;
  return true;
}

router.get(
  '/history/:username',
  asyncHandler(async (req, res) => {
    const history = await games.listFinishedGamesForUser(req.params.username);
    res.status(200).json(history);
  })
);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const active = await games.listActiveGames();
    res.status(200).json(active.map((g) => ({ _id: g._id, players: g.players, ranked: g.ranked, timeControl: g.timeControl })));
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const view = await gameService.getGameView(req.params.id);
    if (!view) return res.status(404).json({ error: 'game not found' });
    res.status(200).json(view);
  })
);

router.get(
  '/:id/history',
  asyncHandler(async (req, res) => {
    const game = await games.getGameById(req.params.id);
    if (!game) return res.status(404).json({ error: 'game not found' });
    res.status(200).json(game.moveHistory);
  })
);

router.post(
  '/:id/moves',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { from, to, promotion } = req.body || {};
    if (!isValidMovePayload({ from, to, promotion })) {
      return res.status(400).json({ error: 'invalid move payload' });
    }

    const result = await gameService.submitMove(req.params.id, req.user.username, { from, to, promotion });
    if (!result.ok) {
      return res.status(result.status).json({ error: result.error, ...(result.game ? { game: result.game } : {}) });
    }
    res.status(200).json(result.game);
  })
);

module.exports = router;
