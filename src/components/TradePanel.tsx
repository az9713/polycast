'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TradePanelProps {
  marketId: string;
  yesPrice: number;
  noPrice: number;
}

type Side = 'yes' | 'no';

export default function TradePanel({
  marketId,
  yesPrice,
  noPrice,
}: TradePanelProps) {
  const [side, setSide] = useState<Side>('yes');
  const [price, setPrice] = useState<string>(yesPrice.toFixed(2));
  const [shares, setShares] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => setIsLoggedIn(res.ok))
      .catch(() => setIsLoggedIn(false));
  }, []);

  // Update price when side changes
  const handleSideChange = (newSide: Side) => {
    setSide(newSide);
    setPrice(newSide === 'yes' ? yesPrice.toFixed(2) : noPrice.toFixed(2));
  };

  // Calculate costs and profits
  const priceNum = parseFloat(price) || 0;
  const sharesNum = parseFloat(shares) || 0;
  const totalCost = priceNum * sharesNum;
  const potentialPayout = sharesNum * 1.0;
  const potentialProfit = potentialPayout - totalCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/markets/${marketId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          side,
          type: 'limit',
          price: priceNum,
          quantity: sharesNum,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to place order');
      }

      // Reset form on success
      setShares('');
      setPrice(side === 'yes' ? yesPrice.toFixed(2) : noPrice.toFixed(2));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          Place Order
        </h3>
        <Link
          href="/auth/login"
          className="block w-full rounded-lg bg-[var(--accent)] py-3 text-center font-medium text-white transition-colors hover:bg-[var(--accent)]/90"
        >
          Log in to trade
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">
        Place Order
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Side Toggle */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSideChange('yes')}
            className={`flex-1 rounded-lg border py-2.5 font-medium transition-all ${
              side === 'yes'
                ? 'border-yes bg-yes text-white'
                : 'border-[var(--border)] bg-transparent text-[var(--muted)] hover:border-yes/50'
            }`}
          >
            Buy Yes
          </button>
          <button
            type="button"
            onClick={() => handleSideChange('no')}
            className={`flex-1 rounded-lg border py-2.5 font-medium transition-all ${
              side === 'no'
                ? 'border-no bg-no text-white'
                : 'border-[var(--border)] bg-transparent text-[var(--muted)] hover:border-no/50'
            }`}
          >
            Buy No
          </button>
        </div>

        {/* Price Input */}
        <div>
          <label
            htmlFor="price"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
            min="0.01"
            max="0.99"
            required
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-foreground transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>

        {/* Shares Input */}
        <div>
          <label
            htmlFor="shares"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Shares
          </label>
          <input
            type="number"
            id="shares"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            min="1"
            step="1"
            required
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-foreground transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>

        {/* Cost and Profit Display */}
        {sharesNum > 0 && priceNum > 0 && (
          <div className="space-y-2 rounded-lg bg-[var(--background)] p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Total Cost:</span>
              <span className="font-semibold text-foreground">
                ${totalCost.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--muted)]">Potential Payout:</span>
              <span className="font-semibold text-foreground">
                ${potentialPayout.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-2">
              <span className="text-[var(--muted)]">Potential Profit:</span>
              <span
                className={`font-semibold ${
                  potentialProfit > 0 ? 'text-yes' : 'text-[var(--muted)]'
                }`}
              >
                ${potentialProfit.toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !shares || !price}
          className={`w-full rounded-lg py-3 font-medium text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
            side === 'yes'
              ? 'bg-yes hover:bg-yes/90'
              : 'bg-no hover:bg-no/90'
          }`}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </button>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="rounded-lg bg-yes/10 border border-yes/20 px-4 py-3 text-sm text-yes">
            Order placed successfully!
          </div>
        )}
      </form>
    </div>
  );
}
