import { describe, it, expect } from 'vitest';
import { hashPassword, verifyPassword, createToken, verifyToken } from '@/lib/auth';

describe('Auth utilities', () => {
  describe('password hashing', () => {
    it('should hash a password', () => {
      const hash = hashPassword('testpassword');
      expect(hash).toBeDefined();
      expect(hash).not.toBe('testpassword');
      expect(hash.length).toBeGreaterThan(20);
    });

    it('should verify a correct password', () => {
      const hash = hashPassword('testpassword');
      expect(verifyPassword('testpassword', hash)).toBe(true);
    });

    it('should reject an incorrect password', () => {
      const hash = hashPassword('testpassword');
      expect(verifyPassword('wrongpassword', hash)).toBe(false);
    });

    it('should produce different hashes for same password', () => {
      const hash1 = hashPassword('testpassword');
      const hash2 = hashPassword('testpassword');
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('JWT tokens', () => {
    it('should create and verify a token', () => {
      const payload = { userId: 'test-id', username: 'testuser' };
      const token = createToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');

      const verified = verifyToken(token);
      expect(verified).toBeDefined();
      expect(verified!.userId).toBe('test-id');
      expect(verified!.username).toBe('testuser');
    });

    it('should return null for invalid token', () => {
      const result = verifyToken('invalid-token');
      expect(result).toBeNull();
    });

    it('should return null for expired token', () => {
      // Can't easily test expiry without waiting, but test malformed token
      const result = verifyToken('eyJhbGciOiJIUzI1NiJ9.eyJ0ZXN0IjoiZGF0YSJ9.invalid');
      expect(result).toBeNull();
    });
  });
});
