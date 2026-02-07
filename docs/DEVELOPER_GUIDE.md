# Polycast Developer Guide

**A Comprehensive Guide for C/C++/Java Developers New to Web Development**

This guide assumes you know C, C++, or Java but are completely new to web development, TypeScript, React, Next.js, Tailwind CSS, and SQLite. We'll explain everything step-by-step with no assumptions about prior web development knowledge.

---

## Table of Contents

1. [Prerequisites & Environment Setup](#1-prerequisites--environment-setup)
2. [Understanding the Tech Stack](#2-understanding-the-tech-stack)
3. [Project Architecture](#3-project-architecture)
4. [Directory Structure Walkthrough](#4-directory-structure-walkthrough)
5. [Database Schema](#5-database-schema)
6. [The CLOB Matching Engine](#6-the-clob-matching-engine-deep-dive)
7. [Authentication System](#7-authentication-system)
8. [How to Add a New Feature](#8-how-to-add-a-new-feature-step-by-step)
9. [How to Add a New API Endpoint](#9-how-to-add-a-new-api-endpoint)
10. [How to Add a New Page](#10-how-to-add-a-new-page)
11. [How to Add a New Component](#11-how-to-add-a-new-component)
12. [Common Pitfalls and Troubleshooting](#12-common-pitfalls-and-troubleshooting)
13. [Glossary](#13-glossary)

---

## 1. Prerequisites & Environment Setup

### What is Node.js and npm?

**Node.js** is a JavaScript runtime that lets you run JavaScript code outside of a browser. Think of it like this:

- **C/C++**: You write code → compile with `gcc` or `g++` → get executable
- **Java**: You write code → compile with `javac` → get `.class` files → run with `java`
- **JavaScript (traditional)**: You write code → runs only in web browsers
- **JavaScript (with Node.js)**: You write code → runs anywhere via Node.js runtime

Node.js is like the JVM for JavaScript. It provides the runtime environment to execute JavaScript code on servers, in build tools, and in development environments.

**npm** (Node Package Manager) is like Maven or Gradle for Java, or apt/yum for Linux. It:
- Downloads and manages third-party libraries (called "packages" or "dependencies")
- Stores them in a `node_modules/` folder in your project
- Runs scripts defined in `package.json`

### Installing Node.js 18+

**Windows:**
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version (18.x or newer)
3. Run the installer, accept defaults
4. Open Command Prompt or PowerShell and verify:
   ```bash
   node --version    # Should show v18.x.x or higher
   npm --version     # Should show 9.x.x or higher
   ```

**macOS:**
```bash
# Using Homebrew (recommended)
brew install node@18

# Or download installer from nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

### What is package.json?

`package.json` is like a `Makefile` (C/C++) or `pom.xml` (Maven) or `build.gradle` (Gradle). It defines:

1. **Project metadata**: name, version, description
2. **Dependencies**: third-party libraries your project needs
3. **Scripts**: commands you can run with `npm run <script-name>`

Here's our `package.json`:

```json
{
  "name": "polycast",
  "version": "0.1.0",
  "scripts": {
    "dev": "next dev",           // Start development server
    "build": "next build",       // Build for production
    "start": "next start",       // Run production build
    "test": "vitest",            // Run tests in watch mode
    "seed": "npx tsx src/lib/db/seed.ts"  // Populate database
  },
  "dependencies": {
    "bcryptjs": "^3.0.3",        // Password hashing
    "better-sqlite3": "^12.6.2", // SQLite database driver
    "jsonwebtoken": "^9.0.3",    // JWT token creation/verification
    "next": "14.2.35",           // Next.js framework
    "react": "^18",              // React library
    "react-dom": "^18",          // React DOM rendering
    "uuid": "^13.0.0"            // UUID generation
  },
  "devDependencies": {
    // Development-only dependencies (testing, types, etc.)
    "@testing-library/react": "^16.3.2",
    "typescript": "^5",
    "vitest": "^4.0.18",
    // ... more
  }
}
```

**Comparison to Java Maven:**

```xml
<!-- pom.xml in Maven -->
<dependencies>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-core</artifactId>
    <version>5.3.0</version>
  </dependency>
</dependencies>
```

vs.

```json
// package.json in npm
"dependencies": {
  "spring-core": "^5.3.0"
}
```

The `^` symbol means "accept minor version updates" (like `~` in some systems).

### What Does `npm install` Do?

When you run `npm install` in a project directory:

1. Reads `package.json`
2. Downloads all listed dependencies from the npm registry (https://npmjs.com)
3. Stores them in `node_modules/` folder (like Maven's `~/.m2/repository` but local to project)
4. Creates/updates `package-lock.json` (like Maven's dependency lock file)

**Comparison:**
- **C/C++**: Manual library installation or system package manager
- **Java**: `mvn install` downloads JARs to `~/.m2/repository`
- **Node.js**: `npm install` downloads packages to `./node_modules/`

### Getting Started

1. **Clone or navigate to the project:**
   ```bash
   cd polycast
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This downloads ~200MB of dependencies. It's normal. The `node_modules/` folder will be large.

3. **Seed the database:**
   ```bash
   npm run seed
   ```
   This creates `polycast.db` and populates it with sample data.

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Server starts at http://localhost:3000

5. **Verify everything works:**
   - Open browser to http://localhost:3000
   - You should see the Polycast homepage with markets
   - Try logging in with username `alice` password `password123`

### Verification Commands

```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# List installed packages
npm list --depth=0

# Check if development server is running
# Should show something on port 3000
netstat -an | grep 3000   # Linux/Mac
netstat -an | findstr 3000  # Windows
```

---

## 2. Understanding the Tech Stack

This section translates web technologies into concepts you already understand from C/C++/Java.

### TypeScript = C++ with Type Safety for JavaScript

**JavaScript** is dynamically typed (like Python):
```javascript
let x = 5;        // x is a number
x = "hello";      // now x is a string - totally fine!
```

**TypeScript** adds static typing (like C++ or Java):
```typescript
let x: number = 5;
x = "hello";      // ERROR: Type 'string' is not assignable to type 'number'
```

TypeScript compiles to JavaScript, just like C++ compiles to machine code.

**Compilation process:**
- **C++**: `source.cpp` → (g++) → `executable`
- **TypeScript**: `source.ts` → (tsc) → `source.js` → (Node.js/Browser) → runs

In Next.js, TypeScript compilation happens automatically when you run `npm run dev`.

**Type definitions:**
```typescript
// Like a C++ class definition or Java interface
interface User {
  id: string;
  username: string;
  email: string;
  balance: number;
}

// Using it
function getUser(id: string): User {
  // ...
  return { id: "123", username: "alice", email: "alice@test.com", balance: 1000 };
}
```

**Benefits over plain JavaScript:**
- Catch errors at compile-time, not runtime
- Better IDE autocomplete and refactoring
- Self-documenting code

### React = A UI Library

Think of **React** as a library for building user interfaces using reusable components.

**Comparison to OOP:**
- **Component** = Class with a `render()` method
- **Props** = Constructor parameters (immutable)
- **State** = Member variables (mutable)
- **JSX** = Template syntax (HTML inside JavaScript)

**Simple React component:**
```typescript
// Like a Java class
interface ButtonProps {
  label: string;
  onClick: () => void;
}

function Button({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick}>
      {label}
    </button>
  );
}

// Usage
<Button label="Click me" onClick={() => console.log("Clicked!")} />
```

**Comparison to traditional approaches:**

**Old way (plain HTML + jQuery):**
```html
<button id="myButton">Click me</button>
<script>
  $('#myButton').click(function() {
    alert('Clicked!');
  });
</script>
```

**React way:**
```typescript
function MyComponent() {
  const handleClick = () => alert('Clicked!');
  return <button onClick={handleClick}>Click me</button>;
}
```

**State example:**
```typescript
function Counter() {
  // Like a private member variable
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### Next.js = Framework Wrapping React

**Next.js** is to React what **Spring Boot** is to Java, or what **Rails** is to Ruby.

It provides:
1. **Routing**: URLs map to files automatically
2. **API Routes**: Backend endpoints alongside frontend code
3. **Server-Side Rendering**: HTML generated on server
4. **Build optimization**: Code splitting, image optimization, etc.

**Comparison:**
- **Java Spring Boot**: `@RestController` classes define API endpoints
- **Next.js**: Files in `src/app/api/` define API endpoints

### App Router = File-Based Routing

In Next.js 14, the **App Router** uses the filesystem for routing:

| File Path | URL | Purpose |
|-----------|-----|---------|
| `src/app/page.tsx` | `/` | Homepage |
| `src/app/about/page.tsx` | `/about` | About page |
| `src/app/markets/[id]/page.tsx` | `/markets/abc123` | Market detail (dynamic) |
| `src/app/api/auth/login/route.ts` | `/api/auth/login` | POST /api/auth/login endpoint |

**Special files:**
- `page.tsx` = A page component (renders at that URL)
- `route.ts` = An API endpoint (like a REST controller method)
- `layout.tsx` = A wrapper template (like a master page)
- `[id]` = Dynamic parameter (like `/users/:id` in Express)

**Comparison to Java Spring:**
```java
// Spring Boot
@RestController
@RequestMapping("/api/users")
public class UserController {
  @GetMapping("/{id}")
  public User getUser(@PathVariable String id) {
    // ...
  }
}
```

vs.

```typescript
// Next.js: src/app/api/users/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  // ...
  return Response.json({ user });
}
```

### Tailwind CSS = Utility-First CSS

Instead of writing CSS files, you apply CSS classes directly to HTML elements.

**Traditional CSS:**
```css
/* styles.css */
.button {
  background-color: blue;
  color: white;
  padding: 16px;
  border-radius: 8px;
}
```
```html
<button class="button">Click me</button>
```

**Tailwind CSS:**
```html
<button class="bg-blue-500 text-white p-4 rounded-lg">
  Click me
</button>
```

**Common Tailwind classes:**
- `text-red-500` = red text color
- `bg-blue-600` = blue background
- `p-4` = padding 16px (4 * 4px)
- `m-2` = margin 8px
- `rounded-lg` = large border radius
- `flex` = display: flex
- `justify-between` = justify-content: space-between

No separate CSS files needed! The classes map directly to CSS properties.

### SQLite via better-sqlite3 = Embedded Database

**SQLite** is like **H2** in Java or **SQLite** in C/C++.

- Single file database (`polycast.db`)
- No separate server process
- SQL is standard SQL you already know
- Synchronous API (unlike async databases in Node.js)

**Comparison:**
- **MySQL/PostgreSQL**: Client-server architecture, runs as separate process
- **SQLite**: Embedded, single file, perfect for development

**Usage:**
```typescript
import Database from 'better-sqlite3';

const db = new Database('polycast.db');

// Prepare statement (like JDBC PreparedStatement)
const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
const user = stmt.get(userId);

// Insert
db.prepare('INSERT INTO users (id, username, email) VALUES (?, ?, ?)')
  .run(id, username, email);
```

### Vitest = Test Runner

**Vitest** is like **JUnit** for JavaScript/TypeScript.

**Comparison:**

**JUnit (Java):**
```java
public class CalculatorTest {
  @Test
  public void testAddition() {
    Calculator calc = new Calculator();
    assertEquals(4, calc.add(2, 2));
  }
}
```

**Vitest (TypeScript):**
```typescript
import { describe, it, expect } from 'vitest';

describe('Calculator', () => {
  it('should add two numbers', () => {
    const calc = new Calculator();
    expect(calc.add(2, 2)).toBe(4);
  });
});
```

**Test anatomy:**
- `describe()` = Test class/suite
- `it()` or `test()` = Individual test method
- `expect()` = Assertion (like JUnit's `assertEquals`)

---

## 3. Project Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React Components (src/components/, src/app/)         │   │
│  │  - TradePanel.tsx                                     │   │
│  │  - MarketCard.tsx                                     │   │
│  │  - OrderBook.tsx                                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │
                             │ HTTP requests (fetch)
                             │ POST /api/markets/{id}/orders
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                      Next.js Server                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  API Routes (src/app/api/*/route.ts)                 │   │
│  │  - POST /api/markets/[id]/orders                     │   │
│  │  - GET /api/markets/[id]                             │   │
│  │  - POST /api/auth/login                              │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                │
│                             │ Function calls                 │
│                             ▼                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Business Logic (src/lib/engine/)                    │   │
│  │  - OrderBook.placeOrder()                            │   │
│  │  - Market.resolveMarket()                            │   │
│  │  - Auth functions                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                             │                                │
│                             │ SQL queries                    │
│                             ▼                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Database Layer (src/lib/db/)                        │   │
│  │  - connection.ts (SQLite connection)                 │   │
│  │  - schema.ts (table definitions)                     │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  forecast.db    │
                    │  (SQLite file)  │
                    └─────────────────┘
```

### Data Flow Example: Placing a Trade

Let's trace what happens when a user places a trade:

**Step 1: User Action (Browser)**
```typescript
// src/components/TradePanel.tsx
const handleSubmit = async (e) => {
  const response = await fetch(`/api/markets/${marketId}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      side: 'yes',
      type: 'limit',
      price: 0.65,
      quantity: 10
    })
  });
};
```

**Step 2: API Route Receives Request (Next.js Server)**
```typescript
// src/app/api/markets/[id]/orders/route.ts
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Parse request
  const { side, type, price, quantity } = await request.json();

  // Get current user from JWT cookie
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  // Call business logic
  const db = initializeDatabase();
  const orderBook = new OrderBook(db);
  const result = orderBook.placeOrder(user.id, params.id, side, type, price, quantity);

  if (result.error) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(result);
}
```

**Step 3: Business Logic Executes (OrderBook class)**
```typescript
// src/lib/engine/orderbook.ts
placeOrder(userId, marketId, side, type, price, quantity) {
  // 1. Validate inputs
  if (price < 0.01 || price > 0.99) return { error: '...' };

  // 2. Check market is open
  const market = db.prepare('SELECT status FROM markets WHERE id = ?').get(marketId);
  if (market.status !== 'open') return { error: '...' };

  // 3. Check user balance
  const user = db.prepare('SELECT balance FROM users WHERE id = ?').get(userId);
  const cost = price * quantity;
  if (user.balance < cost) return { error: 'Insufficient balance' };

  // 4. Debit user balance
  db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(cost, userId);

  // 5. Insert order
  const orderId = uuid();
  db.prepare('INSERT INTO orders (...) VALUES (...)').run(...);

  // 6. Try to match with opposite side orders
  const trades = this.matchOrder(order);

  // 7. Update positions
  this.updatePosition(userId, marketId, side, fillQty, price);

  return { order, trades };
}
```

**Step 4: Database Updates (SQLite)**
```sql
-- Debit user balance
UPDATE users SET balance = balance - 6.50 WHERE id = 'user123';

-- Insert order
INSERT INTO orders (id, user_id, market_id, side, type, price, quantity, ...)
VALUES ('order123', 'user123', 'market456', 'yes', 'limit', 0.65, 10, ...);

-- If matched, insert trade
INSERT INTO trades (id, market_id, buyer_order_id, seller_order_id, price, quantity)
VALUES ('trade789', 'market456', 'order123', 'order999', 0.65, 10);

-- Update position
UPDATE positions SET shares = shares + 10, avg_price = 0.65
WHERE user_id = 'user123' AND market_id = 'market456' AND side = 'yes';

-- Update market price
UPDATE markets SET yes_price = 0.65, no_price = 0.35, volume = volume + 6.50
WHERE id = 'market456';
```

**Step 5: Response Returns to Browser**
```json
{
  "order": {
    "id": "order123",
    "status": "filled",
    "filled_quantity": 10,
    ...
  },
  "trades": [
    {
      "id": "trade789",
      "price": 0.65,
      "quantity": 10,
      ...
    }
  ]
}
```

**Step 6: UI Updates**
```typescript
// TradePanel.tsx
if (response.ok) {
  setSuccess(true);
  setShares('');
  // Market page re-fetches data and updates OrderBook, PriceChart, etc.
}
```

---

## 4. Directory Structure Walkthrough

### Top-Level Structure

```
polycast/
├── src/                    # All source code
│   ├── app/               # Next.js pages and API routes
│   ├── components/        # Reusable React components
│   └── lib/               # Business logic and utilities
├── tests/                 # Test files
├── docs/                  # Documentation
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── vitest.config.ts       # Test configuration
├── polycast.db            # SQLite database (created on first run)
└── node_modules/          # Installed dependencies (don't edit)
```

### src/app/ — Pages and API Routes

This folder uses Next.js App Router conventions. Each folder can contain:
- `page.tsx` = A page component (browser UI)
- `route.ts` = An API endpoint (server logic)
- `layout.tsx` = A layout wrapper
- `[param]` = Dynamic route segment

#### Root Files

**`src/app/layout.tsx`** — Root layout wrapping all pages
```typescript
// Like a master template in traditional web frameworks
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />      {/* Shows on every page */}
        {children}      {/* Page content goes here */}
      </body>
    </html>
  );
}
```

**`src/app/page.tsx`** — Homepage at `/`
- Shows grid of all markets
- Uses `CategoryFilter` to filter by category
- Uses `MarketCard` component for each market
- Fetches data from `/api/markets`

**`src/app/globals.css`** — Global CSS styles
- CSS custom properties (variables) for theming
- Tailwind directives
- Base styles

#### Pages

**`src/app/markets/[id]/page.tsx`** — Market detail page at `/markets/{id}`

Dynamic route where `[id]` is the market ID.

```typescript
export default async function MarketPage({ params }) {
  const { id } = await params;  // MUST await in Next.js 14+

  // Fetch market data
  const response = await fetch(`http://localhost:3000/api/markets/${id}`);
  const { market, orderBook } = await response.json();

  return (
    <div>
      <h1>{market.title}</h1>
      <TradePanel marketId={id} yesPrice={market.yes_price} noPrice={market.no_price} />
      <OrderBook yesBids={orderBook.yesBids} noBids={orderBook.noBids} />
      <PriceChart marketId={id} />
    </div>
  );
}
```

**`src/app/auth/login/page.tsx`** — Login form at `/auth/login`
- Form with username and password fields
- POSTs to `/api/auth/login`
- On success, redirects to homepage

**`src/app/auth/signup/page.tsx`** — Signup form at `/auth/signup`
- Form with username, email, password
- POSTs to `/api/auth/signup`
- Creates new user account

**`src/app/leaderboard/page.tsx`** — Leaderboard at `/leaderboard`
- Fetches from `/api/leaderboard`
- Shows users sorted by balance
- Uses `LeaderboardRow` component

**`src/app/portfolio/page.tsx`** — User portfolio at `/portfolio`
- Shows user's current positions
- Requires authentication
- Fetches from `/api/portfolio`
- Uses `PositionRow` component

#### API Routes

All files named `route.ts` define HTTP endpoints.

**`src/app/api/auth/signup/route.ts`** — `POST /api/auth/signup`

Creates new user account.

```typescript
export async function POST(request: Request) {
  const { username, email, password } = await request.json();

  // Validate inputs
  if (!username || !email || !password) {
    return Response.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Hash password
  const passwordHash = hashPassword(password);

  // Insert user
  const db = initializeDatabase();
  const userId = uuid();
  db.prepare('INSERT INTO users (id, username, email, password_hash) VALUES (?, ?, ?, ?)')
    .run(userId, username, email, passwordHash);

  // Create JWT token
  const token = createToken({ userId, username });
  await setAuthCookie(token);

  return Response.json({ success: true });
}
```

**`src/app/api/auth/login/route.ts`** — `POST /api/auth/login`

Authenticates user and sets JWT cookie.

```typescript
export async function POST(request: Request) {
  const { username, password } = await request.json();

  // Find user
  const db = initializeDatabase();
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return Response.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  // Create token and set cookie
  const token = createToken({ userId: user.id, username: user.username });
  await setAuthCookie(token);

  return Response.json({ success: true });
}
```

**`src/app/api/auth/logout/route.ts`** — `POST /api/auth/logout`

Clears authentication cookie.

```typescript
export async function POST() {
  await clearAuthCookie();
  return Response.json({ success: true });
}
```

**`src/app/api/auth/me/route.ts`** — `GET /api/auth/me`

Returns current user info from JWT token.

```typescript
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 });
  }
  return Response.json(user);
}
```

**`src/app/api/markets/route.ts`** — `GET /api/markets` and `POST /api/markets`

```typescript
// GET: List all markets
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');  // ?category=Politics

  const db = initializeDatabase();
  let query = 'SELECT * FROM markets WHERE status = "open" ORDER BY created_at DESC';
  let markets;

  if (category && category !== 'all') {
    markets = db.prepare(query.replace('WHERE', 'WHERE category = ? AND')).all(category);
  } else {
    markets = db.prepare(query).all();
  }

  return Response.json({ markets });
}

