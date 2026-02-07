'use client';

interface PriceChartProps {
  yesPrice: number;
  title?: string;
}

export default function PriceChart({ yesPrice, title }: PriceChartProps) {
  const yesPercent = Math.round(yesPrice * 100);
  const noPercent = 100 - yesPercent;

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
      {title && (
        <h3 className="mb-4 text-lg font-semibold text-foreground">{title}</h3>
      )}

      {/* Large Percentage Display */}
      <div className="mb-6 text-center">
        <div className="text-5xl font-bold text-foreground">
          {yesPercent}%
        </div>
        <div className="mt-2 text-sm text-[var(--muted)]">
          Probability of Yes
        </div>
      </div>

      {/* Horizontal Bar */}
      <div className="relative h-12 overflow-hidden rounded-full bg-[var(--background)]">
        {/* YES side (left) */}
        <div
          className="absolute inset-y-0 left-0 bg-yes transition-all duration-300"
          style={{ width: `${yesPercent}%` }}
        >
          {yesPercent >= 15 && (
            <div className="flex h-full items-center justify-start px-4">
              <span className="text-sm font-semibold text-white">
                YES {yesPercent}%
              </span>
            </div>
          )}
        </div>

        {/* NO side (right) */}
        <div
          className="absolute inset-y-0 right-0 bg-no transition-all duration-300"
          style={{ width: `${noPercent}%` }}
        >
          {noPercent >= 15 && (
            <div className="flex h-full items-center justify-end px-4">
              <span className="text-sm font-semibold text-white">
                NO {noPercent}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yes" />
          <span className="text-[var(--muted)]">Yes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-no" />
          <span className="text-[var(--muted)]">No</span>
        </div>
      </div>
    </div>
  );
}
