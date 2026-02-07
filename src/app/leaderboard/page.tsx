'use client';

import { useEffect, useState } from 'react';
import LeaderboardRow from '@/components/LeaderboardRow';

interface LeaderEntry {
  rank: number;
  id: string;
  username: string;
  totalPnl: number;
  balance: number;
  tradeCount: number;
  marketsTraded: number;
}

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((res) => res.json())
      .then((data) => {
        setLeaders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Leaderboard</h1>
        <p className="mt-2 text-[var(--muted)]">Top traders ranked by performance</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-accent" />
        </div>
      ) : leaders.length === 0 ? (
        <div className="py-20 text-center text-[var(--muted)]">No traders yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--muted)]">
                <th className="py-3 pl-4 pr-2 font-medium">Rank</th>
                <th className="py-3 px-3 font-medium">Trader</th>
                <th className="py-3 px-3 text-right font-medium">Total P&L</th>
                <th className="py-3 px-3 text-right font-medium">Balance</th>
                <th className="py-3 px-3 text-right font-medium">Trades</th>
                <th className="py-3 px-3 text-right font-medium">Markets</th>
              </tr>
            </thead>
            <tbody>
              {leaders.map((leader) => (
                <LeaderboardRow
                  key={leader.id}
                  rank={leader.rank}
                  username={leader.username}
                  totalPnl={leader.totalPnl}
                  balance={leader.balance}
                  tradeCount={leader.tradeCount}
                  marketsTraded={leader.marketsTraded}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
