import { initializeDatabase } from '@/lib/db';
import { verifyPassword, createToken, setAuthCookie } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@/lib/engine/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate inputs
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Initialize database
    const db = initializeDatabase();

    // Find user by email
    const user = db.prepare(
      'SELECT id, username, email, password_hash, balance, created_at FROM users WHERE email = ?'
    ).get(email) as User | undefined;

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = createToken({ userId: user.id, username: user.username });

    // Set auth cookie
    await setAuthCookie(token);

    // Return user info (without password hash)
    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        balance: user.balance,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
