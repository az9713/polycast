'use client';

import Link from 'next/link';
import { formatVolume, formatDate } from '@/lib/utils';

interface MarketCardProps {
  id: string;
  title: string;
  category: string;
  yes_price: number;
  no_price: number;
  volume: number;
  resolution_date: string;
  status: string;
}

const CATEGORY_STYLES: Record<string, string> = {
  crypto: 'bg-orange-500/10 text-orange-400',
  politics: 'bg-blue-500/10 text-blue-400',
  sports: 'bg-emerald-500/10 text-emerald-400',
  ai: 'bg-purple-500/10 text-purple-400',
  entertainment: 'bg-pink-500/10 text-pink-400',
};

export default function MarketCard({
  id,
  title,
  category,
  yes_price,
  no_price,
  volume,
  resolution_date,
  status: _status,
}: MarketCardProps) {
  const yesPercent = Math.round(yes_price * 100);
  const noPercent = Math.round(no_price * 100);
  const categoryStyle = CATEGORY_STYLES[category.toLowerCase()] || 'bg-gray-500/10 text-gray-400';

  return (
    <Link href={`/markets/${id}`}>
      <div className="group relative rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:bg-[var(--surface-hover)] hover:shadow-lg hover:shadow-accent/5">
        {/* Category Badge */}
        <div className="absolute right-4 top-4">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${categoryStyle}`}>
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-4 pr-20 text-lg font-semibold text-foreground line-clamp-2">
          {title}
        </h3>

        {/* Price Bars */}
        <div className="mb-4 space-y-2">
          {/* YES Bar */}
          <div className="flex items-center gap-3">
            <span className="w-8 text-sm font-medium text-emerald-400">YES</span>
            <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-emerald-500/10">
              <div
                className="h-full bg-emerald-500/30 transition-all duration-300"
                style={{ width: `${yesPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-emerald-400">
                {yesPercent}%
              </span>
            </div>
          </div>

          {/* NO Bar */}
          <div className="flex items-center gap-3">
            <span className="w-8 text-sm font-medium text-red-400">NO</span>
            <div className="relative h-6 flex-1 overflow-hidden rounded-md bg-red-500/10">
              <div
                className="h-full bg-red-500/30 transition-all duration-300"
                style={{ width: `${noPercent}%` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-red-400">
                {noPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-sm text-[var(--muted)]">
          <div className="flex items-center gap-1">
            <span className="font-medium">Volume:</span>
            <span className="text-foreground">{formatVolume(volume)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Closes:</span>
            <span className="text-foreground">{formatDate(resolution_date)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
