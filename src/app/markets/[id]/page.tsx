'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import OrderBook from '@/components/OrderBook';
import TradePanel from '@/components/TradePanel';
import PriceChart from '@/components/PriceChart';
import { formatVolume, formatDate, CATEGORY_LABELS } from '@/lib/utils';

interface MarketDetail {
  market: {
    id: string;
    title: string;
    description: string;
    category: string;
    resolution_source: string;
    resolution_date: string;
    status: string;
    yes_price: number;
    no_price: number;
    volume: number;
  };
  orderBook: {
    yesBids: Array<{ price: number; quantity: number; filled_quantity: number }>;
    noBids: Array<{ price: number; quantity: number; filled_quantity: number }>;
  };
  recentTrades: Array<{
    id: string;
    price: number;
    quantity: number;
    created_at: string;
  }>;
}

export default function MarketDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<MarketDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/markets/${id}`)
      .then((res) => res.json())
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-accent" />
      </div>
    );
  }

  if (!data?.market) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold text-foreground">Market not found</h2>
        <Link href="/" className="mt-4 inline-block text-accent hover:underline">
          Back to markets
        </Link>
      </div>
    );
  }

  const { market, orderBook, recentTrades } = data;

  const statusColors: Record<string, string> = {
    open: 'bg-yes/10 text-yes',
    resolved_yes: 'bg-yes/10 text-yes',
    resolved_no: 'bg-no/10 text-no',
    cancelled: 'bg-[var(--muted)]/10 text-[var(--muted)]',
  };

  const statusLabels: Record<string, string> = {
    open: 'Open',
    resolved_yes: 'Resolved Yes',
    resolved_no: 'Resolved No',
    cancelled: 'Cancelled',
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-foreground transition-colors">Markets</Link>
        <span>/</span>
        <span className="text-foreground">{market.title}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {market.title}
          </h1>
          <span className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-medium ${statusColors[market.status] || ''}`}>
            {statusLabels[market.status] || market.status}
          </span>
        </div>
        <p className="mt-3 text-[var(--muted)] leading-relaxed">
          {market.description}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[var(--muted)]">
          <span>Category: <span className="text-foreground">{CATEGORY_LABELS[market.category] || market.category}</span></span>
          <span className="text-[var(--border)]">|</span>
          <span>Source: <span className="text-foreground">{market.resolution_source}</span></span>
          <span className="text-[var(--border)]">|</span>
          <span>Resolves: <span className="text-foreground">{formatDate(market.resolution_date)}</span></span>
          <span className="text-[var(--border)]">|</span>
          <span>Volume: <span className="text-foreground">{formatVolume(market.volume)}</span></span>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Order Book + Price Chart */}
        <div className="space-y-6 lg:col-span-2">
          <PriceChart yesPrice={market.yes_price} title="Current Probability" />

          <OrderBook
            yesBids={orderBook.yesBids}
            noBids={orderBook.noBids}
          />

          {/* Recent Trades */}
          {recentTrades.length > 0 && (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
              <h3 className="mb-3 text-sm font-semibold text-foreground">Recent Trades</h3>
              <div className="space-y-1">
                {recentTrades.slice(0, 10).map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between py-1.5 text-sm">
                    <span className="font-mono text-foreground">
                      {Math.round(trade.price * 100)}¢
                    </span>
                    <span className="text-[var(--muted)]">
                      {trade.quantity} shares
                    </span>
                    <span className="text-xs text-[var(--muted)]">
                      {new Date(trade.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: Trade Panel */}
        <div>
          {market.status === 'open' ? (
            <TradePanel
              marketId={market.id}
              yesPrice={market.yes_price}
              noPrice={market.no_price}
            />
          ) : (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
              <p className="text-[var(--muted)]">
                This market is {statusLabels[market.status]?.toLowerCase() || 'closed'} and no longer accepting trades.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
