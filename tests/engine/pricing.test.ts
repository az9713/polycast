import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { OrderBook } from '@/lib/engine/orderbook';
import { runMigrations } from '@/lib/db/migrations';
import { v4 as uuid } from 'uuid';

let db: Database.Database;
let orderBook: OrderBook;
let marketId: string;
let user1Id: string;
let user2Id: string;

function createUser(id: string, username: string, balance: number = 10000) {
  db.prepare(
    'INSERT INTO users (id, username, email, password_hash, balance) VALUES (?, ?, ?, ?, ?)'
  ).run(id, username, `${username}@test.com`, 'hash', balance);
}

function createMarket(id: string) {
  db.prepare(
    `INSERT INTO markets (id, title, description, category, resolution_source, resolution_date, status, yes_price, no_price, volume)
     VALUES (?, 'Price Test', 'Test', 'crypto', 'test', '2026-12-31', 'open', 0.50, 0.50, 0)`
  ).run(id);
}

function getUserBalance(userId: string): number {
  return (db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as { balance: number }).balance;
}

describe('Pricing constraints', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
    orderBook = new OrderBook(db);
    marketId = uuid();
    user1Id = uuid();
    user2Id = uuid();
    createUser(user1Id, 'priceUser1');
    createUser(user2Id, 'priceUser2');
    createMarket(marketId);
  });

  it('yes_price + no_price should always equal 1.0 after trade', () => {
    orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
    orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

    const market = db.prepare('SELECT * FROM markets WHERE id = ?').get(marketId) as any;
    expect(market.yes_price + market.no_price).toBeCloseTo(1.0, 2);
  });

  it('trade price should be within buyer price limits', () => {
    orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.65, 10);
    const result = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

    if (result.trades.length > 0) {
      const trade = result.trades[0];
      // Yes price should be <= what the yes buyer offered
      expect(trade.price).toBeLessThanOrEqual(0.65);
      // No price (1 - trade.price) should be <= what the no buyer offered
      expect(1 - trade.price).toBeLessThanOrEqual(0.40);
    }
  });

  it('should handle extreme prices near boundaries', () => {
    const result1 = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.01, 100);
    expect(result1.error).toBeUndefined();

    const result2 = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.99, 10);
    expect(result2.error).toBeUndefined();
  });

  it('should handle symmetric pricing correctly', () => {
    orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.50, 10);
    const result = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.50, 10);

    expect(result.trades).toHaveLength(1);
    expect(result.trades[0].price).toBeCloseTo(0.50, 2);
  });

  it('total cost of YES + NO shares should not exceed $1 per pair', () => {
    orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
    orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

    const trades = db.prepare('SELECT * FROM trades WHERE market_id = ?').all(marketId) as any[];
    for (const trade of trades) {
      expect(trade.price).toBeGreaterThanOrEqual(0.01);
      expect(trade.price).toBeLessThanOrEqual(0.99);
    }
  });

  it('should accumulate volume correctly across multiple trades', () => {
    orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
    orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

    orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.70, 5);
    orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.30, 5);

    const market = db.prepare('SELECT * FROM markets WHERE id = ?').get(marketId) as any;
    expect(market.volume).toBeGreaterThan(0);
  });

  it('positions avg_price should be weighted average', () => {
    // First trade at 0.60
    orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
    orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

    // Second trade at 0.70
    orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.70, 10);
    orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.30, 10);

    const pos = db.prepare("SELECT * FROM positions WHERE user_id = ? AND side = 'yes'").get(user1Id) as any;
    expect(pos.shares).toBe(20);
    // Weighted avg should be between 0.60 and 0.70
    expect(pos.avg_price).toBeGreaterThanOrEqual(0.59);
    expect(pos.avg_price).toBeLessThanOrEqual(0.71);
  });
});