// POST: Create new market (admin only)
export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { title, description, category, resolution_source, resolution_date } = await request.json();

  const db = initializeDatabase();
  const marketId = uuid();
  db.prepare(
    'INSERT INTO markets (id, title, description, category, resolution_source, resolution_date) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(marketId, title, description, category, resolution_source, resolution_date);

  return Response.json({ market: { id: marketId, ... } });
}
```

**`src/app/api/markets/[id]/route.ts`** — `GET /api/markets/{id}`

Returns single market with order book.

```typescript
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;  // MUST await

  const db = initializeDatabase();
  const market = db.prepare('SELECT * FROM markets WHERE id = ?').get(id);

  if (!market) {
    return Response.json({ error: 'Market not found' }, { status: 404 });
  }

  const orderBook = new OrderBook(db);
  const { yesBids, noBids } = orderBook.getOrderBook(id);

  return Response.json({ market, orderBook: { yesBids, noBids } });
}
```

**`src/app/api/markets/[id]/orders/route.ts`** — `POST /api/markets/{id}/orders`

Places a new order (the core trading endpoint).

```typescript
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id: marketId } = await params;
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { side, type, price, quantity } = await request.json();

  const db = initializeDatabase();
  const orderBook = new OrderBook(db);
  const result = orderBook.placeOrder(user.id, marketId, side, type, price, quantity);

  if (result.error) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json(result);
}
```

**`src/app/api/portfolio/route.ts`** — `GET /api/portfolio`

Returns current user's positions.

```typescript
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const db = initializeDatabase();
  const positions = db.prepare(
    `SELECT p.*, m.title as market_title, m.status, m.yes_price, m.no_price
     FROM positions p
     JOIN markets m ON p.market_id = m.id
     WHERE p.user_id = ? AND p.shares > 0
     ORDER BY p.id DESC`
  ).all(user.id);

  return Response.json({ positions });
}
```

**`src/app/api/leaderboard/route.ts`** — `GET /api/leaderboard`

Returns users sorted by balance.

```typescript
export async function GET() {
  const db = initializeDatabase();
  const users = db.prepare(
    'SELECT id, username, balance FROM users ORDER BY balance DESC LIMIT 50'
  ).all();

  return Response.json({ users });
}
```

### src/components/ — Reusable UI Components

All React components are isolated, reusable UI pieces.

**`Navbar.tsx`** — Navigation bar at top of every page

Props: none (fetches current user itself)

Features:
- Shows app logo/title
- Links to home, leaderboard, portfolio
- Shows "Login" or user menu if logged in
- Logout button

```typescript
export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.ok ? res.json() : null)
      .then(data => setUser(data?.user));
  }, []);

  return (
    <nav>
      <Link href="/">Polycast</Link>
      <Link href="/leaderboard">Leaderboard</Link>
      {user ? (
        <>
          <Link href="/portfolio">Portfolio</Link>
          <span>{user.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link href="/auth/login">Login</Link>
      )}
    </nav>
  );
}
```

**`MarketCard.tsx`** — Single market preview card

Props:
```typescript
interface MarketCardProps {
  id: string;
  title: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume: number;
}
```

Displays:
- Market title
- Category badge
- Current YES/NO prices
- Trading volume
- Link to market detail page

Used in: Homepage market grid

**`CategoryFilter.tsx`** — Category filter buttons

Props:
```typescript
interface CategoryFilterProps {
  selected: string;
  onSelect: (category: string) => void;
}
```

Displays buttons for: All, Politics, Sports, Crypto, Entertainment, Science, Other

Used in: Homepage to filter markets

**`OrderBook.tsx`** — Order book display

Props:
```typescript
interface OrderBookProps {
  yesBids: Order[];
  noBids: Order[];
}
```

Displays:
- Two columns: YES bids and NO bids
- Price and quantity for each order
- Aggregated by price level
- Color-coded (green for YES, red for NO)

Used in: Market detail page

**`TradePanel.tsx`** — Trade order form

Props:
```typescript
interface TradePanelProps {
  marketId: string;
  yesPrice: number;
  noPrice: number;
}
```

Features:
- Toggle between YES and NO
- Price input (pre-filled with current market price)
- Quantity input
- Shows total cost and potential profit
- Submit button
- Error/success messages
- Checks if user is logged in

This is the main trading interface. See full implementation in Section 8.

**`PriceChart.tsx`** — Price history chart

Props:
```typescript
interface PriceChartProps {
  marketId: string;
}
```

Displays line chart of YES price over time (based on trades).

Currently simplified; could be enhanced with charting library.

**`LeaderboardRow.tsx`** — Single row in leaderboard table

Props:
```typescript
interface LeaderboardRowProps {
  rank: number;
  username: string;
  balance: number;
}
```

Used in: Leaderboard page

**`PositionRow.tsx`** — Single row in portfolio table

Props:
```typescript
interface PositionRowProps {
  marketTitle: string;
  side: 'yes' | 'no';
  shares: number;
  avgPrice: number;
  currentPrice: number;
  unrealizedPnl: number;
}
```

Displays user's position in a market with current P&L.

Used in: Portfolio page

### src/lib/ — Business Logic

This is where the "backend" logic lives (even though it runs on the server side of Next.js).

#### src/lib/engine/ — Trading Engine

**`types.ts`** — TypeScript type definitions

All interfaces used throughout the app:
- `Order`, `Trade`, `Market`, `Position`, `User`
- Enums: `OrderSide`, `OrderType`, `OrderStatus`, `MarketStatus`

Think of this as header files in C++ or interfaces in Java.

**`orderbook.ts`** — The CLOB matching engine

The heart of the application. This class handles all order placement and matching logic.

Main methods:
- `placeOrder()` — Place new order, match if possible
- `matchOrder()` — Match incoming order with opposite side
- `cancelOrder()` — Cancel an open order
- `getOrderBook()` — Get current order book for a market
- `updatePosition()` — Update user's position after trade
- `updateOrderStatus()` — Update order status (open/partial/filled)

See Section 6 for deep dive.

**`market.ts`** — Market lifecycle management

Functions for:
- Creating markets
- Resolving markets (YES or NO)
- Cancelling markets
- Calculating payouts

```typescript
export function resolveMarket(db: Database, marketId: string, outcome: 'yes' | 'no') {
  // 1. Set market status
  db.prepare("UPDATE markets SET status = ? WHERE id = ?")
    .run(`resolved_${outcome}`, marketId);

  // 2. Get all positions
  const positions = db.prepare('SELECT * FROM positions WHERE market_id = ?').all(marketId);

  // 3. Pay winners
  for (const pos of positions) {
    if (pos.side === outcome && pos.shares > 0) {
      const payout = pos.shares * 1.00;  // Each share pays $1
      db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
        .run(payout, pos.user_id);
    }
    // Losers get nothing (already paid when placing order)
  }
}
```

#### src/lib/db/ — Database Layer

**`connection.ts`** — Database connection setup

```typescript
import Database from 'better-sqlite3';

