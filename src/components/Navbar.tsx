'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: string;
  username: string;
  balance: number;
}

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Markets' },
    { href: '/leaderboard', label: 'Leaderboard' },
    ...(user ? [{ href: '/portfolio', label: 'Portfolio' }] : []),
  ];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/';
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
              <span className="text-sm font-bold text-white">P</span>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Polycast
            </span>
          </Link>

          <div className="hidden items-center gap-1 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-[var(--surface)] text-foreground'
                    : 'text-[var(--muted)] hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden text-sm text-[var(--muted)] sm:block">
                <span className="text-foreground font-medium">${user.balance.toFixed(2)}</span>
              </span>
              <span className="text-sm text-foreground font-medium">{user.username}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:text-foreground"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-1.5 text-sm text-[var(--muted)] transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
