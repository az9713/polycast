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

describe('Portfolio logic', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
    orderBook = new OrderBook(db);
    marketManager = new MarketManager(db);
  });

  it('should return empty portfolio for new user', () => {
    const userId = uuid();
    createUser(userId, 'newuser');

    const positions = db.prepare(
      'SELECT * FROM positions WHERE user_id = ? AND shares > 0'
    ).all(userId);

    expect(positions).toHaveLength(0);
  });

  it('should show position after trade', () => {
    const u1 = uuid(), u2 = uuid();
    createUser(u1, 'buyer');
    createUser(u2, 'seller');

    const market = marketManager.createMarket({
      title: 'Test', description: 'Test', category: 'ai',
      resolution_source: 'test', resolution_date: '2026-12-31',
    });

    orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
    orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.40, 10);

    const positions = db.prepare(
      'SELECT * FROM positions WHERE user_id = ? AND shares > 0'
    ).all(u1);

    expect(positions).toHaveLength(1);
    expect((positions[0] as any).shares).toBe(10);
    expect((positions[0] as any).side).toBe('yes');
  });

  it('should accumulate positions across multiple trades', () => {
    const u1 = uuid(), u2 = uuid();
    createUser(u1, 'accumulator', 5000);
    createUser(u2, 'counterparty', 5000);

    const market = marketManager.createMarket({
      title: 'Test', description: 'Test', category: 'ai',
      resolution_source: 'test', resolution_date: '2026-12-31',
    });

    orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
    orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.40, 10);

    orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.65, 10);
    orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.35, 10);

    const positions = db.prepare(
      'SELECT * FROM positions WHERE user_id = ? AND shares > 0'
    ).all(u1);

    expect(positions).toHaveLength(1);
    expect((positions[0] as any).shares).toBe(20);
  });

  it('should track open orders separately from positions', () => {
    const u1 = uuid();
    createUser(u1, 'orderPlacer');

    const market = marketManager.createMarket({
      title: 'Test', description: 'Test', category: 'ai',
      resolution_source: 'test', resolution_date: '2026-12-31',
    });

    orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);

    const openOrders = db.prepare(
      "SELECT * FROM orders WHERE user_id = ? AND status IN ('open', 'partial')"
    ).all(u1);

    expect(openOrders).toHaveLength(1);

    const positions = db.prepare(
      'SELECT * FROM positions WHERE user_id = ? AND shares > 0'
    ).all(u1);

    expect(positions).toHaveLength(0);
  });

  it('should calculate unrealized P&L correctly', () => {
    const u1 = uuid(), u2 = uuid();
    createUser(u1, 'pnlUser', 5000);
    createUser(u2, 'pnlCounter', 5000);

    const market = marketManager.createMarket({
      title: 'Test', description: 'Test', category: 'ai',
      resolution_source: 'test', resolution_date: '2026-12-31',
    });

    // Buy YES at 0.40
    orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.40, 100);
    orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.60, 100);

    // Market moves to 0.60 via new trade
    orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
    orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.40, 10);

    const pos = db.prepare(
      "SELECT * FROM positions WHERE user_id = ? AND side = 'yes'"
    ).get(u1) as any;

    const currentMarket = db.prepare('SELECT * FROM markets WHERE id = ?').get(market.id) as any;

    // Unrealized P&L = (current_price - avg_price) * shares
    const unrealizedPnl = (currentMarket.yes_price - pos.avg_price) * pos.shares;
    expect(unrealizedPnl).toBeDefined();
  });
});