let db: Database.Database | null = null;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database('polycast.db');
    db.pragma('journal_mode = WAL');  // Write-Ahead Logging for better concurrency
  }
  return db;
}
```

**`schema.ts`** — Table definitions (SQL CREATE TABLE statements)

Exports string constants with SQL DDL:
- `CREATE_USERS_TABLE`
- `CREATE_MARKETS_TABLE`
- `CREATE_ORDERS_TABLE`
- `CREATE_TRADES_TABLE`
- `CREATE_POSITIONS_TABLE`

**`migrations.ts`** — Run migrations

```typescript
import { getDatabase } from './connection';
import { ALL_TABLES } from './schema';

export function runMigrations() {
  const db = getDatabase();
  for (const tableSql of ALL_TABLES) {
    db.exec(tableSql);
  }
}
```

**`seed.ts`** — Seed database with sample data

Run with `npm run seed`.

Creates:
- 10 sample users (alice, bob, charlie, etc.) all with password `password123`
- 15 sample markets across all categories
- Initial positions for some users

**`index.ts`** — Initialize database on first access

```typescript
import { getDatabase } from './connection';
import { runMigrations } from './migrations';

let initialized = false;

export function initializeDatabase() {
  if (!initialized) {
    const db = getDatabase();
    runMigrations();
    initialized = true;
  }
  return getDatabase();
}
```

#### Other lib files

**`auth.ts`** — Authentication utilities

Functions:
- `hashPassword()` — Hash password with bcrypt
- `verifyPassword()` — Compare password with hash
- `createToken()` — Create JWT token
- `verifyToken()` — Verify and decode JWT token
- `setAuthCookie()` — Set HTTP-only cookie with token
- `clearAuthCookie()` — Delete auth cookie
- `getCurrentUser()` — Get current user from cookie

See Section 7 for details.

**`utils.ts`** — Utility functions

Helpers for:
- Formatting prices: `formatPrice(0.65)` → "$0.65"
- Formatting percentages: `formatPercent(0.65)` → "65%"
- Category list: `CATEGORIES = ['Politics', 'Sports', ...]`
- Date formatting

### tests/ — Test Files

Mirror structure of `src/`:

```
tests/
├── engine/
│   ├── orderbook.test.ts
│   └── market.test.ts
├── api/
│   ├── auth.test.ts
│   └── markets.test.ts
└── components/
    └── TradePanel.test.tsx
