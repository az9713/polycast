# CLAUDE.md — AI Assistant Context for Polycast

This file provides conventions and context for AI assistants (Claude, Copilot, etc.) working on this codebase.

---

## Project Overview

**Polycast** is a binary prediction market platform (Polymarket clone) built with Next.js 14 App Router, TypeScript, SQLite (better-sqlite3), and Tailwind CSS. Users buy YES/NO shares on real-world events using play money ($1,000 starting balance).

---

## Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Next.js | 14.2.x | App Router framework |
| TypeScript | 5.x | Type safety |
| SQLite | better-sqlite3 12.x | Database (file: `polycast.db`) |
| Tailwind CSS | 3.4.x | Styling (dark-mode first) |
| Vitest | 4.x | Test runner |
| React Testing Library | 16.x | Component tests |
| bcryptjs | 3.x | Password hashing |
| jsonwebtoken | 9.x | JWT auth tokens |
| uuid | 13.x | ID generation |

---

## Commands

```bash
npm run dev         # Start dev server (localhost:3000)
npm run build       # Production build
npm run test:run    # Run all 105 tests once
npm test            # Run tests in watch mode
npm run lint        # ESLint checks
```

---

## Project Structure

```
polycast/
  src/
    app/                    # Next.js App Router pages + API routes
      api/
        auth/               # login/, signup/, logout/, me/ routes
        markets/            # GET list, POST create, [id]/ detail + orders/
        portfolio/          # GET user positions
        leaderboard/        # GET ranked traders
      markets/[id]/         # Market detail page
      leaderboard/          # Leaderboard page
      portfolio/            # Portfolio page
      auth/                 # Login + signup pages
    components/             # 8 React client components
    lib/
      engine/               # CLOB matching engine (core business logic)
        orderbook.ts        # OrderBook class — order placement + matching
        market.ts           # MarketManager class — create, resolve, cancel
        types.ts            # TypeScript interfaces
      db/                   # Database layer
        connection.ts       # SQLite connection (WAL mode, FK ON)
        schema.ts           # CREATE TABLE statements
        migrations.ts       # Runs schema on startup
        seed.ts             # 15 markets, 10 users, 18 positions
        index.ts            # Lazy init: migrations + seed on first access
      auth.ts               # JWT helpers, cookie management
      utils.ts              # Formatting helpers, constants
  tests/
    engine/                 # 51 tests (orderbook, market, pricing)
    api/                    # 32 tests (auth, markets, orders, portfolio, leaderboard)
    components/             # 22 tests (MarketCard, TradePanel, OrderBook)
    setup.ts                # Test setup (jest-dom matchers)
```

---

## Core Concepts

### Binary Prediction Market
- Every market has two outcomes: YES and NO
- `yes_price + no_price = $1.00` (always)
- Prices range from $0.01 to $0.99
- Winners get $1.00 per share; losers get $0.00

### CLOB Matching Engine (`src/lib/engine/orderbook.ts`)
This is the most critical file in the codebase.

**Matching rule:** A YES buy at price P matches with a NO buy where `no_price >= (1 - P)`.

Example: YES buy at $0.60 matches NO buy at $0.40 because `0.40 >= (1 - 0.60)`.

**Order flow:**
1. Validate inputs (price 0.01-0.99, positive integer quantity, user balance)
2. Debit user balance for `price * quantity`
3. Insert order with status `open`
4. Query opposite side for matches: `price >= complementPrice` ordered by `price DESC, created_at ASC`
5. For each match: create trade, update fill quantities, update positions, refund price improvement
6. Market orders: auto-cancel unfilled portion after matching
7. Update market `yes_price`/`no_price` to last trade price

**Key implementation details:**
- Self-matching prevention: orders from same user are skipped
- Price improvement: difference between order price and execution price is refunded
- Positions use weighted average price: `newAvg = (oldAvg * oldShares + price * newShares) / totalShares`
- Market order cancel checks `status IN ('open', 'partial')` not just `'open'`

### Market Resolution (`src/lib/engine/market.ts`)
- `resolveMarket(id, 'yes'|'no')`: cancels open orders (with refunds), pays winners $1/share, records realized P&L
- `cancelMarket(id)`: refunds all open orders + positions at avg cost

---

## Database Schema (5 Tables)

| Table | Key Fields | Notes |
|-------|-----------|-------|
| `users` | id, username, email, password_hash, balance | Starting balance: $1,000 |
| `markets` | id, title, category, status, yes_price, no_price, volume | Status: open/resolved_yes/resolved_no/cancelled |
| `orders` | id, user_id, market_id, side, type, price, quantity, filled_quantity, status | Status: open/filled/partial/cancelled |
| `trades` | id, market_id, buyer_order_id, seller_order_id, price, quantity | Created by matching engine |
| `positions` | id, user_id, market_id, side, shares, avg_price, realized_pnl | UNIQUE(user_id, market_id, side) |

---

