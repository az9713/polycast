import jwt from 'jsonwebtoken';
import { hashSync, compareSync } from 'bcryptjs';
import { cookies } from 'next/headers';
import { initializeDatabase } from './db';
import type { User } from './engine/types';

const JWT_SECRET = process.env.JWT_SECRET || 'polycast-dev-secret-change-in-production';
const COOKIE_NAME = 'polycast_token';

export interface JwtPayload {
  userId: string;
  username: string;
}

export function hashPassword(password: string): string {
  return hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
  return compareSync(password, hash);
}

export function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser(): Promise<(Omit<User, 'password_hash'>) | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const db = initializeDatabase();
  const user = db.prepare(
    'SELECT id, username, email, balance, created_at FROM users WHERE id = ?'
  ).get(payload.userId) as Omit<User, 'password_hash'> | undefined;

  return user || null;
}