```

Example test:

```typescript
// tests/engine/orderbook.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { OrderBook } from '../../src/lib/engine/orderbook';

describe('OrderBook', () => {
  let db: Database.Database;
  let orderBook: OrderBook;

  beforeEach(() => {
    db = new Database(':memory:');  // In-memory DB for testing
    // Run migrations
    // ...
    orderBook = new OrderBook(db);
  });

  it('should place a limit order', () => {
    const result = orderBook.placeOrder('user1', 'market1', 'yes', 'limit', 0.65, 10);

    expect(result.order).toBeDefined();
    expect(result.order.status).toBe('open');
    expect(result.order.quantity).toBe(10);
  });

  it('should match orders when prices cross', () => {
    // User1 bids YES at 0.65
    orderBook.placeOrder('user1', 'market1', 'yes', 'limit', 0.65, 10);

    // User2 bids NO at 0.40 (complement = 0.60, crosses with 0.65)
    const result = orderBook.placeOrder('user2', 'market1', 'no', 'limit', 0.40, 10);

    expect(result.trades.length).toBeGreaterThan(0);
    expect(result.order.status).toBe('filled');
  });
});
```

---

## 5. Database Schema

Our database has 5 tables with foreign key relationships.

### Tables

#### 1. users

Stores user accounts.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| username | TEXT | UNIQUE NOT NULL | Login username |
| email | TEXT | UNIQUE NOT NULL | Email address |
| password_hash | TEXT | NOT NULL | bcrypt hash of password |
| balance | REAL | NOT NULL DEFAULT 1000.0 | Virtual currency balance |
| created_at | TEXT | NOT NULL DEFAULT now | Account creation timestamp |

**Indexes:** Unique on username, unique on email

#### 2. markets

Stores prediction markets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| title | TEXT | NOT NULL | Market question |
| description | TEXT | NOT NULL | Detailed description |
| category | TEXT | NOT NULL | Politics, Sports, Crypto, etc. |
| resolution_source | TEXT | NOT NULL | How market will be resolved |
| resolution_date | TEXT | NOT NULL | When market resolves |
| status | TEXT | NOT NULL DEFAULT 'open' | open, resolved_yes, resolved_no, cancelled |
| yes_price | REAL | NOT NULL DEFAULT 0.50 | Current YES price (0.01-0.99) |
| no_price | REAL | NOT NULL DEFAULT 0.50 | Current NO price (always 1 - yes_price) |
| volume | REAL | NOT NULL DEFAULT 0.0 | Total trading volume |
| created_at | TEXT | NOT NULL DEFAULT now | Market creation timestamp |

**Invariant:** `yes_price + no_price = 1.00`

#### 3. orders

Stores all orders (both open and filled).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| user_id | TEXT | FOREIGN KEY → users(id) | User who placed order |
| market_id | TEXT | FOREIGN KEY → markets(id) | Market being traded |
| side | TEXT | CHECK IN ('yes', 'no') | YES or NO |
| type | TEXT | CHECK IN ('limit', 'market') | Limit or market order |
| price | REAL | CHECK 0.01 ≤ price ≤ 0.99 | Limit price |
| quantity | INTEGER | CHECK > 0 | Number of shares |
| filled_quantity | INTEGER | NOT NULL DEFAULT 0 | Shares filled so far |
| status | TEXT | CHECK IN ('open', 'filled', 'partial', 'cancelled') | Order status |
| created_at | TEXT | NOT NULL DEFAULT now | Order placement time |

**Indexes:**
- Index on (market_id, side, status) for fast order book queries
- Index on user_id for user's order history

#### 4. trades

Records each executed trade.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| market_id | TEXT | FOREIGN KEY → markets(id) | Market traded |
| buyer_order_id | TEXT | FOREIGN KEY → orders(id) | Incoming order ID |
| seller_order_id | TEXT | FOREIGN KEY → orders(id) | Resting order ID |
| price | REAL | NOT NULL | Execution price (YES price) |
| quantity | INTEGER | NOT NULL | Shares traded |
| created_at | TEXT | NOT NULL DEFAULT now | Trade execution time |

**Note:** In a binary market, both sides are "buying" their outcome, so buyer/seller is somewhat arbitrary. We use buyer_order_id for the incoming order and seller_order_id for the resting order.

#### 5. positions

Tracks user positions in markets.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | TEXT | PRIMARY KEY | UUID |
| user_id | TEXT | FOREIGN KEY → users(id) | Position owner |
| market_id | TEXT | FOREIGN KEY → markets(id) | Market |
| side | TEXT | CHECK IN ('yes', 'no') | YES or NO |
| shares | INTEGER | NOT NULL DEFAULT 0 | Current shares held |
| avg_price | REAL | NOT NULL DEFAULT 0.0 | Weighted average purchase price |
| realized_pnl | REAL | NOT NULL DEFAULT 0.0 | Realized profit/loss from closed trades |

**Unique constraint:** (user_id, market_id, side)

Each user can have at most 2 positions per market (one YES, one NO).

### Entity-Relationship Diagram

```
┌─────────────────┐
│     users       │
│─────────────────│
│ id (PK)         │
│ username        │
│ email           │
│ password_hash   │
│ balance         │
│ created_at      │
└─────────────────┘
        │
        │ 1:N
        │
        ▼
┌─────────────────┐         ┌─────────────────┐
│    orders       │    N:1  │    markets      │
│─────────────────│─────────│─────────────────│
│ id (PK)         │         │ id (PK)         │
│ user_id (FK)    │         │ title           │
│ market_id (FK)  │◄────────│ description     │
│ side            │         │ category        │
│ type            │         │ status          │
│ price           │         │ yes_price       │
│ quantity        │         │ no_price        │
│ filled_quantity │         │ volume          │
│ status          │         │ created_at      │
│ created_at      │         └─────────────────┘
└─────────────────┘                  │
        │                            │
        │ N:M (via trades)           │ 1:N
        │                            │
        ▼                            ▼
┌─────────────────┐         ┌─────────────────┐
│     trades      │         │   positions     │
│─────────────────│         │─────────────────│
│ id (PK)         │         │ id (PK)         │
│ market_id (FK)  │         │ user_id (FK)    │
│ buyer_order_id  │         │ market_id (FK)  │
│ seller_order_id │         │ side            │
│ price           │         │ shares          │
│ quantity        │         │ avg_price       │
│ created_at      │         │ realized_pnl    │
└─────────────────┘         └─────────────────┘
```

### Key Relationships

1. **User → Orders**: One user can place many orders
2. **Market → Orders**: One market can have many orders
3. **Order → Trades**: One order can participate in many trades (via partial fills)
4. **Market → Trades**: One market can have many trades
5. **User → Positions**: One user can have many positions (max 2 per market)
6. **Market → Positions**: One market can have many positions (from different users)

### Sample Queries

**Get all open orders for a market:**
```sql
SELECT * FROM orders
WHERE market_id = ? AND status IN ('open', 'partial')
ORDER BY price DESC, created_at ASC;
```

**Get user's portfolio:**
```sql
SELECT p.*, m.title, m.status, m.yes_price, m.no_price
FROM positions p
JOIN markets m ON p.market_id = m.id
WHERE p.user_id = ? AND p.shares > 0
ORDER BY p.created_at DESC;
```

**Get recent trades for a market:**
```sql
SELECT * FROM trades
WHERE market_id = ?
ORDER BY created_at DESC
LIMIT 50;
```

**Get user's balance:**
```sql
SELECT balance FROM users WHERE id = ?;
```

**Update market price after trade:**
```sql
UPDATE markets
SET yes_price = ?, no_price = ?, volume = volume + ?
WHERE id = ?;
```

---

## 6. The CLOB Matching Engine (Deep Dive)

This is the most important part of Forecast. The CLOB (Central Limit Order Book) is how orders are matched and trades are executed.

### What is a CLOB?

A **Central Limit Order Book** is a system that:
1. Collects all buy and sell orders for an asset
2. Orders them by price and time
3. Matches buyers with sellers when prices cross
4. Executes trades automatically

Think of it like an auction where:
- Buyers place bids ("I'll buy at $0.60")
- Sellers place asks ("I'll sell at $0.40")
- When a buyer's price ≥ seller's price, they trade

### Binary Market Invariant

In a binary prediction market, **YES + NO = $1.00** always.

This means:
- If YES = $0.65, then NO = $0.35
- If you buy 1 YES share at $0.65, you pay $0.65
- If YES wins, you get $1.00 (profit = $0.35)
- If YES loses, you get $0.00 (loss = $0.65)

**Key insight:** Both sides are "buying" their outcome. There's no traditional "seller". A YES buyer matches with a NO buyer when their prices complement to ≥ $1.00.

Example:
- Alice bids YES at $0.65
- Bob bids NO at $0.40
- Complement: $0.65 + $0.40 = $1.05 ≥ $1.00 ✓ Match!
- Trade executes at YES price = $0.60 (midpoint or price improvement)

### How Matching Works (Step by Step)

Let's trace a concrete example.

**Initial state:**
- Market: "Will Bitcoin hit $100k in 2026?"
- Order book is empty
- Alice has $1000 balance
- Bob has $1000 balance

**Step 1: Alice places YES limit order at $0.60 for 10 shares**

```typescript
orderBook.placeOrder('alice', 'market1', 'yes', 'limit', 0.60, 10);
```

Actions:
1. Validate: price = $0.60 ✓, quantity = 10 ✓, market open ✓
2. Check balance: cost = $0.60 × 10 = $6.00, Alice has $1000 ✓
3. Debit Alice: $1000 - $6.00 = $994.00
4. Insert order into `orders` table
5. Try to match: Look for NO orders where `no_price ≥ (1 - 0.60) = 0.40`
6. No matching orders found
7. Order stays in book as "open"

**Order book after Step 1:**
```
YES Bids:
  $0.60 × 10 shares (Alice)

