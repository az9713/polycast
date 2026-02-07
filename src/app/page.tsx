'use client';

import { useEffect, useState } from 'react';
import MarketCard from '@/components/MarketCard';
import CategoryFilter from '@/components/CategoryFilter';
import type { Market } from '@/lib/engine/types';

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = category !== 'all' ? `?category=${category}` : '';
    fetch(`/api/markets${params}`)
      .then((res) => res.json())
      .then((data) => {
        setMarkets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Prediction Markets
        </h1>
        <p className="mt-2 text-[var(--muted)]">
          Trade on the outcomes of real-world events
        </p>
      </div>

      <CategoryFilter selected={category} onChange={setCategory} />

      {loading ? (
        <div className="mt-12 flex justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--border)] border-t-accent" />
        </div>
      ) : markets.length === 0 ? (
        <div className="mt-12 text-center text-[var(--muted)]">
          No markets found in this category.
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard
              key={market.id}
              id={market.id}
              title={market.title}
              category={market.category}
              yes_price={market.yes_price}
              no_price={market.no_price}
              volume={market.volume}
              resolution_date={market.resolution_date}
              status={market.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}
