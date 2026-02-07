# Component Usage Guide

This guide shows how to use the three new trading components in your Polycast app.

## Components

### 1. OrderBook

Displays the order book for a market with YES and NO bids.

```tsx
import OrderBook from '@/components/OrderBook';

<OrderBook
  yesBids={[
    { price: 0.65, quantity: 100, filled_quantity: 20 },
    { price: 0.63, quantity: 50, filled_quantity: 0 },
    { price: 0.60, quantity: 200, filled_quantity: 50 },
  ]}
  noBids={[
    { price: 0.35, quantity: 150, filled_quantity: 30 },
    { price: 0.37, quantity: 75, filled_quantity: 0 },
    { price: 0.40, quantity: 100, filled_quantity: 25 },
  ]}
/>
```

**Features:**
- Shows up to 8 price levels per side
- Visual depth indicators (wider bars = more quantity)
- Green accent for YES, red accent for NO
- Displays remaining quantity (quantity - filled_quantity)
- Shows "No orders" when empty

### 2. TradePanel

Interactive panel for placing limit orders.

```tsx
import TradePanel from '@/components/TradePanel';

<TradePanel
  marketId="market-123"
  yesPrice={0.65}
  noPrice={0.35}
/>
```

**Features:**
- Toggle between Buy Yes and Buy No
- Price and shares input
- Real-time cost calculation
- Potential payout and profit display
- Form validation
- Loading states
- Error handling
- Posts to `/api/markets/${marketId}/orders`

**API Expected Format:**
```ts
POST /api/markets/${marketId}/orders
{
  side: 'yes' | 'no',
  type: 'limit',
  price: number,
  quantity: number
}
```

### 3. PriceChart

Visual representation of market probability.

```tsx
import PriceChart from '@/components/PriceChart';

<PriceChart
  yesPrice={0.65}
  title="Market Probability"
/>
```

**Features:**
- Large percentage display
- Horizontal probability bar (green for YES, red for NO)
- Animated transitions
- Optional title prop
- Legend

## Example Market Page

Here's how to combine all three components on a market detail page:

```tsx
// app/markets/[id]/page.tsx
import OrderBook from '@/components/OrderBook';
import TradePanel from '@/components/TradePanel';
import PriceChart from '@/components/PriceChart';

export default async function MarketPage({ params }: { params: { id: string } }) {
  // Fetch market data
  const market = await getMarket(params.id);
  const orderBook = await getOrderBook(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Market Info */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl font-bold text-foreground">
            {market.title}
          </h1>

          <PriceChart
            yesPrice={market.yes_price}
            title="Current Probability"
          />

          <OrderBook
            yesBids={orderBook.yes_bids}
            noBids={orderBook.no_bids}
          />
        </div>

        {/* Right Column - Trading */}
        <div>
          <TradePanel
            marketId={params.id}
            yesPrice={market.yes_price}
            noPrice={market.no_price}
          />
        </div>
      </div>
    </div>
  );
}
```

## Styling

All components use:
- Tailwind CSS with dark theme
- CSS variables from `globals.css`:
  - `--surface`: Component backgrounds
  - `--border`: Border colors
  - `--foreground`: Main text
  - `--muted`: Secondary text
  - `--accent`: Primary accent color
- Custom colors:
  - `yes`: #22c55e (green)
  - `no`: #ef4444 (red)

## Authentication

The TradePanel checks an `isLoggedIn` state. In production, integrate with your auth provider:

```tsx
// Example with Next.js auth
import { useSession } from 'next-auth/react';

const { data: session } = useSession();
const isLoggedIn = !!session;
```

Currently it's hardcoded to `true` for development purposes.
