'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PositionRow from '@/components/PositionRow';
import { formatCurrency } from '@/lib/utils';

interface PortfolioData {
  balance: number;
  positions: Array<{
    id: string;
    market_id: string;
    market_title: string;
    side: 'yes' | 'no';
    shares: number;
    avg_price: number;
    current_price: number;
    unrealized_pnl: number;
    realized_pnl: number;
    market_status: string;
  }>;
  openOrders: Array<{
    id: string;
    market_id: string;
    market_title: string;
    side: string;
    price: number;
    quantity: number;
    filled_quantity: number;
    status: string;
  }>;
  totalUnrealizedPnl: number;
  totalRealizedPnl: number;
}

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

  useEffect(() => {
    fetch('/api/portfolio')
      .then((res) => {
        if (res.status === 401) {
          setUnauthorized(true);
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then((d) => {
        if (d) setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-accent" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold text-foreground">Sign in to view your portfolio</h2>
        <Link
          href="/auth/login"
          className="mt-4 inline-block rounded-lg bg-accent px-6 py-2 font-medium text-white hover:bg-accent/90 transition-colors"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Portfolio</h1>
        <p className="mt-2 text-[var(--muted)]">Your positions and performance</p>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--muted)]">Balance</p>
          <p className="mt-1 text-2xl font-bold text-foreground">{formatCurrency(data.balance)}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--muted)]">Unrealized P&L</p>
          <p className={`mt-1 text-2xl font-bold ${data.totalUnrealizedPnl >= 0 ? 'text-yes' : 'text-no'}`}>
            {data.totalUnrealizedPnl >= 0 ? '+' : ''}{formatCurrency(data.totalUnrealizedPnl)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <p className="text-sm text-[var(--muted)]">Realized P&L</p>
          <p className={`mt-1 text-2xl font-bold ${data.totalRealizedPnl >= 0 ? 'text-yes' : 'text-no'}`}>
            {data.totalRealizedPnl >= 0 ? '+' : ''}{formatCurrency(data.totalRealizedPnl)}
          </p>
        </div>
      </div>

      {/* Positions */}
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-semibold text-foreground">Open Positions</h2>
        {data.positions.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--muted)]">
            No open positions. Start trading to build your portfolio.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--muted)]">
                  <th className="py-3 pl-4 pr-3 font-medium">Market</th>
                  <th className="py-3 px-3 font-medium">Side</th>
                  <th className="py-3 px-3 text-right font-medium">Shares</th>
                  <th className="py-3 px-3 text-right font-medium">Avg Price</th>
                  <th className="py-3 px-3 text-right font-medium">Current</th>
                  <th className="py-3 px-3 text-right font-medium">Unreal. P&L</th>
                  <th className="py-3 px-3 text-right font-medium">Real. P&L</th>
                </tr>
              </thead>
              <tbody>
                {data.positions.map((pos) => (
                  <PositionRow
                    key={pos.id}
                    marketId={pos.market_id}
                    marketTitle={pos.market_title}
                    side={pos.side}
                    shares={pos.shares}
                    avgPrice={pos.avg_price}
                    currentPrice={pos.current_price}
                    unrealizedPnl={pos.unrealized_pnl}
                    realizedPnl={pos.realized_pnl}
                    marketStatus={pos.market_status}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Open Orders */}
      {data.openOrders.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Open Orders</h2>
          <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[var(--surface)]">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border)] text-xs uppercase tracking-wider text-[var(--muted)]">
                  <th className="py-3 pl-4 pr-3 font-medium">Market</th>
                  <th className="py-3 px-3 font-medium">Side</th>
                  <th className="py-3 px-3 text-right font-medium">Price</th>
                  <th className="py-3 px-3 text-right font-medium">Qty</th>
                  <th className="py-3 px-3 text-right font-medium">Filled</th>
                  <th className="py-3 px-3 text-right font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.openOrders.map((order) => (
                  <tr key={order.id} className="border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-hover)]">
                    <td className="py-3 pl-4 pr-3">
                      <Link href={`/markets/${order.market_id}`} className="text-foreground hover:text-accent transition-colors">
                        {order.market_title}
                      </Link>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${
                        order.side === 'yes' ? 'bg-yes/10 text-yes' : 'bg-no/10 text-no'
                      }`}>
                        {order.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm text-foreground">
                      {Math.round(order.price * 100)}¢
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm text-foreground">
                      {order.quantity}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-sm text-[var(--muted)]">
                      {order.filled_quantity}
                    </td>
                    <td className="py-3 px-3 text-right text-xs text-[var(--muted)]">
                      {order.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
