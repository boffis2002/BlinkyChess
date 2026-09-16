import { describe, it, expect } from 'vitest';
const { expectedScore, calculateEloChange } = require('../../../src/engine/elo');

describe('elo', () => {
  it('gives equal-rated players a 50% expected score', () => {
    expect(expectedScore(1200, 1200)).toBeCloseTo(0.5, 5);
  });

  it('gives the higher-rated player an expected score above 50%', () => {
    expect(expectedScore(1400, 1200)).toBeGreaterThan(0.5);
    expect(expectedScore(1200, 1400)).toBeLessThan(0.5);
  });

  it('a decisive win between equal ratings moves both by the same amount, in opposite directions', () => {
    const { deltaA, deltaB } = calculateEloChange(1200, 1200, 'A');
    expect(deltaA).toBeGreaterThan(0);
    expect(deltaB).toBeLessThan(0);
    expect(deltaA).toBe(-deltaB);
  });

  it('an upset (lower rated beats higher rated) gains more points than an expected win', () => {
    const upset = calculateEloChange(1200, 1600, 'A');
    const expectedWin = calculateEloChange(1600, 1200, 'A');
    expect(upset.deltaA).toBeGreaterThan(expectedWin.deltaA);
  });

  it('a draw between equal ratings changes nothing', () => {
    const { deltaA, deltaB } = calculateEloChange(1200, 1200, 'draw');
    expect(deltaA).toBe(0);
    expect(deltaB).toBe(0);
  });

  it('a draw between unequal ratings pulls them toward each other', () => {
    const { deltaA, deltaB } = calculateEloChange(1200, 1600, 'draw');
    expect(deltaA).toBeGreaterThan(0); // lower-rated gains for drawing up
    expect(deltaB).toBeLessThan(0); // higher-rated loses for drawing down
  });
});
