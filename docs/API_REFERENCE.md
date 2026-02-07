# API Reference

Complete reference for all Polycast API endpoints. Every endpoint includes the URL, method, request format, response format, and example `curl` commands you can run from your terminal.

---

## Table of Contents

1. [Authentication](#authentication)
   - [Sign Up](#sign-up)
   - [Log In](#log-in)
   - [Log Out](#log-out)
   - [Get Current User](#get-current-user)
2. [Markets](#markets)
   - [List Markets](#list-markets)
   - [Get Market Detail](#get-market-detail)
   - [Create Market](#create-market)
3. [Orders](#orders)
   - [Place Order](#place-order)
4. [Portfolio](#portfolio)
   - [Get Portfolio](#get-portfolio)
5. [Leaderboard](#leaderboard)
   - [Get Leaderboard](#get-leaderboard)

---

## Base URL

When running locally: `http://localhost:3000`

All API routes are under `/api/`.

---

## Authentication

Authentication uses JWT tokens stored in httpOnly cookies. After signup or login, the server sets a `polycast_token` cookie automatically. Include this cookie in subsequent requests for authenticated endpoints.

### Sign Up

Create a new user account with $1,000 starting balance.

| | |
|---|---|
| **URL** | `POST /api/auth/signup` |
| **Auth Required** | No |
| **Content-Type** | `application/json` |

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `username` | string | Yes | Minimum 3 characters |
| `email` | string | Yes | Must contain `@` |
| `password` | string | Yes | Minimum 6 characters |

**Success Response (200):**

```json
{
  "user": {
    "id": "a1b2c3d4-...",
    "username": "alice",
    "email": "alice@example.com",
    "balance": 1000,
    "created_at": "2026-02-07T12:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Body | When |
|--------|------|------|
| 400 | `{ "error": "Username must be at least 3 characters long" }` | Username too short |
| 400 | `{ "error": "Valid email is required" }` | Invalid email |
| 400 | `{ "error": "Password must be at least 6 characters long" }` | Password too short |
| 409 | `{ "error": "Username already exists" }` | Duplicate username |
| 409 | `{ "error": "Email already exists" }` | Duplicate email |

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"alice@example.com","password":"secret123"}' \
  -c cookies.txt
```

> The `-c cookies.txt` flag saves the auth cookie to a file for later use.

---

### Log In

Authenticate with email and password.

| | |
|---|---|
| **URL** | `POST /api/auth/login` |
| **Auth Required** | No |
| **Content-Type** | `application/json` |

**Request Body:**

| Field | Type | Required |
|-------|------|----------|
| `email` | string | Yes |
| `password` | string | Yes |

**Success Response (200):**

```json
{
  "user": {
    "id": "a1b2c3d4-...",
    "username": "alice",
    "email": "alice@example.com",
    "balance": 1000,
    "created_at": "2026-02-07T12:00:00.000Z"
  }
}
```

**Error Responses:**

| Status | Body | When |
|--------|------|------|
| 400 | `{ "error": "Email is required" }` | Missing email |
| 400 | `{ "error": "Password is required" }` | Missing password |
| 401 | `{ "error": "Invalid email or password" }` | Wrong credentials |

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"secret123"}' \
  -c cookies.txt
```

---

### Log Out

Clear the auth cookie to end the session.

| | |
|---|---|
| **URL** | `POST /api/auth/logout` |
| **Auth Required** | No |

**Success Response (200):**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Example:**

```bash
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
```

---

### Get Current User

Get the currently authenticated user's profile.

| | |
|---|---|
| **URL** | `GET /api/auth/me` |
| **Auth Required** | Yes |

**Success Response (200):**

```json
{
  "id": "a1b2c3d4-...",
  "username": "alice",
  "email": "alice@example.com",
  "balance": 960.00
}
```

> **Note:** This endpoint returns a flat object (not wrapped in `{ "user": {...} }`).

**Error Response:**

| Status | Body | When |
|--------|------|------|
| 401 | `{ "error": "Not authenticated" }` | No valid cookie/token |

**Example:**

```bash
curl http://localhost:3000/api/auth/me -b cookies.txt
```

---

## Markets

### List Markets

Get all markets, optionally filtered by category.

| | |
|---|---|
| **URL** | `GET /api/markets` |
| **Auth Required** | No |

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `category` | string | No | Filter by category: `crypto`, `politics`, `sports`, `ai`, `entertainment`. Omit or use `all` for no filter. |

**Success Response (200):**

```json
[
  {
    "id": "m1-uuid-...",
    "title": "Will BTC be above $110K by Dec 31, 2026?",
    "description": "Resolves YES if Bitcoin's price...",
    "category": "crypto",
    "resolution_source": "CoinMarketCap",
    "resolution_date": "2026-12-31",
    "status": "open",
    "yes_price": 0.42,
    "no_price": 0.58,
    "volume": 15000,
    "created_at": "2026-01-01T00:00:00.000Z"
  },
  ...
]
```

Markets are sorted by volume (highest first).

**Examples:**

```bash
# All markets
curl http://localhost:3000/api/markets

# Only crypto markets
curl "http://localhost:3000/api/markets?category=crypto"

# Only AI markets
curl "http://localhost:3000/api/markets?category=ai"
```

---

### Get Market Detail

Get a single market with its order book and recent trades.

| | |
|---|---|
| **URL** | `GET /api/markets/:id` |
| **Auth Required** | No |

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | The market ID |

**Success Response (200):**

```json
{
  "market": {
    "id": "m1-uuid-...",
    "title": "Will BTC be above $110K by Dec 31, 2026?",
    "description": "Resolves YES if Bitcoin's price...",
    "category": "crypto",
    "resolution_source": "CoinMarketCap",
    "resolution_date": "2026-12-31",
    "status": "open",
    "yes_price": 0.42,
    "no_price": 0.58,
    "volume": 15000,
    "created_at": "2026-01-01T00:00:00.000Z"
  },
  "orderBook": {
    "yesBids": [
      {
        "id": "order-uuid-...",
        "user_id": "user-uuid-...",
        "market_id": "m1-uuid-...",
        "side": "yes",
        "type": "limit",
        "price": 0.42,
        "quantity": 50,
        "filled_quantity": 10,
        "status": "partial",
        "created_at": "2026-02-01T..."
      }
    ],
    "noBids": [
      {
        "id": "order-uuid-...",
        "side": "no",
        "price": 0.55,
        "quantity": 30,
        "filled_quantity": 0,
        "status": "open",
        ...
      }
    ]
  },
  "recentTrades": [
    {
      "id": "trade-uuid-...",
      "market_id": "m1-uuid-...",
      "buyer_order_id": "order-uuid-...",
      "seller_order_id": "order-uuid-...",
      "price": 0.42,
      "quantity": 10,
      "created_at": "2026-02-05T..."
    }
  ]
}
```

**Error Response:**

| Status | Body | When |
|--------|------|------|
| 404 | `{ "error": "Market not found" }` | Invalid market ID |

**Example:**

```bash
# First get a market ID from the list
MARKET_ID=$(curl -s http://localhost:3000/api/markets | python3 -c "import sys,json;print(json.load(sys.stdin)[0]['id'])")

# Then fetch its detail
curl "http://localhost:3000/api/markets/$MARKET_ID"
```

---

### Create Market

Create a new prediction market. Requires authentication.

| | |
|---|---|
| **URL** | `POST /api/markets` |
| **Auth Required** | Yes |
| **Content-Type** | `application/json` |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | The market question |
| `description` | string | Yes | Detailed description and resolution criteria |
| `category` | string | Yes | One of: crypto, politics, sports, ai, entertainment |
| `resolution_source` | string | Yes | Where the outcome will be verified |
| `resolution_date` | string | Yes | ISO date when market resolves |
| `initial_yes_price` | number | No | Starting YES price (default: 0.50) |

**Success Response (201):**

```json
{
  "id": "new-uuid-...",
  "title": "Will Mars colony be announced by 2030?",
  "description": "Resolves YES if...",
  "category": "ai",
  "resolution_source": "NASA.gov",
  "resolution_date": "2030-01-01",
  "status": "open",
  "yes_price": 0.50,
  "no_price": 0.50,
  "volume": 0,
  "created_at": "2026-02-07T12:00:00.000Z"
}
```

**Error Responses:**

| Status | Body | When |
|--------|------|------|
| 400 | `{ "error": "Missing required fields" }` | Missing title, description, category, resolution_source, or resolution_date |
| 401 | `{ "error": "Unauthorized" }` | Not logged in |

**Example:**

```bash
curl -X POST http://localhost:3000/api/markets \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "title": "Will Mars colony be announced by 2030?",
    "description": "Resolves YES if any space agency officially announces plans",
    "category": "ai",
    "resolution_source": "NASA.gov",
    "resolution_date": "2030-01-01",
    "initial_yes_price": 0.15
  }'
```

---

## Orders

### Place Order

Place a buy order on a market. Requires authentication. The matching engine will immediately attempt to match the order against the opposite side of the book.

| | |
|---|---|
| **URL** | `POST /api/markets/:id/orders` |
| **Auth Required** | Yes |
| **Content-Type** | `application/json` |

**URL Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | The market ID |

**Request Body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `side` | string | Yes | `"yes"` or `"no"` |
| `type` | string | Yes | `"limit"` or `"market"` |
| `price` | number | Yes | Between 0.01 and 0.99 |
| `quantity` | integer | Yes | Positive integer |

**How it works:**

1. Your balance is debited: `price * quantity`
2. The order is placed on the book
3. The engine checks for matches on the opposite side
4. Matching rule: YES buy at `P` matches NO buy where `no_price >= (1 - P)`
5. If matched: trades are created, positions updated
6. If partially matched: remaining quantity stays on book (limit) or is cancelled (market)
7. Price improvement is refunded to the incoming order

**Success Response (201):**

```json
{
  "order": {
    "id": "order-uuid-...",
    "user_id": "user-uuid-...",
    "market_id": "market-uuid-...",
    "side": "yes",
    "type": "limit",
    "price": 0.60,
    "quantity": 10,
    "filled_quantity": 10,
    "status": "filled",
    "created_at": "2026-02-07T..."
  },
  "trades": [
    {
      "id": "trade-uuid-...",
      "market_id": "market-uuid-...",
      "buyer_order_id": "order-uuid-...",
      "seller_order_id": "resting-order-uuid-...",
      "price": 0.60,
      "quantity": 10,
      "created_at": "2026-02-07T..."
    }
  ],
  "tradesCount": 1
}
```

**Error Responses:**

| Status | Body | When |
|--------|------|------|
| 400 | `{ "error": "Missing required fields: side, type, price, quantity" }` | Missing fields |
| 400 | `{ "error": "Side must be \"yes\" or \"no\"" }` | Invalid side |
| 400 | `{ "error": "Type must be \"limit\" or \"market\"" }` | Invalid order type |
| 400 | `{ "error": "Price must be between 0.01 and 0.99" }` | Invalid price |
| 400 | `{ "error": "Quantity must be a positive integer" }` | Invalid quantity |
| 400 | `{ "error": "Insufficient balance" }` | Not enough funds |
| 400 | `{ "error": "Market is not open for trading" }` | Market resolved/cancelled |
| 401 | `{ "error": "Unauthorized" }` | Not logged in |

**Examples:**

```bash
# Buy 10 YES shares at $0.60 each (cost: $6.00)
curl -X POST "http://localhost:3000/api/markets/$MARKET_ID/orders" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"side":"yes","type":"limit","price":0.60,"quantity":10}'

# Buy 5 NO shares at $0.45 each (cost: $2.25)
curl -X POST "http://localhost:3000/api/markets/$MARKET_ID/orders" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"side":"no","type":"limit","price":0.45,"quantity":5}'

# Market order: buy 10 YES at best available price
curl -X POST "http://localhost:3000/api/markets/$MARKET_ID/orders" \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"side":"yes","type":"market","price":0.99,"quantity":10}'
```

**Understanding Order Matching:**

| Your Order | Matches With | Condition |
|-----------|-------------|-----------|
| Buy YES at $0.60 | Buy NO at $0.40+ | NO price >= (1 - 0.60) = 0.40 |
| Buy YES at $0.75 | Buy NO at $0.25+ | NO price >= (1 - 0.75) = 0.25 |
| Buy NO at $0.45 | Buy YES at $0.55+ | YES price >= (1 - 0.45) = 0.55 |
| Buy NO at $0.30 | Buy YES at $0.70+ | YES price >= (1 - 0.30) = 0.70 |

---

## Portfolio

### Get Portfolio

Get the authenticated user's positions, open orders, and P&L summary.

| | |
|---|---|
| **URL** | `GET /api/portfolio` |
| **Auth Required** | Yes |

**Success Response (200):**

```json
{
  "balance": 940.00,
  "positions": [
    {
      "id": "pos-uuid-...",
      "side": "yes",
      "shares": 10,
      "avg_price": 0.60,
      "realized_pnl": 0,
      "market_id": "market-uuid-...",
      "market_title": "Will BTC be above $110K by Dec 31, 2026?",
      "yes_price": 0.65,
      "no_price": 0.35,
      "market_status": "open",
      "current_price": 0.65,
      "unrealized_pnl": 0.50
    }
  ],
  "openOrders": [
    {
      "id": "order-uuid-...",
      "user_id": "user-uuid-...",
      "market_id": "market-uuid-...",
      "side": "yes",
      "type": "limit",
      "price": 0.55,
      "quantity": 20,
      "filled_quantity": 0,
      "status": "open",
      "created_at": "2026-02-07T...",
      "market_title": "Will BTC be above $110K?"
    }
  ],
  "totalUnrealizedPnl": 0.50,
  "totalRealizedPnl": 0.00
}
```

**Position P&L Calculation:**

- `current_price` = market's current `yes_price` (for YES positions) or `no_price` (for NO positions)
- `unrealized_pnl` = `(current_price - avg_price) * shares`
- Positive = profit, Negative = loss

**Error Response:**

| Status | Body | When |
|--------|------|------|
| 401 | `{ "error": "Unauthorized" }` | Not logged in |

**Example:**

```bash
curl http://localhost:3000/api/portfolio -b cookies.txt
```

---

## Leaderboard

### Get Leaderboard

Get the top 50 traders ranked by total P&L.

| | |
|---|---|
| **URL** | `GET /api/leaderboard` |
| **Auth Required** | No |

**Success Response (200):**

```json
[
  {
    "rank": 1,
    "id": "user-uuid-...",
    "username": "whale_trader",
    "balance": 3500.00,
    "totalPnl": 2500.00,
    "totalRealizedPnl": 500.00,
    "marketsTraded": 8,
    "tradeCount": 24
  },
  {
    "rank": 2,
    "id": "user-uuid-...",
    "username": "crypto_king",
    "balance": 2800.00,
    "totalPnl": 1800.00,
    "totalRealizedPnl": 300.00,
    "marketsTraded": 5,
    "tradeCount": 15
  },
  ...
]
```

**Ranking formula:** `balance - 1000 + total_realized_pnl` (i.e., how much better than starting $1,000)

**Field Definitions:**

| Field | Description |
|-------|-------------|
| `rank` | Position on leaderboard (1 = best) |
| `username` | Trader's display name |
| `balance` | Current cash balance |
| `totalPnl` | Total profit/loss vs starting balance |
| `totalRealizedPnl` | P&L from resolved markets only |
| `marketsTraded` | Number of distinct markets with open positions |
| `tradeCount` | Total number of executed trades |

**Example:**

```bash
curl http://localhost:3000/api/leaderboard
```

---

## Data Types Reference

### OrderSide

```typescript
type OrderSide = 'yes' | 'no';
```

### OrderType

```typescript
type OrderType = 'limit' | 'market';
```

- **limit**: Order sits on the book at specified price until matched or cancelled
- **market**: Matches immediately at best available price; unfilled portion is cancelled

### OrderStatus

```typescript
type OrderStatus = 'open' | 'filled' | 'partial' | 'cancelled';
```

- **open**: No shares filled yet, sitting on the book
- **partial**: Some shares filled, rest still on the book
- **filled**: All shares matched
- **cancelled**: Order was cancelled (manually or market order auto-cancel)

### MarketStatus

```typescript
type MarketStatus = 'open' | 'resolved_yes' | 'resolved_no' | 'cancelled';
```

- **open**: Trading is active
- **resolved_yes**: YES outcome confirmed, YES holders paid $1/share
- **resolved_no**: NO outcome confirmed, NO holders paid $1/share
- **cancelled**: Market voided, all positions refunded at avg cost

---

## Error Format

All error responses follow this format:

```json
{
  "error": "Human-readable error message"
}
```

Server errors (500) always return:

```json
{
  "error": "Internal server error"
}
```

---

## Rate Limits

There are no rate limits in development mode. For production deployment, consider adding rate limiting middleware.

---

## Cookie Authentication Details

| Cookie | Value | httpOnly | Secure | SameSite | Max-Age |
|--------|-------|----------|--------|----------|---------|
| `polycast_token` | JWT string | Yes | Yes (prod) | Lax | 7 days |

The JWT payload contains:

```json
{
  "userId": "uuid-string",
  "username": "alice",
  "iat": 1707300000,
  "exp": 1707904800
}
```

---

## Full Trading Workflow Example

Here's a complete workflow using `curl`:

```bash
# 1. Create an account
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"trader1","email":"trader1@test.com","password":"password123"}' \
  -c cookies.txt

# 2. List available markets
curl http://localhost:3000/api/markets

# 3. Get a specific market's details (replace with actual ID)
curl http://localhost:3000/api/markets/MARKET_ID_HERE

# 4. Buy 10 YES shares at $0.55
curl -X POST http://localhost:3000/api/markets/MARKET_ID_HERE/orders \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"side":"yes","type":"limit","price":0.55,"quantity":10}'

# 5. Check your portfolio
curl http://localhost:3000/api/portfolio -b cookies.txt

# 6. Check the leaderboard
curl http://localhost:3000/api/leaderboard

# 7. Log out
curl -X POST http://localhost:3000/api/auth/logout -b cookies.txt
```
