import { describe, it, expect, beforeAll } from 'vitest';

describe('jwt', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret-do-not-use-in-production';
  });

  it('round-trips a payload through sign and verify', () => {
    const { signToken, verifyToken } = require('../../../src/auth/jwt');
    const token = signToken({ username: 'sergio' });
    const decoded = verifyToken(token);
    expect(decoded.username).toBe('sergio');
  });

  it('returns null for a tampered token', () => {
    const { signToken, verifyToken } = require('../../../src/auth/jwt');
    const token = signToken({ username: 'sergio' });
    const tampered = token.slice(0, -2) + 'xx';
    expect(verifyToken(tampered)).toBeNull();
  });

  it('returns null for a token signed with a different secret', () => {
    const jwt = require('jsonwebtoken');
    const { verifyToken } = require('../../../src/auth/jwt');
    const foreignToken = jwt.sign({ username: 'sergio' }, 'a-different-secret');
    expect(verifyToken(foreignToken)).toBeNull();
  });

  it('returns null for garbage input', () => {
    const { verifyToken } = require('../../../src/auth/jwt');
    expect(verifyToken('not-a-token')).toBeNull();
  });
});
