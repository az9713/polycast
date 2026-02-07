'use client';

import Link from 'next/link';
import { formatCurrency, formatPercent } from '@/lib/utils';

interface PositionRowProps {
  marketId: string;
  marketTitle: string;
  side: 'yes' | 'no';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
  realizedPnl: number;
  marketStatus: string;
}

export default function PositionRow({
  marketId,
  marketTitle,
  side,
  shares,
  avgPrice,
  currentPrice,
  unrealizedPnl,
  realizedPnl,
  marketStatus,
}: PositionRowProps) {
  return (
    <tr className="border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-hover)]">
      <td className="py-3 pl-4 pr-3">
        <Link
          href={`/markets/${marketId}`}
          className="font-medium text-foreground hover:text-accent transition-colors line-clamp-1"
        >
          {marketTitle}
        </Link>
      </td>
      <td className="py-3 px-3">
        <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
          side === 'yes'
            ? 'bg-yes/10 text-yes'
            : 'bg-no/10 text-no'
        }`}>
          {side.toUpperCase()}
        </span>
      </td>
      <td className="py-3 px-3 text-right font-mono text-sm text-foreground">
        {shares}
      </td>
      <td className="py-3 px-3 text-right font-mono text-sm text-[var(--muted)]">
        {formatPercent(avgPrice)}
      </td>
      <td className="py-3 px-3 text-right font-mono text-sm text-foreground">
        {marketStatus === 'open' ? formatPercent(currentPrice) : (
          <span className="text-[var(--muted)]">
            {marketStatus === 'resolved_yes' ? (side === 'yes' ? '100%' : '0%') :
             marketStatus === 'resolved_no' ? (side === 'no' ? '100%' : '0%') : '-'}
          </span>
        )}
      </td>
      <td className="py-3 px-3 text-right">
        <span className={`font-mono text-sm font-medium ${
          unrealizedPnl >= 0 ? 'text-yes' : 'text-no'
        }`}>
          {unrealizedPnl >= 0 ? '+' : ''}{formatCurrency(unrealizedPnl)}
        </span>
      </td>
      <td className="py-3 px-3 text-right">
        <span className={`font-mono text-sm ${
          realizedPnl >= 0 ? 'text-yes' : 'text-no'
        }`}>
          {realizedPnl >= 0 ? '+' : ''}{formatCurrency(realizedPnl)}
        </span>
      </td>
    </tr>
  );
}
