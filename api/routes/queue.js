const express = require('express');
const router = express.Router();

const queue = require('../../src/models/queue');
const requireAuth = require('../middleware/requireAuth');
const asyncHandler = require('../lib/asyncHandler');
const { isPositiveInt } = require('../lib/validate');

function isValidTimeControl(timeControl) {
  return (
    timeControl &&
    isPositiveInt(timeControl.initial, { min: 30, max: 3600 }) &&
    isPositiveInt(timeControl.increment, { min: 0, max: 60 })
  );
}

router.post(
  '/join',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { timeControl, ranked } = req.body || {};
    if (!isValidTimeControl(timeControl) || typeof ranked !== 'boolean') {
      return res.status(400).json({ error: 'invalid timeControl or ranked flag' });
    }

    const result = await queue.joinQueue({ username: req.user.username, timeControl, ranked });
    if (result.matched) {
      return res.status(200).json({ matched: true, gameId: result.game._id });
    }
    res.status(200).json({ matched: false, queueEntryId: result.queueEntryId });
  })
);

router.get(
  '/status',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { queueEntryId } = req.query;
    if (typeof queueEntryId !== 'string' || !queueEntryId) {
      return res.status(400).json({ error: 'queueEntryId is required' });
    }
    const result = await queue.pollQueue(queueEntryId);
    res.status(200).json(result);
  })
);

router.delete(
  '/leave',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { queueEntryId } = req.body || {};
    if (typeof queueEntryId !== 'string' || !queueEntryId) {
      return res.status(400).json({ error: 'queueEntryId is required' });
    }
    await queue.leaveQueue(queueEntryId);
    res.status(204).end();
  })
);

module.exports = router;
