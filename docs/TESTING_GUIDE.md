# Testing Guide

A complete guide to running, writing, understanding, and debugging tests in the Polycast application. Written for developers who may be new to JavaScript testing.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Test Framework Overview](#test-framework-overview)
3. [Running Tests](#running-tests)
4. [Test Organization](#test-organization)
5. [Engine Tests (51 tests)](#engine-tests-51-tests)
6. [API Tests (32 tests)](#api-tests-32-tests)
7. [Component Tests (22 tests)](#component-tests-22-tests)
8. [How to Write a New Test](#how-to-write-a-new-test)
9. [Common Patterns](#common-patterns)
10. [Debugging Failed Tests](#debugging-failed-tests)
11. [Test Coverage Reference](#test-coverage-reference)

---

## Quick Start

```bash
cd polycast

# Run all 105 tests once and exit
npm run test:run

# Run tests in watch mode (re-runs when files change)
npm test

# Run only engine tests
npx vitest run tests/engine

# Run only a specific test file
npx vitest run tests/engine/orderbook.test.ts

# Run tests matching a pattern
npx vitest run -t "should match a YES buy"
```

---

## Test Framework Overview

### What We Use

| Tool | Purpose | Analogy for Java Developers |
|------|---------|---------------------------|
| **Vitest** | Test runner and assertion library | Like JUnit + Hamcrest |
| **React Testing Library** | Renders React components in tests | Like JSoup for testing HTML output |
| **jsdom** | Simulates a browser DOM in Node.js | Like HtmlUnit |
| **@testing-library/jest-dom** | Extra DOM assertion matchers | Like custom Hamcrest matchers |

### Key Differences from JUnit

| JUnit (Java) | Vitest (JavaScript) | Notes |
|-------------|-------------------|-------|
| `@Test` | `it('description', () => {...})` | Tests have human-readable descriptions |
| `@BeforeEach` | `beforeEach(() => {...})` | Same concept, function-based |
| `assertEquals(expected, actual)` | `expect(actual).toBe(expected)` | Arguments are reversed |
| `assertTrue(condition)` | `expect(condition).toBe(true)` | Fluent assertion style |
| `assertThrows(...)` | `expect(() => ...).toThrow()` | Lambda-based |
| `@Mock` | `vi.fn()` / `vi.mock()` | Built-in mocking |

### Configuration

The test configuration is in `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],        // Enables JSX/TSX in tests
  test: {
    environment: 'jsdom',    // Simulates browser DOM
    globals: true,           // Makes describe/it/expect available globally
    setupFiles: ['./tests/setup.ts'],  // Runs before each test file
    include: ['tests/**/*.test.{ts,tsx}'],  // Which files are tests
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // Allows @/lib/... imports
    },
  },
});
```

The setup file (`tests/setup.ts`) loads extra matchers:

```typescript
import '@testing-library/jest-dom/vitest';
```

---

## Running Tests

### All Tests

```bash
npm run test:run
```

Expected output:
```
 ✓ tests/engine/orderbook.test.ts (28 tests)
 ✓ tests/engine/market.test.ts (16 tests)
 ✓ tests/engine/pricing.test.ts (7 tests)
 ✓ tests/api/auth.test.ts (7 tests)
 ✓ tests/api/markets.test.ts (7 tests)
 ✓ tests/api/orders.test.ts (8 tests)
 ✓ tests/api/portfolio.test.ts (5 tests)
 ✓ tests/api/leaderboard.test.ts (5 tests)
 ✓ tests/components/MarketCard.test.tsx (8 tests)
 ✓ tests/components/TradePanel.test.tsx (8 tests)
 ✓ tests/components/OrderBook.test.tsx (6 tests)

 Test Files  11 passed (11)
      Tests  105 passed (105)
```

### Selective Test Running

```bash
# By directory
npx vitest run tests/engine        # Engine tests only (51)
npx vitest run tests/api           # API tests only (32)
npx vitest run tests/components    # Component tests only (22)

# By single file
npx vitest run tests/engine/orderbook.test.ts

# By test name pattern (uses -t flag)
npx vitest run -t "should place a YES limit order"
npx vitest run -t "order matching"      # Matches describe block names too
npx vitest run -t "cancel"              # All tests with "cancel" in name
```

### Watch Mode

```bash
npm test
```

In watch mode:
- Tests re-run automatically when you save a file
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit
- Press `h` for help

---

## Test Organization

```
tests/
├── setup.ts                      # Test setup (jest-dom matchers)
├── engine/                       # Core business logic tests
│   ├── orderbook.test.ts         # 28 tests — order placement, matching, cancellation
│   ├── market.test.ts            # 16 tests — market lifecycle, resolution, payout
│   └── pricing.test.ts           #  7 tests — price constraints, complement pricing
├── api/                          # API-level logic tests
│   ├── auth.test.ts              #  7 tests — password hashing, JWT tokens
│   ├── markets.test.ts           #  7 tests — market CRUD operations
│   ├── orders.test.ts            #  8 tests — order validation and execution
│   ├── portfolio.test.ts         #  5 tests — portfolio positions and P&L
│   └── leaderboard.test.ts       #  5 tests — ranking and calculations
└── components/                   # UI component rendering tests
    ├── MarketCard.test.tsx        #  8 tests — card display, links, formatting
    ├── TradePanel.test.tsx        #  8 tests — trade form, auth state, calculations
    └── OrderBook.test.tsx         #  6 tests — order book display, depth limits
```

**File naming convention:**
- Engine/API tests: `*.test.ts` (pure TypeScript)
- Component tests: `*.test.tsx` (TypeScript + JSX)

---

## Engine Tests (51 tests)

Engine tests verify the core business logic — the CLOB matching engine and market lifecycle. These are the most critical tests.

### How Engine Tests Work

Engine tests use an **in-memory SQLite database** for complete isolation:

```typescript
import Database from 'better-sqlite3';
import { OrderBook } from '@/lib/engine/orderbook';
import { runMigrations } from '@/lib/db/migrations';

let db: Database.Database;
let orderBook: OrderBook;

beforeEach(() => {
  // Fresh database for every single test
  db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  runMigrations(db);
  orderBook = new OrderBook(db);

  // Create test users and markets
  createUser(user1Id, 'trader1');
  createUser(user2Id, 'trader2');
  createMarket(marketId);
});
```

**Why `:memory:`?** Each test gets a completely fresh database. No test can affect another. No cleanup needed. This is the equivalent of `@Transactional` rollback in Spring tests.

### Helper Functions

Engine tests use small helper functions to reduce boilerplate:

```typescript
function createUser(id: string, username: string, balance: number = 1000) {
  db.prepare(
    'INSERT INTO users (id, username, email, password_hash, balance) VALUES (?, ?, ?, ?, ?)'
  ).run(id, username, `${username}@test.com`, 'hash', balance);
}

function createMarket(id: string, title: string = 'Test Market') {
  db.prepare(
    `INSERT INTO markets (id, title, description, category, resolution_source,
     resolution_date, status, yes_price, no_price, volume)
     VALUES (?, ?, 'Test', 'crypto', 'test', '2026-12-31', 'open', 0.50, 0.50, 0)`
  ).run(id, title);
}

function getUserBalance(userId: string): number {
  return (db.prepare('SELECT balance FROM users WHERE id = ?')
    .get(userId) as { balance: number }).balance;
}
```

### What the Orderbook Tests Cover (28 tests)

**Basic order placement (10 tests):**
- Place YES/NO limit orders successfully
- Balance is debited correctly
- Reject invalid prices (below 0.01, above 0.99)
- Reject invalid quantities (zero, non-integer)
- Reject when insufficient balance
- Reject for non-existent market or user

**Order matching (10 tests):**
- YES buy matches NO buy when prices sum to $1.00
- YES buy matches NO buy when prices sum exceeds $1.00
- No match when prices don't complement
- Partial fills work correctly
- Multiple resting orders are swept
- Price-time priority is respected
- Self-matching is prevented
- Market price updates after trade
- Volume updates after trade
- Positions are created correctly

**Market orders (2 tests):**
- Market orders fill at best available price
- Unfilled market order portions are cancelled

**Order cancellation (4 tests):**
- Cancel an open order (balance refunded)
- Cannot cancel a filled order
- Cannot cancel another user's order
- Partial cancel refunds only unfilled portion

**Order book queries (2 tests):**
- Returns orders grouped by side, sorted by price
- Excludes filled and cancelled orders

### What the Market Tests Cover (16 tests)

- Create market with default and custom prices
- List markets, filter by category
- Resolve market YES: winners paid, losers recorded
- Resolve market NO: correct payouts
- Cancel market: positions refunded at avg cost
- Open orders refunded on resolution
- Cannot resolve an already-resolved market
- Market not found errors

### What the Pricing Tests Cover (7 tests)

- Price complement invariant: yes + no = 1.00
- Price bounds: 0.01 to 0.99
- Price improvement refunds
- Boundary price testing

---

## API Tests (32 tests)

API tests verify the logic that the API routes use. They test through the engine classes directly with in-memory databases (same pattern as engine tests).

### Auth Tests (7 tests)

```typescript
import { hashPassword, verifyPassword, createToken, verifyToken } from '@/lib/auth';

it('should hash a password', () => {
  const hash = hashPassword('testpassword');
  expect(hash).toBeDefined();
  expect(hash).not.toBe('testpassword');  // Not stored in plaintext
});

it('should verify a correct password', () => {
  const hash = hashPassword('testpassword');
  expect(verifyPassword('testpassword', hash)).toBe(true);
});

it('should create and verify a token', () => {
  const payload = { userId: 'test-id', username: 'testuser' };
  const token = createToken(payload);
  const verified = verifyToken(token);
  expect(verified!.userId).toBe('test-id');
});
```

### Orders Tests (8 tests)

Test the full order execution flow:
- Reject unauthenticated orders
- Reject orders on closed markets
- Validate price bounds
- Validate quantity
- Place and match a complete trade
- Return trade details in response
- Build up the order book with multiple orders
- Sweep through multiple price levels

### Markets Tests (7 tests)

- List all markets
- Filter by category
- Create new market
- Get market detail
- Market not found

### Portfolio Tests (5 tests)

- Return user positions with unrealized P&L
- Calculate totals correctly
- Handle users with no positions
- Include open orders
- Reject unauthenticated requests

### Leaderboard Tests (5 tests)

- Return ranked users
- Calculate P&L correctly
- Include trade counts
- Handle users with no trades
- Limit to top 50

---

## Component Tests (22 tests)

Component tests verify that React components render correctly. They use React Testing Library to render components and query the resulting DOM.

### Setup for Component Tests

Component tests need to mock Next.js modules that don't work in a test environment:

```typescript
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next/link (required — Next.js Link doesn't work in jsdom)
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));
```

### MarketCard Tests (8 tests)

```typescript
const defaultProps = {
  id: 'market-1',
  title: 'Will BTC be above $110K?',
  category: 'crypto',
  yes_price: 0.65,
  no_price: 0.35,
  volume: 125000,
  resolution_date: '2026-12-31',
  status: 'open',
};

it('should render the market title', () => {
  render(<MarketCard {...defaultProps} />);
  expect(screen.getByText('Will BTC be above $110K?')).toBeDefined();
});

it('should display YES percentage', () => {
  render(<MarketCard {...defaultProps} />);
  expect(screen.getByText('65%')).toBeDefined();
});

it('should link to market detail page', () => {
  render(<MarketCard {...defaultProps} />);
  const link = screen.getByRole('link');
  expect(link.getAttribute('href')).toBe('/markets/market-1');
});
```

### TradePanel Tests (8 tests) — Async Pattern

The TradePanel component checks authentication via a `fetch('/api/auth/me')` call in `useEffect`. This means tests need special handling:

```typescript
// Helper: render with auth (fetch returns success)
function renderLoggedIn() {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({})
  });
  return render(<TradePanel {...defaultProps} />);
}

// Helper: render without auth (fetch returns failure)
function renderLoggedOut() {
  global.fetch = vi.fn().mockResolvedValue({ ok: false });
  return render(<TradePanel {...defaultProps} />);
}

// Must use waitFor because auth check is async
it('should show Buy Yes and Buy No buttons when logged in', async () => {
  renderLoggedIn();
  await waitFor(() => {
    expect(screen.getByText('Buy Yes')).toBeDefined();
    expect(screen.getByText('Buy No')).toBeDefined();
  });
});

it('should show login button when not logged in', async () => {
  renderLoggedOut();
  await waitFor(() => {
    expect(screen.getByText('Log in to trade')).toBeDefined();
  });
});
```

**Why `waitFor`?** The component's `useEffect` runs asynchronously after the initial render. Without `waitFor`, the test would check the DOM before the auth fetch completes.

### OrderBook Tests (6 tests)

```typescript
it('should render with empty order book', () => {
  render(<OrderBook yesBids={[]} noBids={[]} />);
  expect(screen.getAllByText('No orders')).toHaveLength(2);
});

it('should render yes bids', () => {
  const yesBids = [
    { price: 0.65, quantity: 100, filled_quantity: 0 },
    { price: 0.60, quantity: 50, filled_quantity: 10 },
  ];
  render(<OrderBook yesBids={yesBids} noBids={[]} />);
  expect(screen.getByText('65¢')).toBeDefined();
  expect(screen.getByText('40')).toBeDefined(); // 50 - 10 remaining
});

it('should limit to 8 levels per side', () => {
  const yesBids = Array.from({ length: 12 }, (_, i) => ({
    price: (99 - i) / 100,
    quantity: 10,
    filled_quantity: 0,
  }));
  render(<OrderBook yesBids={yesBids} noBids={[]} />);
  const priceElements = screen.getAllByText(/¢$/);
  expect(priceElements.length).toBeLessThanOrEqual(8);
});
```

---

## How to Write a New Test

### Step 1: Choose the Right Category

| What You're Testing | Where to Put It | File Extension |
|---------------------|----------------|---------------|
| Matching engine logic | `tests/engine/` | `.test.ts` |
| API route logic | `tests/api/` | `.test.ts` |
| React component rendering | `tests/components/` | `.test.tsx` |

### Step 2: Follow the Pattern

**For engine/API tests:**

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { runMigrations } from '@/lib/db/migrations';

let db: Database.Database;

beforeEach(() => {
  db = new Database(':memory:');
  db.pragma('foreign_keys = ON');
  runMigrations(db);
  // Create test data...
});

describe('YourFeature', () => {
  it('should do the expected thing', () => {
    // Arrange
    const input = ...;

    // Act
    const result = yourFunction(input);

    // Assert
    expect(result).toBe(expectedValue);
  });
});
```

**For component tests:**

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import YourComponent from '@/components/YourComponent';

// Mock Next.js modules if needed
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('YourComponent', () => {
  const defaultProps = { /* ... */ };

  it('should render correctly', () => {
    render(<YourComponent {...defaultProps} />);
    expect(screen.getByText('Expected Text')).toBeDefined();
  });
});
```

### Step 3: Run and Verify

```bash
# Run just your new test file
npx vitest run tests/your-category/your-file.test.ts

# Run all tests to make sure nothing broke
npm run test:run
```

---

## Common Patterns

### Pattern 1: Testing Error Cases

```typescript
it('should reject invalid input', () => {
  const result = orderBook.placeOrder(userId, marketId, 'yes', 'limit', 0, 10);
  expect(result.error).toBeDefined();
  expect(result.error).toBe('Price must be between 0.01 and 0.99');
});
```

### Pattern 2: Testing State Changes

```typescript
it('should debit balance after order', () => {
  const before = getUserBalance(userId);
  orderBook.placeOrder(userId, marketId, 'yes', 'limit', 0.60, 10);
  const after = getUserBalance(userId);
  expect(after).toBeCloseTo(before - 6.00, 1);
});
```

### Pattern 3: Testing Async Components

```typescript
it('should update after async operation', async () => {
  render(<AsyncComponent />);

  // Wait for the async state update
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeDefined();
  });
});
```

### Pattern 4: Testing User Interactions

```typescript
import { fireEvent, act } from '@testing-library/react';

it('should respond to click', async () => {
  render(<MyComponent />);

  await act(async () => {
    fireEvent.click(screen.getByText('Button'));
  });

  expect(screen.getByText('Clicked!')).toBeDefined();
});
```

### Pattern 5: Testing Form Inputs

```typescript
it('should update when input changes', async () => {
  render(<FormComponent />);

  await act(async () => {
    fireEvent.change(screen.getByLabelText('Price'), {
      target: { value: '0.75' }
    });
  });

  const input = screen.getByLabelText('Price') as HTMLInputElement;
  expect(input.value).toBe('0.75');
});
```

### Pattern 6: Mocking fetch

```typescript
beforeEach(() => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({ data: 'mocked' }),
  });
});
```

### Pattern 7: Using `toBeCloseTo` for Floating-Point

```typescript
// BAD: can fail due to floating-point precision
expect(balance).toBe(994.00);

// GOOD: allows small floating-point differences
expect(balance).toBeCloseTo(994, 0);  // within 1 unit
expect(price).toBeCloseTo(0.60, 2);   // within 0.01
```

---

## Debugging Failed Tests

### Problem: Test Can't Find Element

**Symptom:** `Unable to find an element with the text: "Buy Yes"`

**Likely cause:** The component renders asynchronously (e.g., after a `fetch` call).

**Fix:** Wrap assertion in `waitFor`:

```typescript
// BEFORE (fails)
expect(screen.getByText('Buy Yes')).toBeDefined();

// AFTER (works)
await waitFor(() => {
  expect(screen.getByText('Buy Yes')).toBeDefined();
});
```

### Problem: "Not wrapped in act(...)" Warning

**Symptom:** Console warning about state updates not being wrapped in `act()`.

**Fix:** Wrap user interactions in `act`:

```typescript
await act(async () => {
  fireEvent.click(button);
});
```

### Problem: Module Not Found

**Symptom:** `Cannot find module '@/lib/engine/orderbook'`

**Fix:** Ensure `vitest.config.ts` has the path alias:

```typescript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
},
```

### Problem: next/link or next/navigation Error

**Symptom:** Error about Next.js router context not being available.

**Fix:** Add mock at the top of your test file:

```typescript
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
  usePathname: () => '/',
}));
```

### Problem: Floating-Point Comparison Failure

**Symptom:** `Expected 993.9999999999999, received 994`

**Fix:** Use `toBeCloseTo` instead of `toBe`:

```typescript
expect(balance).toBeCloseTo(994, 0);
```

### Problem: Database State Leaking Between Tests

**Symptom:** Tests pass individually but fail when run together.

**Fix:** Ensure `beforeEach` creates a fresh `:memory:` database:

```typescript
beforeEach(() => {
  db = new Database(':memory:');  // Fresh DB every test
  db.pragma('foreign_keys = ON');
  runMigrations(db);
});
```

### Problem: Market Order Cancel Test Fails

**Symptom:** Market order status is `'partial'` instead of `'cancelled'`.

**Fix:** This was a known bug. The cancel query must check both statuses:

```sql
UPDATE orders SET status = 'cancelled'
WHERE id = ? AND status IN ('open', 'partial')
```

Not just:

```sql
UPDATE orders SET status = 'cancelled'
WHERE id = ? AND status = 'open'
```

---

## Test Coverage Reference

### Full Test Inventory

| File | Tests | What It Covers |
|------|-------|---------------|
| `orderbook.test.ts` | 28 | Order placement (10), matching (10), market orders (2), cancellation (4), queries (2) |
| `market.test.ts` | 16 | Market CRUD (4), resolution YES (3), resolution NO (3), cancel market (3), errors (3) |
| `pricing.test.ts` | 7 | Price bounds (3), complement pricing (2), improvement (2) |
| `auth.test.ts` | 7 | Password hashing (4), JWT tokens (3) |
| `markets.test.ts` | 7 | List (2), filter (1), create (2), detail (1), not found (1) |
| `orders.test.ts` | 8 | Validation (4), execution flow (4) |
| `portfolio.test.ts` | 5 | Positions (2), P&L (1), open orders (1), unauth (1) |
| `leaderboard.test.ts` | 5 | Ranking (2), P&L calc (1), trade counts (1), empty (1) |
| `MarketCard.test.tsx` | 8 | Title (1), category (1), prices (2), volume (1), link (1), categories (1), 50/50 (1) |
| `TradePanel.test.tsx` | 8 | Title (1), buttons (1), inputs (1), default price (1), toggle (1), cost (1), payout (1), auth (1) |
| `OrderBook.test.tsx` | 6 | Empty (1), yes bids (1), no bids (1), both sides (1), headers (1), limit (1) |

### Running Coverage Report

To see line-by-line coverage:

```bash
npx vitest run --coverage
```

> Note: You may need to install `@vitest/coverage-v8` first:
> ```bash
> npm install -D @vitest/coverage-v8
> ```

---

## Adding Tests for New Features

When you add a new feature, follow this checklist:

1. **Identify the category**: Is it engine logic, API logic, or UI?
2. **Create or extend the test file** in the appropriate directory
3. **Write at least these test types**:
   - Happy path: feature works correctly with valid input
   - Error cases: feature handles invalid input gracefully
   - Edge cases: boundary values, empty inputs, large inputs
4. **Run all tests** to ensure nothing broke: `npm run test:run`
5. **Maintain the 105+ test count** — every new feature should add tests

### Test Naming Convention

Use descriptive names that explain **what should happen**:

```typescript
// GOOD
it('should match a YES buy with a NO buy when prices complement to >= 1')
it('should reject order with price above 0.99')
it('should show login button when not logged in')

// BAD
it('test1')
it('order works')
it('component renders')
```

The format `should [expected behavior] [when condition]` makes test output readable and failures self-documenting.
