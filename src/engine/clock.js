function createClock(initialSeconds, now = Date.now()) {
  return {
    white: { remaining: initialSeconds },
    black: { remaining: initialSeconds },
    turnStartedAt: now,
  };
}

function elapsedSeconds(clock, now) {
  return Math.max(0, (now - clock.turnStartedAt) / 1000);
}

// Read-only: how much time colorToMove actually has right now, without persisting anything.
function computeRemaining(clock, colorToMove, now = Date.now()) {
  return Math.max(0, clock[colorToMove].remaining - elapsedSeconds(clock, now));
}

function isExpired(clock, colorToMove, now = Date.now()) {
  return computeRemaining(clock, colorToMove, now) <= 0;
}

// The only function that persists a time change: called when the side to move
// actually makes a move (or when a poll observes the clock has hit zero).
function applyMoveTime(clock, colorJustMoved, now = Date.now(), increment = 0) {
  const remaining = Math.max(0, clock[colorJustMoved].remaining - elapsedSeconds(clock, now)) + increment;
  return {
    ...clock,
    [colorJustMoved]: { remaining },
    turnStartedAt: now,
  };
}

module.exports = { createClock, computeRemaining, isExpired, applyMoveTime };
