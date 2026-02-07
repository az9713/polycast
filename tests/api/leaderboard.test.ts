import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { OrderBook } from '@/lib/engine/orderbook';
import { MarketManager } from '@/lib/engine/market';
import { runMigrations } from '@/lib/db/migrations';
import { v4 as uuid } from 'uuid';

let db: Database.Database;
let orderBook: OrderBook;
let marketManager: MarketManager;

function createUser(id: string, username: string, balance: number = 1000) {
  db.prepare(
    'INSERT INTO users (id, username, email, password_hash, balance) VALUES (?, ?, ?, ?, ?)'
  ).run(id, username, `${username}@test.com`, 'hash', balance);
}

describe('Leaderboard logic', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
    orderBook = new OrderBook(db);
    marketManager = new MarketManager(db);
  });

  it('should rank users by total balance + realized PnL', () => {
    const u1 = uuid(), u2 = uuid(), u3 = uuid();
    createUser(u1, 'rich', 3000);
    createUser(u2, 'medium', 2000);
    createUser(u3, 'poor', 500);

    const leaders = db.prepare(`
      SELECT u.id, u.username, u.balance,
        COALESCE(SUM(p.realized_pnl), 0) as total_realized_pnl
      FROM users u
      LEFT JOIN positions p ON u.id = p.user_id AND p.shares > 0
      GROUP BY u.id
      ORDER BY (u.balance + COALESCE(SUM(p.realized_pnl), 0)) DESC
    `).all() as any[];

    expect(leaders[0].username).toBe('rich');
    expect(leaders[1].username).toBe('medium');
    expect(leaders[2].username).toBe('poor');
  });

  it('should include trade counts', () => {
    const u1 = uuid(), u2 = uuid();
    createUser(u1, 'activeTrader', 5000);
    createUser(u2, 'counterparty', 5000);

    const market = marketManager.createMarket({
      title: 'Test', description: 'Test', category: 'ai',
      resolution_source: 'test', resolution_date: '2026-12-31',
    });

    // Execute 3 trades
    orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
    orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.40, 10);

    orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.55, 5);
    orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.45, 5);

    const tradeCounts = db.prepare(`
      SELECT o.user_id, COUNT(DISTINCT t.id) as trade_count
      FROM orders o
      JOIN trades t ON t.buyer_order_id = o.id OR t.seller_order_id = o.id
      GROUP BY o.user_id
    `).all() as any[];

    expect(tradeCounts.length).toBeGreaterThan(0);
    const u1Trades = tradeCounts.find((tc: any) => tc.user_id === u1);
    expect(u1Trades).toBeDefined();
    expect(u1Trades.trade_count).toBeGreaterThanOrEqual(2);
  });

  it('should handle users with no trades', () => {
    const u1 = uuid();
    createUser(u1, 'noTradeUser');

    const leaders = db.prepare(`
      SELECT u.id, u.username, u.balance
      FROM users u
      ORDER BY u.balance DESC
    `).all() as any[];

    expect(leaders).toHaveLength(1);
    expect(leaders[0].username).toBe('noTradeUser');
  });

  it('should limit to top 50', () => {
    // Create 55 users
    for (let i = 0; i < 55; i++) {
      createUser(uuid(), `user${i}`, 1000 + i);
    }

    const leaders = db.prepare(`
      SELECT u.id, u.username, u.balance
      FROM users u
      ORDER BY u.balance DESC
      LIMIT 50
    `).all() as any[];

    expect(leaders).toHaveLength(50);
  });

  it('should reflect PnL changes after market resolution', () => {
    const u1 = uuid(), u2 = uuid();
    createUser(u1, 'winner', 5000);
    createUser(u2, 'loser', 5000);

    const market = marketManager.createMarket({
      title: 'PnL Test', description: 'Test', category: 'ai',
      resolution_source: 'test', resolution_date: '2026-12-31',
    });

    orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
    orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.40, 10);

    const bal1Before = (db.prepare('SELECT balance FROM users WHERE id = ?').get(u1) as any).balance;
    marketManager.resolveMarket(market.id, 'yes');
    const bal1After = (db.prepare('SELECT balance FROM users WHERE id = ?').get(u1) as any).balance;

    // Winner should have more balance after resolution
    expect(bal1After).toBeGreaterThan(bal1Before);
  });
});