NO Bids:
  (empty)
```

Alice's balance: $994.00 (has $6.00 reserved in order)

**Step 2: Bob places NO limit order at $0.45 for 5 shares**

```typescript
orderBook.placeOrder('bob', 'market1', 'no', 'limit', 0.45, 5);
```

Actions:
1. Validate: price = $0.45 ✓, quantity = 5 ✓
2. Check balance: cost = $0.45 × 5 = $2.25, Bob has $1000 ✓
3. Debit Bob: $1000 - $2.25 = $997.75
4. Insert order
5. Try to match: Look for YES orders where `yes_price ≥ (1 - 0.45) = 0.55`
   - Alice's order: $0.60 ≥ $0.55 ✓ MATCH!
6. Match 5 shares (min of Bob's 5 and Alice's 10)
7. Trade price: YES = $0.60 (Alice's price, as she was resting)
   - Alice gets 5 YES shares at $0.60 each
   - Bob gets 5 NO shares at $0.40 each ($1.00 - $0.60)
8. Price improvement for Bob:
   - Bob offered to pay $0.45 for NO
   - Bob only pays $0.40 for NO
   - Refund: ($0.45 - $0.40) × 5 = $0.25
9. Create trade record
10. Update Alice's order: filled_quantity = 5, status = 'partial' (5 of 10 filled)
11. Update Bob's order: filled_quantity = 5, status = 'filled' (5 of 5 filled)
12. Update positions:
    - Alice: +5 YES shares at avg_price $0.60
    - Bob: +5 NO shares at avg_price $0.40
13. Update market: yes_price = $0.60, no_price = $0.40, volume += $3.00

**Order book after Step 2:**
```
YES Bids:
  $0.60 × 5 shares (Alice, partial)

NO Bids:
  (empty)
```

Alice's balance: $994.00 (still reserved, but now has 5 YES shares worth $0.60 each)
Bob's balance: $997.75 + $0.25 refund = $998.00 (has 5 NO shares worth $0.40 each)

**Trade record:**
```
{
  id: "trade123",
  market_id: "market1",
  buyer_order_id: "bob_order",
  seller_order_id: "alice_order",
  price: 0.60,  // YES price
  quantity: 5,
  created_at: "2026-02-07T12:00:00Z"
}
```

### The Matching Algorithm (Pseudocode)

```python
def matchOrder(incoming_order):
    trades = []
    opposite_side = 'no' if incoming_order.side == 'yes' else 'yes'

    # Calculate complement price
    # For YES buy at $0.60, we need NO buys at $0.40 or higher
    complement_price = 1.00 - incoming_order.price

    # Get matching orders from opposite side
    # Sorted by best price first (highest price = best for counterparty)
    # Then by time (earliest first) for price-time priority
    matching_orders = query(
        "SELECT * FROM orders WHERE market_id = ? AND side = ? AND status IN ('open', 'partial') AND price >= ? ORDER BY price DESC, created_at ASC",
        incoming_order.market_id, opposite_side, complement_price
    )

    remaining_qty = incoming_order.quantity - incoming_order.filled_quantity

    for match_order in matching_orders:
        if remaining_qty <= 0:
            break

        # Don't match against own orders
        if match_order.user_id == incoming_order.user_id:
            continue

        available_qty = match_order.quantity - match_order.filled_quantity
        fill_qty = min(remaining_qty, available_qty)

        # Determine trade price
        # Resting order gets their price (or better)
        # Incoming order gets price improvement
        if incoming_order.side == 'yes':
            trade_yes_price = 1.00 - match_order.price  # Match is NO order
        else:
            trade_yes_price = 1.00 - incoming_order.price  # Incoming is NO

        # Create trade
        trade = create_trade(incoming_order, match_order, trade_yes_price, fill_qty)
        trades.append(trade)

        # Update fill quantities
        incoming_order.filled_quantity += fill_qty
        match_order.filled_quantity += fill_qty

        # Update statuses
        update_order_status(incoming_order)
        update_order_status(match_order)

        # Refund price improvement to incoming order
        if incoming_order.side == 'yes':
            price_diff = incoming_order.price - trade_yes_price
        else:
            price_diff = incoming_order.price - (1.00 - trade_yes_price)

        if price_diff > 0.001:  # Only if significant
            refund_user(incoming_order.user_id, price_diff * fill_qty)

        # Update positions
        update_position(incoming_order.user_id, market_id, incoming_order.side, fill_qty, ...)
        update_position(match_order.user_id, market_id, match_order.side, fill_qty, ...)

        # Update market price and volume
        update_market(market_id, trade_yes_price, fill_qty)

        remaining_qty -= fill_qty

    return trades
```

### Price-Time Priority

The order book uses **price-time priority**:

1. **Price priority**: Better prices match first
   - For YES buyers: higher prices match first
   - For NO buyers: higher prices match first
   - Example: $0.65 YES bid matches before $0.60 YES bid

2. **Time priority**: At same price, earlier orders match first
   - First come, first served
   - Example: Two $0.60 YES bids, the earlier one matches first

### Partial Fills

Orders can be partially filled:

- Alice places YES order: 10 shares at $0.60
- Bob places NO order: 5 shares at $0.40
- Result: 5 shares trade, Alice has 5 remaining
- Alice's order status: "partial" (not "filled" or "open")

The unfilled portion stays in the order book.

### Market Orders vs Limit Orders

**Limit Order:**
- Specifies exact price
- Only executes at that price or better
- May not fill immediately
- Example: "Buy YES at $0.60 or better"

**Market Order:**
- No price limit
- Executes at best available price
- Fills immediately (or cancels if no liquidity)
- Example: "Buy YES at whatever price available"

In our implementation:
- Market orders use price = $0.99 (for YES) or $0.99 (for NO)
- If not fully filled immediately, the remainder is cancelled
- Unfilled portion is refunded

### Position Tracking

Each trade updates both users' positions:

**Position update logic:**
```python
def updatePosition(user_id, market_id, side, new_shares, trade_price):
    existing = query("SELECT * FROM positions WHERE user_id = ? AND market_id = ? AND side = ?", user_id, market_id, side)

    if existing:
        # Calculate weighted average price
        total_shares = existing.shares + new_shares
        new_avg_price = (existing.avg_price * existing.shares + trade_price * new_shares) / total_shares

        update("UPDATE positions SET shares = ?, avg_price = ? WHERE id = ?", total_shares, new_avg_price, existing.id)
    else:
        # Create new position
        insert("INSERT INTO positions (id, user_id, market_id, side, shares, avg_price) VALUES (?, ?, ?, ?, ?, ?)", uuid(), user_id, market_id, side, new_shares, trade_price)
```

**Example:**
- Alice buys 5 YES at $0.60 → position: 5 shares @ $0.60 avg
- Later, Alice buys 10 YES at $0.70 → position: 15 shares @ $0.6667 avg
  - Calculation: ($0.60 × 5 + $0.70 × 10) / 15 = $0.6667

### P&L Calculation

**Unrealized P&L** (for open positions):
```
unrealized_pnl = (current_price - avg_price) × shares
```

Example:
- Alice holds 10 YES at avg price $0.60
- Current market price: YES = $0.75
- Unrealized P&L = ($0.75 - $0.60) × 10 = $1.50

**Realized P&L** (from selling or market resolution):
```
realized_pnl = (sell_price - avg_price) × shares_sold
```

Example:
- Alice bought 10 YES at $0.60 (cost $6.00)
- Market resolves YES (payout $1.00 per share)
- Alice receives 10 × $1.00 = $10.00
- Realized P&L = $10.00 - $6.00 = $4.00

### Market Resolution

When a market resolves:

```python
def resolveMarket(market_id, outcome):  # outcome = 'yes' or 'no'
    # 1. Update market status
    update("UPDATE markets SET status = ? WHERE id = ?", f"resolved_{outcome}", market_id)

    # 2. Get all positions
    positions = query("SELECT * FROM positions WHERE market_id = ?", market_id)

    # 3. Pay winners
    for pos in positions:
        if pos.side == outcome and pos.shares > 0:
            payout = pos.shares * 1.00  # Each winning share pays $1.00
            update("UPDATE users SET balance = balance + ? WHERE id = ?", payout, pos.user_id)

            # Update realized P&L
            realized_pnl = payout - (pos.avg_price * pos.shares)
            update("UPDATE positions SET realized_pnl = ? WHERE id = ?", realized_pnl, pos.id)

    # 4. Losers get nothing (they already paid when placing orders)
```

**Example:**
- Market: "Bitcoin $100k in 2026?"
- Alice: 10 YES shares at $0.60 (paid $6.00)
- Bob: 5 NO shares at $0.40 (paid $2.00)
- Resolution: YES (Bitcoin hits $100k)
- Payouts:
  - Alice receives: 10 × $1.00 = $10.00 (profit $4.00)
  - Bob receives: $0.00 (loss $2.00)

---

## 7. Authentication System

Our authentication uses **JWT (JSON Web Tokens)** stored in **HTTP-only cookies**.

### What is JWT?

**JWT** is a token format for authentication. Think of it like a session ID, but self-contained.

**Traditional session (Java web apps):**
1. User logs in
2. Server creates session, stores in memory/database
3. Server sends session ID cookie to browser
4. Browser sends cookie with each request
5. Server looks up session in database

**JWT approach:**
1. User logs in
2. Server creates JWT with user data, signs it
3. Server sends JWT cookie to browser
4. Browser sends cookie with each request
5. Server verifies JWT signature (then looks up user in database for fresh data)

**JWT structure:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjMiLCJ1c2VybmFtZSI6ImFsaWNlIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

Three parts (separated by `.`):
1. **Header**: `{"alg":"HS256","typ":"JWT"}` (algorithm)
2. **Payload**: `{"userId":"123","username":"alice"}` (data)
3. **Signature**: HMAC-SHA256(header + payload + secret)

**Comparison to other auth methods:**

| Method | Storage | Stateless? | Security |
|--------|---------|------------|----------|
| Session ID | Server memory/DB | No | Good |
| JWT | Token itself | Yes | Good if implemented correctly |
| Basic Auth | None (sent each time) | Yes | Poor (password in header) |

### Password Hashing with bcrypt

**Never store plain passwords!**

```typescript
// Signup
const password = "password123";
const hash = hashPassword(password);  // bcrypt.hashSync(password, 10)
// hash = "$2a$10$N9qo8uLOickgx2ZMRZoMye1J..."