## API Routes

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/signup` | No | Create account (username 3+, email, password 6+) |
| POST | `/api/auth/login` | No | Login (email + password) |
| POST | `/api/auth/logout` | No | Clear auth cookie |
| GET | `/api/auth/me` | Yes | Get current user (flat: id, username, email, balance) |
| GET | `/api/markets` | No | List markets (?category= filter) |
| POST | `/api/markets` | Yes | Create market |
| GET | `/api/markets/[id]` | No | Market detail + orderBook + recentTrades |
| POST | `/api/markets/[id]/orders` | Yes | Place order (side, type, price, quantity) |
| GET | `/api/portfolio` | Yes | User positions, open orders, P&L totals |
| GET | `/api/leaderboard` | No | Ranked users by balance + P&L |

---

## Authentication

- **Method:** JWT stored in httpOnly cookie (`polycast_token`)
- **Token expiry:** 7 days
- **Secret:** `JWT_SECRET` env var (defaults to dev secret)
- **Cookie options:** httpOnly, sameSite: lax, secure in production
- **Auth check in API:** `getCurrentUser()` reads cookie, verifies JWT, queries user from DB
- **Auth check in components:** `fetch('/api/auth/me')` in `useEffect`

---

## Coding Conventions

### Next.js 14 App Router
- `params` must be awaited in route handlers: `const { id } = await params`
- `cookies()` must be awaited: `const cookieStore = await cookies()`
- Use `'use client'` directive for components with hooks or browser APIs

### TypeScript
- Type definitions in `src/lib/engine/types.ts`
- Use `as` casts when querying SQLite (better-sqlite3 returns `unknown`)
- Use `null!` (non-null assertion) for error returns in PlaceOrderResult
- Unused params prefixed with underscore: `_request`

### Tailwind CSS
- Dark mode first: background `#0a0a0f`, surface `#12121a`
- YES = green (`text-yes`, `bg-yes`), NO = red (`text-no`, `bg-no`)
- Custom CSS variables in `globals.css`
- Responsive: mobile-first with `md:` and `lg:` breakpoints

### ESLint
- `no-explicit-any` disabled (rapid prototyping with SQLite)
- `no-require-imports` disabled
- Unused args use `argsIgnorePattern: "^_"`

---

## Testing Patterns

### Engine Tests (51 tests)
- Use `better-sqlite3` with `:memory:` database for isolation
- `beforeEach`: create fresh DB, run migrations, create test users/markets
- Direct class instantiation: `new OrderBook(db)`, `new MarketManager(db)`

### API Tests (32 tests)
- Same `:memory:` DB pattern
- Test through engine classes directly (not HTTP)
- Verify DB state with raw SQL queries

### Component Tests (22 tests)
- Vitest + jsdom + React Testing Library
- Mock `next/link`: `vi.mock('next/link', () => ({ default: ... }))`
- Mock `next/navigation` where needed
- TradePanel: mock `global.fetch` for auth check, use `waitFor()` for async state
- Helper functions: `renderLoggedIn()` / `renderLoggedOut()`

### Running Tests
```bash
npm run test:run              # All 105 tests
npx vitest run tests/engine   # Engine tests only
npx vitest run tests/api      # API tests only
npx vitest run tests/components # Component tests only
```

---

## Seed Data

- **15 markets** across 5 categories: crypto (3), politics (3), sports (3), ai (3), entertainment (3)
- **10 users** with varying balances ($500-$3,500)
- **18 pre-populated positions** across markets
- Database auto-seeds on first access via `initializeDatabase()` in `src/lib/db/index.ts`
- Database file: `polycast.db` (created in project root)

---

## Common Tasks

### Adding a New API Route
1. Create route file at `src/app/api/<path>/route.ts`
2. Export async `GET`/`POST` function with `NextRequest` param
3. Use `initializeDatabase()` to get DB connection
4. Use `getCurrentUser()` for auth-required routes
5. Return `NextResponse.json()`

### Adding a New Component
1. Create file at `src/components/<Name>.tsx`
2. Add `'use client'` if using hooks/state
3. Define props interface
4. Use Tailwind classes following dark-mode-first pattern
5. Add test at `tests/components/<Name>.test.tsx`

### Adding a New Market Category
1. Add to `CATEGORIES` array in `src/lib/utils.ts`
2. Add to `CATEGORY_LABELS` map in same file
3. Add seed markets in `src/lib/db/seed.ts`

### Modifying the Matching Engine
1. Edit `src/lib/engine/orderbook.ts`
2. Run engine tests: `npx vitest run tests/engine`
3. Verify all 51 engine tests pass before committing
4. This is the highest-risk file — test thoroughly

---

## Known Patterns & Gotchas

1. **DB initialization is lazy**: First request triggers migrations + seed. Cold starts may be slow.
2. **No WebSocket/SSE**: Order book and prices don't auto-update. Refresh to see changes.
3. **No transaction wrapping**: The matching engine does sequential DB updates without explicit transactions. Under concurrent load, this could cause race conditions. Fine for single-user/demo use.
4. **Password in dev**: Default JWT secret is hardcoded. Set `JWT_SECRET` env var in production.
5. **No pagination**: Market list and leaderboard return all results. Add LIMIT/OFFSET for large datasets.
6. **`/api/auth/me` returns flat object**: `{ id, username, email, balance }` — not wrapped in `{ user: {...} }`.
7. **Market order auto-cancel**: Unfilled portions of market orders are cancelled and refunded immediately after matching attempt.

---

## Test Count Target

Maintain **105+ tests** across 11 test files. Add tests for any new features.

| Category | Files | Tests |
|----------|-------|-------|
| Engine | 3 | 51 |
| API | 5 | 32 |
| Components | 3 | 22 |
| **Total** | **11** | **105** |
