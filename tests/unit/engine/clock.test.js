import { describe, it, expect } from 'vitest';
const { createClock, computeRemaining, isExpired, applyMoveTime } = require('../../../src/engine/clock');

describe('clock — server-authoritative time (bug #4: was only tracked client-side)', () => {
  it('starts both sides at the initial time', () => {
    const clock = createClock(300, 1000);
    expect(computeRemaining(clock, 'white', 1000)).toBe(300);
    expect(computeRemaining(clock, 'black', 1000)).toBe(300);
  });

  it('computeRemaining reflects elapsed time without mutating anything', () => {
    const clock = createClock(300, 0);
    expect(computeRemaining(clock, 'white', 10_000)).toBe(290);
    // Calling it again with the same "now" gives the same answer — read-only.
    expect(computeRemaining(clock, 'white', 10_000)).toBe(290);
    expect(clock.white.remaining).toBe(300);
  });

  it('never reports negative remaining time', () => {
    const clock = createClock(10, 0);
    expect(computeRemaining(clock, 'white', 999_999)).toBe(0);
  });

  it('isExpired is true once remaining time hits zero', () => {
    const clock = createClock(10, 0);
    expect(isExpired(clock, 'white', 5_000)).toBe(false);
    expect(isExpired(clock, 'white', 10_000)).toBe(true);
    expect(isExpired(clock, 'white', 15_000)).toBe(true);
  });

  it('applyMoveTime persists the deduction and adds the increment', () => {
    const clock = createClock(300, 0);
    const updated = applyMoveTime(clock, 'white', 20_000, 15);
    // 300 - 20s elapsed + 15s increment
    expect(updated.white.remaining).toBe(295);
    expect(updated.black.remaining).toBe(300); // untouched
    expect(updated.turnStartedAt).toBe(20_000);
  });

  it('applyMoveTime does not go below zero before adding the increment', () => {
    const clock = createClock(5, 0);
    const updated = applyMoveTime(clock, 'white', 999_999, 15);
    expect(updated.white.remaining).toBe(15); // 0 + 15, not negative + 15
  });
});
