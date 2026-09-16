import { describe, it, expect } from 'vitest';
const { hashPassword, verifyPassword } = require('../../../src/auth/password');

describe('password hashing (replaces plaintext comparison)', () => {
  it('never stores the plaintext password in the hash', async () => {
    const hash = await hashPassword('correct horse battery staple');
    expect(hash).not.toContain('correct horse battery staple');
  });

  it('verifies a correct password', async () => {
    const hash = await hashPassword('hunter2');
    await expect(verifyPassword('hunter2', hash)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('hunter2');
    await expect(verifyPassword('wrong-password', hash)).resolves.toBe(false);
  });

  it('produces a different hash each time (salted)', async () => {
    const hash1 = await hashPassword('same-password');
    const hash2 = await hashPassword('same-password');
    expect(hash1).not.toBe(hash2);
  });
});