db.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)')
  .run(userId, username, hash);

// Login
const inputPassword = "password123";
const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
const isValid = verifyPassword(inputPassword, user.password_hash);  // bcrypt.compareSync()

if (isValid) {
  // Create JWT
} else {
  // Reject login
}
```

**bcrypt properties:**
- **One-way**: Can't reverse hash to get password
- **Slow**: Intentionally slow (prevents brute force)
- **Salted**: Each hash is unique (even for same password)
- **Secure**: Industry standard

**Comparison to other hashing:**
- **MD5/SHA1**: Fast, no salt → insecure
- **SHA256**: Fast, manual salt → better but not ideal
- **bcrypt/scrypt/argon2**: Slow, auto-salt → secure

### Cookie-Based Token Storage

We store JWT in an **HTTP-only cookie**:

```typescript
await setAuthCookie(token);

// Internally:
const cookieStore = await cookies();
cookieStore.set('polycast_token', token, {
  httpOnly: true,      // JavaScript can't access (prevents XSS)
  secure: true,        // Only sent over HTTPS (in production)
  sameSite: 'lax',     // CSRF protection
  maxAge: 7 * 24 * 60 * 60,  // 7 days
  path: '/',           // Available on all routes
});
```

**Why HTTP-only?**
- Prevents JavaScript from reading the token
- Protects against XSS (cross-site scripting) attacks
- Browser automatically sends cookie with requests

**Comparison to localStorage:**

| Storage | XSS Vulnerable? | CSRF Vulnerable? | Auto-sent? |
|---------|-----------------|------------------|------------|
| localStorage | Yes (JS can read) | No | No (must add to requests manually) |
| HTTP-only cookie | No | Yes (but we mitigate) | Yes |

### The getCurrentUser() Flow

This is how we authenticate API requests:

```typescript
// src/lib/auth.ts
export async function getCurrentUser(): Promise<User | null> {
  // 1. Get cookie from request
  const cookieStore = await cookies();
  const token = cookieStore.get('polycast_token')?.value;
  if (!token) return null;

  // 2. Verify JWT signature and decode
  const payload = verifyToken(token);  // jwt.verify(token, SECRET)
  if (!payload) return null;

  // 3. Look up user in database
  const db = initializeDatabase();
  const user = db.prepare(
    'SELECT id, username, email, balance, created_at FROM users WHERE id = ?'
  ).get(payload.userId);

  return user || null;
}
```

**Usage in API routes:**
```typescript
// src/app/api/portfolio/route.ts
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // User is authenticated, proceed
  const positions = db.prepare('SELECT * FROM positions WHERE user_id = ?').all(user.id);
  return Response.json({ positions });
}
```

### Complete Auth Flow

**Signup:**
```
1. User submits form (username, email, password)
   ↓
2. POST /api/auth/signup
   ↓
3. Validate inputs
   ↓
4. Hash password with bcrypt
   ↓
5. Insert user into database
   ↓
6. Create JWT: { userId, username }
   ↓
7. Sign JWT with secret key
   ↓
8. Set HTTP-only cookie with JWT
   ↓
9. Return success
   ↓
10. Browser stores cookie
```

**Login:**
```
1. User submits form (username, password)
   ↓
2. POST /api/auth/login
   ↓
3. Find user by username
   ↓
4. Compare password with hash (bcrypt)
   ↓
5. If invalid: return 401 Unauthorized
   ↓
6. If valid: create JWT
   ↓
7. Set HTTP-only cookie
   ↓
8. Return success
   ↓
9. Browser stores cookie
```

**Authenticated Request:**
```
1. User clicks "Place Order"
   ↓
2. Browser sends request with cookie
   ↓
3. POST /api/markets/123/orders
   ↓
4. getCurrentUser() reads cookie
   ↓
5. Verify JWT signature
   ↓
6. Decode payload → userId
   ↓
7. Look up user in database
   ↓
8. Return user object
   ↓
9. API route checks if user exists
   ↓
10. If null: return 401
   ↓
11. If valid: proceed with order
```

**Logout:**
```
1. User clicks "Logout"
   ↓
2. POST /api/auth/logout
   ↓
3. Delete cookie
   ↓
4. Return success
   ↓
5. Browser removes cookie
```

### Security Best Practices

1. **Never return password_hash in API responses**
   ```typescript
   // Good
   const user = db.prepare('SELECT id, username, email, balance FROM users WHERE id = ?').get(userId);

   // Bad
   const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);  // includes password_hash!
   ```

2. **Always use HTTPS in production**
   - Cookies with `secure: true` only sent over HTTPS
   - Prevents man-in-the-middle attacks

3. **Validate all inputs**
   ```typescript
   if (!username || !password) {
     return Response.json({ error: 'Missing fields' }, { status: 400 });
   }
   ```

4. **Use environment variables for secrets**
   ```typescript
   const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-secret';
   ```

5. **Set appropriate cookie attributes**
   - `httpOnly: true` (prevent XSS)
   - `sameSite: 'lax'` (prevent CSRF)
   - `secure: true` (HTTPS only in production)

---

## 8. How to Add a New Feature (Step by Step)

Let's walk through adding a "Cancel Order" feature.

**Requirement:** Users should be able to cancel their own open orders from the portfolio page.

### Step 1: Add UI Button

Edit `src/components/PositionRow.tsx` or create an `OrderRow.tsx` component.

```typescript
// src/components/OrderRow.tsx
'use client';

interface OrderRowProps {
  orderId: string;
  marketTitle: string;
  side: 'yes' | 'no';
  price: number;
  quantity: number;
  filledQuantity: number;
  status: string;
}

