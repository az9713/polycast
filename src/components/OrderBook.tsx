'use client';

interface OrderBookProps {
  yesBids: Array<{ price: number; quantity: number; filled_quantity: number }>;
  noBids: Array<{ price: number; quantity: number; filled_quantity: number }>;
}

export default function OrderBook({ yesBids, noBids }: OrderBookProps) {
  // Calculate maximum quantity for depth visualization
  const maxYesQuantity = Math.max(
    ...yesBids.map((bid) => bid.quantity - bid.filled_quantity),
    1
  );
  const maxNoQuantity = Math.max(
    ...noBids.map((bid) => bid.quantity - bid.filled_quantity),
    1
  );

  // Show only top 8 levels per side
  const displayYesBids = yesBids.slice(0, 8);
  const displayNoBids = noBids.slice(0, 8);

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Order Book</h3>

      <div className="grid grid-cols-2 gap-4">
        {/* YES Bids Column */}
        <div>
          <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-2">
            <h4 className="text-sm font-medium text-yes">YES Bids</h4>
            <div className="flex gap-4 text-xs text-[var(--muted)]">
              <span>Price</span>
              <span>Size</span>
            </div>
          </div>

          {displayYesBids.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--muted)]">
              No orders
            </div>
          ) : (
            <div className="space-y-1">
              {displayYesBids.map((bid, index) => {
                const remaining = bid.quantity - bid.filled_quantity;
                const depthPercent = (remaining / maxYesQuantity) * 100;
                const priceDisplay = `${Math.round(bid.price * 100)}¢`;

                return (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded bg-yes/5 px-2 py-1.5"
                  >
                    {/* Depth bar */}
                    <div
                      className="absolute inset-y-0 left-0 bg-yes/10"
                      style={{ width: `${depthPercent}%` }}
                    />

                    {/* Content */}
                    <div className="relative flex items-center justify-between text-sm">
                      <span className="font-medium text-yes">
                        {priceDisplay}
                      </span>
                      <span className="text-foreground">{remaining}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* NO Bids Column */}
        <div>
          <div className="mb-3 flex items-center justify-between border-b border-[var(--border)] pb-2">
            <h4 className="text-sm font-medium text-no">NO Bids</h4>
            <div className="flex gap-4 text-xs text-[var(--muted)]">
              <span>Price</span>
              <span>Size</span>
            </div>
          </div>

          {displayNoBids.length === 0 ? (
            <div className="py-8 text-center text-sm text-[var(--muted)]">
              No orders
            </div>
          ) : (
            <div className="space-y-1">
              {displayNoBids.map((bid, index) => {
                const remaining = bid.quantity - bid.filled_quantity;
                const depthPercent = (remaining / maxNoQuantity) * 100;
                const priceDisplay = `${Math.round(bid.price * 100)}¢`;

                return (
                  <div
                    key={index}
                    className="relative overflow-hidden rounded bg-no/5 px-2 py-1.5"
                  >
                    {/* Depth bar */}
                    <div
                      className="absolute inset-y-0 left-0 bg-no/10"
                      style={{ width: `${depthPercent}%` }}
                    />

                    {/* Content */}
                    <div className="relative flex items-center justify-between text-sm">
                      <span className="font-medium text-no">
                        {priceDisplay}
                      </span>
                      <span className="text-foreground">{remaining}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
