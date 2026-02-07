'use client';

import { formatCurrency } from '@/lib/utils';

interface LeaderboardRowProps {
  rank: number;
  username: string;
  totalPnl: number;
  balance: number;
  tradeCount: number;
  marketsTraded: number;
}

export default function LeaderboardRow({
  rank,
  username,
  totalPnl,
  balance,
  tradeCount,
  marketsTraded,
}: LeaderboardRowProps) {
  const rankBadge = rank <= 3 ? (
    <span className={`flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
      rank === 1 ? 'bg-yellow-500/20 text-yellow-400' :
      rank === 2 ? 'bg-gray-400/20 text-gray-300' :
      'bg-orange-600/20 text-orange-400'
    }`}>
      {rank}
    </span>
  ) : (
    <span className="flex h-7 w-7 items-center justify-center text-sm text-[var(--muted)]">
      {rank}
    </span>
  );

  return (
    <tr className="border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-hover)]">
      <td className="py-3 pl-4 pr-2">{rankBadge}</td>
      <td className="py-3 px-3">
        <span className="font-medium text-foreground">{username}</span>
      </td>
      <td className="py-3 px-3 text-right">
        <span className={`font-mono text-sm font-medium ${
          totalPnl >= 0 ? 'text-yes' : 'text-no'
        }`}>
          {totalPnl >= 0 ? '+' : ''}{formatCurrency(totalPnl)}
        </span>
      </td>
      <td className="py-3 px-3 text-right">
        <span className="font-mono text-sm text-foreground">
          {formatCurrency(balance)}
        </span>
      </td>
      <td className="py-3 px-3 text-right text-sm text-[var(--muted)]">
        {tradeCount}
      </td>
      <td className="py-3 px-3 text-right text-sm text-[var(--muted)]">
        {marketsTraded}
      </td>
    </tr>
  );
}
