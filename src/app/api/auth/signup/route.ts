import { initializeDatabase } from '@/lib/db';
import { hashPassword, createToken, setAuthCookie } from '@/lib/auth';
import { v4 as uuid } from 'uuid';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, email, password } = body;

    // Validate username
    if (!username || typeof username !== 'string' || username.length < 3) {
      return NextResponse.json(
        { error: 'Username must be at least 3 characters long' },
        { status: 400 }
      );
    }

    // Validate email
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Validate password
    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Initialize database
    const db = initializeDatabase();

    // Check if username already exists
    const existingUsername = db.prepare(
      'SELECT id FROM users WHERE username = ?'
    ).get(username);

    if (existingUsername) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingEmail = db.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).get(email);

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const passwordHash = hashPassword(password);

    // Create user with $1000 starting balance
    const userId = uuid();
    const createdAt = new Date().toISOString();

    db.prepare(
      'INSERT INTO users (id, username, email, password_hash, balance, created_at) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(userId, username, email, passwordHash, 1000, createdAt);

    // Create JWT token
    const token = createToken({ userId, username });

    // Set auth cookie
    await setAuthCookie(token);

    // Return user info (without password hash)
    return NextResponse.json({
      user: {
        id: userId,
        username,
        email,
        balance: 1000,
        created_at: createdAt,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