export default function OrderRow({
  orderId,
  marketTitle,
  side,
  price,
  quantity,
  filledQuantity,
  status,
}: OrderRowProps) {
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    setCancelling(true);
    setError(null);

    try {
      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to cancel order');
      }

      // Refresh page or update state
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setCancelling(false);
    }
  };

  const canCancel = status === 'open' || status === 'partial';

  return (
    <tr>
      <td>{marketTitle}</td>
      <td className={side === 'yes' ? 'text-yes' : 'text-no'}>
        {side.toUpperCase()}
      </td>
      <td>${price.toFixed(2)}</td>
      <td>{filledQuantity} / {quantity}</td>
      <td>{status}</td>
      <td>
        {canCancel && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
          >
            {cancelling ? 'Cancelling...' : 'Cancel'}
          </button>
        )}
        {error && <span className="text-red-400 text-sm">{error}</span>}
      </td>
    </tr>
  );
}
```

### Step 2: Create API Route

Create `src/app/api/orders/[id]/cancel/route.ts`:

```typescript
import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db';
import { OrderBook } from '@/lib/engine/orderbook';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Get current user
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id: orderId } = await params;

  // Cancel order
  const db = initializeDatabase();
  const orderBook = new OrderBook(db);
  const result = orderBook.cancelOrder(orderId, user.id);

  if (!result.success) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  return Response.json({ success: true });
}
```

### Step 3: Implement Engine Method

The `cancelOrder` method already exists in `src/lib/engine/orderbook.ts`, but let's review it:

```typescript
// src/lib/engine/orderbook.ts
cancelOrder(orderId: string, userId: string): { success: boolean; error?: string } {
  // 1. Verify order exists and belongs to user
  const order = this.db.prepare(
    'SELECT * FROM orders WHERE id = ? AND user_id = ?'
  ).get(orderId, userId) as Order | undefined;

  if (!order) {
    return { success: false, error: 'Order not found' };
  }

  // 2. Check if order can be cancelled
  if (order.status === 'filled' || order.status === 'cancelled') {
    return { success: false, error: 'Order cannot be cancelled' };
  }

  // 3. Calculate refund for unfilled portion
  const unfilledQty = order.quantity - order.filled_quantity;
  const refund = order.price * unfilledQty;

  // 4. Update order status
  this.db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?")
    .run(orderId);

  // 5. Refund user
  this.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
    .run(refund, userId);

  return { success: true };
}
```

### Step 4: Add to Portfolio Page

Update `src/app/portfolio/page.tsx` to show orders in addition to positions:

```typescript
export default async function PortfolioPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  // Fetch positions
  const positions = await fetch('http://localhost:3000/api/portfolio').then(r => r.json());

  // Fetch open orders
  const orders = await fetch('http://localhost:3000/api/orders/my').then(r => r.json());

  return (
    <div>
      <h1>Portfolio</h1>

      <h2>Positions</h2>
      <table>
        {/* Position rows */}
      </table>

      <h2>Open Orders</h2>
      <table>
        <thead>
          <tr>
            <th>Market</th>
            <th>Side</th>
            <th>Price</th>
            <th>Filled / Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.orders.map(order => (
            <OrderRow key={order.id} {...order} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### Step 5: Create GET /api/orders/my Endpoint

Create `src/app/api/orders/my/route.ts`:

```typescript
import { getCurrentUser } from '@/lib/auth';
import { initializeDatabase } from '@/lib/db';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = initializeDatabase();
  const orders = db.prepare(
    `SELECT o.*, m.title as market_title
     FROM orders o
     JOIN markets m ON o.market_id = m.id
     WHERE o.user_id = ? AND o.status IN ('open', 'partial')
     ORDER BY o.created_at DESC`
  ).all(user.id);

  return Response.json({ orders });
}
```

### Step 6: Write Tests

Create `tests/api/orders.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { OrderBook } from '../../src/lib/engine/orderbook';

describe('Cancel Order', () => {
  let db: Database.Database;
  let orderBook: OrderBook;

  beforeEach(() => {
    db = new Database(':memory:');
    // Run migrations, create test users/markets
    // ...
    orderBook = new OrderBook(db);
  });

  it('should cancel an open order and refund user', () => {
    // Place order
    const result = orderBook.placeOrder('user1', 'market1', 'yes', 'limit', 0.60, 10);
    const orderId = result.order.id;

    // Check initial balance
    const initialBalance = db.prepare('SELECT balance FROM users WHERE id = ?').get('user1').balance;

    // Cancel order
    const cancelResult = orderBook.cancelOrder(orderId, 'user1');

    expect(cancelResult.success).toBe(true);

    // Check order status
    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    expect(order.status).toBe('cancelled');

    // Check refund
    const newBalance = db.prepare('SELECT balance FROM users WHERE id = ?').get('user1').balance;
    expect(newBalance).toBe(initialBalance + 6.00);  // 0.60 * 10
  });

  it('should not cancel another user\'s order', () => {
    const result = orderBook.placeOrder('user1', 'market1', 'yes', 'limit', 0.60, 10);
    const orderId = result.order.id;

    const cancelResult = orderBook.cancelOrder(orderId, 'user2');  // Different user!

    expect(cancelResult.success).toBe(false);
    expect(cancelResult.error).toBe('Order not found');
  });

  it('should not cancel a filled order', () => {
    // Place and fill order
    orderBook.placeOrder('user1', 'market1', 'yes', 'limit', 0.60, 10);
    orderBook.placeOrder('user2', 'market1', 'no', 'limit', 0.45, 10);  // Matches

    const order = db.prepare('SELECT * FROM orders WHERE user_id = ?').get('user1');

    const cancelResult = orderBook.cancelOrder(order.id, 'user1');

    expect(cancelResult.success).toBe(false);
    expect(cancelResult.error).toBe('Order cannot be cancelled');
  });
});
```

### Step 7: Verify Manually

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Log in as a test user:**
   - Go to http://localhost:3000/auth/login
   - Username: `alice`, Password: `password123`

3. **Place an order:**
   - Go to a market page
   - Place a limit order that won't immediately fill

4. **Go to portfolio:**
   - Navigate to http://localhost:3000/portfolio
   - See your open order listed

5. **Cancel the order:**
   - Click "Cancel" button
   - Verify order disappears
   - Check that balance increased (refund applied)

---

## 9. How to Add a New API Endpoint

Let's add a `GET /api/markets/{id}/trades` endpoint to fetch trade history for a market.

### Step 1: Create Route File

Create `src/app/api/markets/[id]/trades/route.ts`:

```typescript
import { NextRequest } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Extract market ID from route parameter
  const { id: marketId } = await params;  // MUST await in Next.js 14+

  // Query trades from database
  const db = initializeDatabase();
  const trades = db.prepare(
    `SELECT t.*,
            o1.user_id as buyer_user_id,
            o2.user_id as seller_user_id,
            u1.username as buyer_username,
            u2.username as seller_username
     FROM trades t
     JOIN orders o1 ON t.buyer_order_id = o1.id
     JOIN orders o2 ON t.seller_order_id = o2.id
     JOIN users u1 ON o1.user_id = u1.id
     JOIN users u2 ON o2.user_id = u2.id
     WHERE t.market_id = ?
     ORDER BY t.created_at DESC
     LIMIT 100`
  ).all(marketId);

  return Response.json({ trades });
}
```

### Step 2: Test the Endpoint

**Manual test:**
```bash
# Start server
npm run dev

# Make request (use curl, Postman, or browser)
curl http://localhost:3000/api/markets/{some-market-id}/trades
```

**Automated test:**
```typescript
// tests/api/markets.test.ts
import { describe, it, expect } from 'vitest';

describe('GET /api/markets/[id]/trades', () => {
  it('should return trades for a market', async () => {
    // Setup: create market, place orders that match
    // ...

    const response = await fetch(`http://localhost:3000/api/markets/${marketId}/trades`);
    const data = await response.json();

    expect(response.ok).toBe(true);
    expect(data.trades).toBeDefined();
    expect(Array.isArray(data.trades)).toBe(true);
  });
});
```

### Step 3: Use in Frontend

Update market detail page to show trade history:

```typescript
// src/app/markets/[id]/page.tsx
export default async function MarketPage({ params }) {
  const { id } = await params;

  // Fetch trades
  const tradesRes = await fetch(`http://localhost:3000/api/markets/${id}/trades`);
  const { trades } = await tradesRes.json();

  return (
    <div>
      {/* Existing market content */}

      <h2>Recent Trades</h2>
      <table>
        <thead>
          <tr>
            <th>Time</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Buyer</th>
            <th>Seller</th>
          </tr>
        </thead>
        <tbody>
          {trades.map(trade => (
            <tr key={trade.id}>
              <td>{new Date(trade.created_at).toLocaleString()}</td>
              <td>${trade.price.toFixed(2)}</td>
              <td>{trade.quantity}</td>
              <td>{trade.buyer_username}</td>
              <td>{trade.seller_username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

### API Route Conventions

**File path determines URL:**
```
src/app/api/markets/[id]/trades/route.ts
→ /api/markets/{id}/trades
```

**HTTP methods map to exports:**
```typescript
export async function GET(request) { ... }     // GET /api/...
export async function POST(request) { ... }    // POST /api/...
export async function PUT(request) { ... }     // PUT /api/...
export async function DELETE(request) { ... }  // DELETE /api/...
export async function PATCH(request) { ... }   // PATCH /api/...
```

**Dynamic parameters:**
```typescript
// [id] in path = dynamic parameter
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }  // Type the params
) {
  const { id } = await params;  // MUST await!
  // ...
}
```

**Query parameters:**
```typescript
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');  // ?category=Politics
  const limit = searchParams.get('limit');        // ?limit=10
  // ...
}
```

**Request body:**
```typescript
export async function POST(request: NextRequest) {
  const body = await request.json();  // Parse JSON body
  const { title, description } = body;
  // ...
}
```

**Response types:**
```typescript
// JSON response (most common)
return Response.json({ data: ... });

// With status code
return Response.json({ error: 'Not found' }, { status: 404 });

// Redirect
return Response.redirect('https://example.com');

// Plain text
return new Response('Hello', { headers: { 'Content-Type': 'text/plain' } });
```

---

## 10. How to Add a New Page

Let's add an "About" page at `/about`.

### Step 1: Create Page File

Create `src/app/about/page.tsx`:

```typescript
export default function AboutPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">About Polycast</h1>

      <p className="text-lg mb-4">
        Polycast is a prediction market platform where you can trade on the outcome of future events.
      </p>

      <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
      <ol className="list-decimal list-inside space-y-2 mb-6">
        <li>Browse markets on topics like politics, sports, and crypto</li>
        <li>Buy YES or NO shares based on your prediction</li>
        <li>Trade shares with other users</li>
        <li>When the market resolves, winning shares pay $1.00</li>
      </ol>

      <h2 className="text-2xl font-semibold mb-3">Technology</h2>
      <ul className="list-disc list-inside space-y-1">
        <li>Next.js 14 with App Router</li>
        <li>TypeScript for type safety</li>
        <li>SQLite database</li>
        <li>Central Limit Order Book (CLOB) matching engine</li>
      </ul>
    </div>
  );
}
```

### Step 2: Add to Navigation

Update `src/components/Navbar.tsx`:

```typescript
export default function Navbar() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/about">About</Link>  {/* Add this */}
      <Link href="/leaderboard">Leaderboard</Link>
      {/* ... */}
    </nav>
  );
}
```

### Step 3: Visit the Page

Navigate to http://localhost:3000/about

### Page Conventions

**Static page:**
```typescript
// src/app/about/page.tsx
export default function AboutPage() {
  return <div>Static content</div>;
}
```

**Dynamic page (with data fetching):**
```typescript
// src/app/markets/page.tsx
export default async function MarketsPage() {
  // Fetch data on server
  const response = await fetch('http://localhost:3000/api/markets');
  const { markets } = await response.json();

  return (
    <div>
      {markets.map(market => (
        <MarketCard key={market.id} {...market} />
      ))}
    </div>
  );
}
```

**Page with params:**
```typescript
// src/app/markets/[id]/page.tsx
export default async function MarketPage({ params }: { params: { id: string } }) {
  const { id } = await params;  // MUST await
  // Fetch market data
  // ...
}
```

**Page with searchParams:**
```typescript
// src/app/search/page.tsx
export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q: string };
}) {
  const { q } = await searchParams;  // MUST await
  // Search for q
  // ...
}
```

**Metadata (for SEO):**
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - Polycast',
  description: 'Learn about Polycast prediction markets',
};

export default function AboutPage() {
  // ...
}
```

### Layout vs Page

- **page.tsx** = Content specific to that route
- **layout.tsx** = Wrapper around child pages

Example:
```
src/app/
  layout.tsx          → Wraps entire app (navbar, footer)
  page.tsx            → Homepage content
  markets/
    layout.tsx        → Wraps all /markets/* pages
    page.tsx          → /markets page
    [id]/
      page.tsx        → /markets/{id} page
```

---

## 11. How to Add a New Component

Let's create a `Badge` component for displaying category tags.

### Step 1: Create Component File

Create `src/components/Badge.tsx`:

```typescript
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'danger' | 'warning';
}

export default function Badge({ children, variant = 'default' }: BadgeProps) {
  const baseClasses = 'inline-block px-2.5 py-0.5 text-xs font-medium rounded-full';

  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <span className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
}
```

### Step 2: Use the Component

Update `MarketCard.tsx`:

```typescript
import Badge from './Badge';

export default function MarketCard({ category, ... }) {
  return (
    <div>
      <Badge>{category}</Badge>
      {/* Rest of card */}
    </div>
  );
}
```

### React Component Patterns

**Functional Component (modern):**
```typescript
export default function MyComponent() {
  return <div>Hello</div>;
}
```

**With Props:**
```typescript
interface MyComponentProps {
  title: string;
  count: number;
}

export default function MyComponent({ title, count }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
    </div>
  );
}
```

**With State:**
```typescript
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

**With Effects (side effects):**
```typescript
import { useState, useEffect } from 'react';

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Runs after component mounts
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => setUser(data.user));
  }, []);  // Empty array = run once on mount

  if (!user) return <div>Loading...</div>;

  return <div>Welcome, {user.username}</div>;
}
```

**Client vs Server Components:**

In Next.js App Router, components are **server components** by default.

**Server Component:**
```typescript
// src/app/page.tsx
export default async function HomePage() {
  // Can use async/await directly
  const data = await fetch('...');
  // Runs on server only
  return <div>{data}</div>;
}
```

**Client Component:**
```typescript
// src/components/Counter.tsx
'use client';  // Must add this directive!

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  // Runs in browser
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

**When to use client components:**
- Need state (`useState`)
- Need effects (`useEffect`)
- Need event handlers (`onClick`, `onChange`)
- Need browser APIs (`window`, `localStorage`)

**When to use server components:**
- Fetching data
- Accessing database
- No interactivity needed

---

## 12. Common Pitfalls and Troubleshooting

### Module Not Found Errors

**Error:**
```
Module not found: Can't resolve '@/lib/utils'
```

**Cause:** TypeScript path alias not configured or typo in import.

**Solution:**
1. Check `tsconfig.json` has:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```
2. Verify file exists at `src/lib/utils.ts`
3. Restart dev server: `Ctrl+C`, then `npm run dev`

### Database Locked Errors

**Error:**
```
SqliteError: database is locked
```

**Cause:** Multiple processes accessing SQLite simultaneously, or unclosed database connection.

**Solution:**
1. Stop all dev servers and test runners
2. Delete lock files:
   ```bash
   rm polycast.db-shm polycast.db-wal
   ```
3. Add WAL mode to `connection.ts`:
   ```typescript
   db.pragma('journal_mode = WAL');
   ```

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Cause:** Another process is using port 3000.

**Solution:**

**Windows:**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:3000 | xargs kill -9
```

Or use different port:
```bash
PORT=3001 npm run dev
```

### Tests Failing Due to Async Issues

**Error:**
```
Error: Unable to find [button with text "Submit"]
```

**Cause:** Testing async component without waiting for state updates.

**Solution:**
Use `waitFor` from `@testing-library/react`:

```typescript
import { render, screen, waitFor } from '@testing-library/react';

it('should show user data', async () => {
  render(<UserProfile />);

  // Wait for async fetch to complete
  await waitFor(() => {
    expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
  });
});
```

### Next.js Params Must Be Awaited

**Error:**
```
Error: Route params must be awaited
```

**Cause:** In Next.js 14+, route params are async.

**Wrong:**
```typescript
export async function GET(request, { params }) {
  const id = params.id;  // ERROR
}
```

**Correct:**
```typescript
export async function GET(request, { params }) {
  const { id } = await params;  // OK
}
```

### cookies() Must Be Awaited

**Error:**
```
Error: cookies() expects to be awaited
```

**Wrong:**
```typescript
const cookieStore = cookies();
```

**Correct:**
```typescript
const cookieStore = await cookies();
```

### TypeScript Type Errors

**Error:**
```
Type 'string | null' is not assignable to type 'string'
```

**Cause:** TypeScript is strict about null safety.

**Solution:**
Add null check:
```typescript
const username = searchParams.get('username');
if (!username) {
  return Response.json({ error: 'Username required' }, { status: 400 });
}
// Now username is definitely string, not string | null
```

### React Hydration Errors

**Error:**
```
Error: Hydration failed because the initial UI does not match
```

**Cause:** Server-rendered HTML differs from client-rendered HTML.

**Common causes:**
1. Using `Date.now()` or `Math.random()` in render
2. Using browser APIs (`window`, `localStorage`) in server components

**Solution:**
1. Use client component with `useEffect`:
   ```typescript
   'use client';

   export default function Clock() {
     const [time, setTime] = useState(null);

     useEffect(() => {
       setTime(Date.now());
     }, []);

     if (!time) return <div>Loading...</div>;
     return <div>{time}</div>;
   }
   ```

### Missing Dependencies in useEffect

**Warning:**
```
React Hook useEffect has a missing dependency: 'fetchData'
```

**Cause:** `useEffect` depends on values not in dependency array.

**Solution:**

**Option 1: Add to dependencies**
```typescript
useEffect(() => {
  fetchData();
}, [fetchData]);  // Add dependency
```

**Option 2: Define inside effect**
```typescript
useEffect(() => {
  const fetchData = async () => {
    // ...
  };
  fetchData();
}, []);  // No external dependencies
```

### CORS Errors in Development

**Error:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS
```

**Cause:** Making API request to external domain without CORS headers.

**Solution:**

**For external APIs, use server-side fetch:**
```typescript
// API route (server-side)
export async function GET() {
  const data = await fetch('https://external-api.com/data');
  return Response.json(data);
}

// Component (client-side)
const data = await fetch('/api/my-proxy');  // Your own API
```

### Build Errors vs Runtime Errors

**Build error:**
- Happens during `npm run build`
- Usually TypeScript or syntax errors
- Must fix before deployment

**Runtime error:**
- Happens when code runs
- Usually logic errors or missing data
- Check browser console and server logs

---

## 13. Glossary

### Component
A reusable piece of UI in React. Think of it like a class with a `render()` method.

**Example:** `<Button>` is a component.

### Props
Short for "properties". Data passed to a component from its parent. Like constructor parameters in OOP.

**Example:**
```typescript
<Button label="Click me" onClick={handleClick} />
//      ^^^^^ props ^^^^^
```

### State
Data that can change within a component. Like member variables in a class.

**Example:**
```typescript
const [count, setCount] = useState(0);  // count is state
```

### Hook
Special React functions that let you "hook into" React features. Always start with `use`.

**Common hooks:**
- `useState` - Add state to component
- `useEffect` - Run side effects
- `useCallback` - Memoize functions
- `useMemo` - Memoize values

### Route
A URL path that maps to a page or component.

**Example:** `/markets/123` is a route.

### API Route
A server-side endpoint in Next.js. Like a REST controller in Spring.

**Example:** `src/app/api/markets/route.ts` → `GET /api/markets`

### Middleware
Code that runs before a request reaches your route handler. Used for auth, logging, etc.

(Not implemented in Forecast, but common in Next.js apps)

### JWT
JSON Web Token. A self-contained token format for authentication. Contains user data and signature.

### CLOB
Central Limit Order Book. A system that matches buy and sell orders by price and time priority.

### Order Book
The collection of all open orders for a market, organized by price level.

### Limit Order
An order with a specific price. Only executes at that price or better.

**Example:** "Buy YES at $0.60 or lower"

### Market Order
An order that executes immediately at the best available price. No price limit.

**Example:** "Buy YES at whatever price is available"

### Position
A user's holdings in a market. Includes shares owned and average purchase price.

**Example:** "Alice holds 10 YES shares at $0.60 average"

### P&L
Profit and Loss. How much money you've made or lost on a position.

**Unrealized P&L:** Profit/loss on open positions (haven't sold yet)
**Realized P&L:** Profit/loss on closed positions (sold or market resolved)

### Resolution
The final outcome of a market. Determines who gets paid.

**Example:** Market "Bitcoin $100k?" resolves YES if Bitcoin hits $100k, NO otherwise.

### Server Component
A React component that runs only on the server. Can directly access databases and APIs.

### Client Component
A React component that runs in the browser. Can use state, effects, and event handlers.

**Must start with `'use client';` directive.**

### SSR
Server-Side Rendering. Generating HTML on the server instead of in the browser.

Next.js does this by default for better performance and SEO.

### Hydration
The process of attaching React event handlers to server-rendered HTML.

1. Server sends HTML
2. Browser displays HTML (fast!)
3. React JavaScript loads
4. React "hydrates" (makes it interactive)

### TypeScript Interface
A type definition that describes the shape of an object. Like a class definition or Java interface.

**Example:**
```typescript
interface User {
  id: string;
  username: string;
  balance: number;
}
```

### Async/Await
Modern JavaScript syntax for handling asynchronous operations.

**Old way (callbacks):**
```javascript
fetch('/api/data').then(response => {
  return response.json();
}).then(data => {
  console.log(data);
});
```

**New way (async/await):**
```javascript
const response = await fetch('/api/data');
const data = await response.json();
console.log(data);
```

### Destructuring
JavaScript syntax for extracting values from objects or arrays.

**Example:**
```typescript
const user = { id: '123', username: 'alice' };
const { username } = user;  // username = 'alice'
```

### Spread Operator
The `...` syntax for copying or expanding arrays/objects.

**Example:**
```typescript
const props = { id: '123', title: 'Market' };
<MarketCard {...props} />  // Same as <MarketCard id="123" title="Market" />
```

### Arrow Function
Compact function syntax in JavaScript.

**Example:**
```typescript
// Traditional
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;
```

### Template Literal
String with embedded expressions using backticks.

**Example:**
```typescript
const name = 'Alice';
const greeting = `Hello, ${name}!`;  // "Hello, Alice!"
```

---

## Conclusion

You now have a comprehensive understanding of the Polycast prediction market application. You've learned:

1. How to set up the development environment
2. How the tech stack works (compared to familiar C/C++/Java concepts)
3. The overall architecture and data flow
4. Every directory and file in the project
5. The database schema and relationships
6. How the CLOB matching engine works in detail
7. How authentication is implemented
8. How to add new features, endpoints, pages, and components
9. Common pitfalls and how to fix them
10. Key terminology

**Next steps:**

1. **Explore the codebase**: Read through the files mentioned in this guide
2. **Run the app**: `npm run dev` and try placing trades
3. **Read the tests**: See `tests/` for examples of how each part works
4. **Make changes**: Try adding a small feature
5. **Break things**: The best way to learn is to experiment

**Resources:**

- **Next.js Docs**: https://nextjs.org/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **SQLite Docs**: https://www.sqlite.org/docs.html

Welcome to web development!
