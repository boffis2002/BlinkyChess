const express = require('express');
const router = express.Router();

const users = require('../../src/models/users');
const asyncHandler = require('../lib/asyncHandler');
const publicUser = require('../lib/publicUser');

const getLeaderboard = asyncHandler(async (req, res) => {
  const board = await users.listLeaderboard();
  res.status(200).json(board.map(publicUser));
});

router.get(
  '/:username',
  asyncHandler(async (req, res) => {
    const user = await users.getUserByUsername(req.params.username);
    if (!user) return res.status(404).json({ error: 'user not found' });
    res.status(200).json(publicUser(user));
  })
);

module.exports = { router, getLeaderboard };
