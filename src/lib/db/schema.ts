export const CREATE_USERS_TABLE = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 1000.0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

export const CREATE_MARKETS_TABLE = `
  CREATE TABLE IF NOT EXISTS markets (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    resolution_source TEXT NOT NULL,
    resolution_date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'open',
    yes_price REAL NOT NULL DEFAULT 0.50,
    no_price REAL NOT NULL DEFAULT 0.50,
    volume REAL NOT NULL DEFAULT 0.0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

export const CREATE_ORDERS_TABLE = `
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    market_id TEXT NOT NULL REFERENCES markets(id),
    side TEXT NOT NULL CHECK(side IN ('yes', 'no')),
    type TEXT NOT NULL CHECK(type IN ('limit', 'market')),
    price REAL NOT NULL CHECK(price >= 0.01 AND price <= 0.99),
    quantity INTEGER NOT NULL CHECK(quantity > 0),
    filled_quantity INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open' CHECK(status IN ('open', 'filled', 'partial', 'cancelled')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

export const CREATE_TRADES_TABLE = `
  CREATE TABLE IF NOT EXISTS trades (
    id TEXT PRIMARY KEY,
    market_id TEXT NOT NULL REFERENCES markets(id),
    buyer_order_id TEXT NOT NULL REFERENCES orders(id),
    seller_order_id TEXT NOT NULL REFERENCES orders(id),
    price REAL NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

export const CREATE_POSITIONS_TABLE = `
  CREATE TABLE IF NOT EXISTS positions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id),
    market_id TEXT NOT NULL REFERENCES markets(id),
    side TEXT NOT NULL CHECK(side IN ('yes', 'no')),
    shares INTEGER NOT NULL DEFAULT 0,
    avg_price REAL NOT NULL DEFAULT 0.0,
    realized_pnl REAL NOT NULL DEFAULT 0.0,
    UNIQUE(user_id, market_id, side)
  )
`;

export const ALL_TABLES = [
  CREATE_USERS_TABLE,
  CREATE_MARKETS_TABLE,
  CREATE_ORDERS_TABLE,
  CREATE_TRADES_TABLE,
  CREATE_POSITIONS_TABLE,
];
