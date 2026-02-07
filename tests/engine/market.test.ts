import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { MarketManager } from '@/lib/engine/market';
import { OrderBook } from '@/lib/engine/orderbook';
import { runMigrations } from '@/lib/db/migrations';
import { v4 as uuid } from 'uuid';

let db: Database.Database;
let marketManager: MarketManager;
let orderBook: OrderBook;

function createUser(id: string, username: string, balance: number = 1000) {
  db.prepare(
    'INSERT INTO users (id, username, email, password_hash, balance) VALUES (?, ?, ?, ?, ?)'
  ).run(id, username, `${username}@test.com`, 'hash', balance);
}

function getUserBalance(userId: string): number {
  return (db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as { balance: number }).balance;
}

describe('MarketManager', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
    marketManager = new MarketManager(db);
    orderBook = new OrderBook(db);
  });

  describe('createMarket', () => {
    it('should create a market with default price', () => {
      const market = marketManager.createMarket({
        title: 'Test Market',
        description: 'A test market',
        category: 'crypto',
        resolution_source: 'CoinGecko',
        resolution_date: '2026-12-31',
      });

      expect(market.id).toBeDefined();
      expect(market.title).toBe('Test Market');
      expect(market.status).toBe('open');
      expect(market.yes_price).toBe(0.50);
      expect(market.no_price).toBe(0.50);
      expect(market.volume).toBe(0);
    });

    it('should create a market with custom initial price', () => {
      const market = marketManager.createMarket({
        title: 'Crypto Market',
        description: 'Will BTC moon?',
        category: 'crypto',
        resolution_source: 'CoinGecko',
        resolution_date: '2026-12-31',
        initial_yes_price: 0.75,
      });

      expect(market.yes_price).toBe(0.75);
      expect(market.no_price).toBe(0.25);
    });
  });

  describe('getMarket', () => {
    it('should return a market by id', () => {
      const created = marketManager.createMarket({
        title: 'Test', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });
      const fetched = marketManager.getMarket(created.id);
      expect(fetched).toBeDefined();
      expect(fetched!.title).toBe('Test');
    });

    it('should return undefined for non-existent market', () => {
      expect(marketManager.getMarket('nonexistent')).toBeUndefined();
    });
  });

  describe('listMarkets', () => {
    it('should list all markets', () => {
      marketManager.createMarket({
        title: 'Market 1', description: 'Test', category: 'crypto',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });
      marketManager.createMarket({
        title: 'Market 2', description: 'Test', category: 'politics',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      const markets = marketManager.listMarkets();
      expect(markets).toHaveLength(2);
    });

    it('should filter by category', () => {
      marketManager.createMarket({
        title: 'Crypto Market', description: 'Test', category: 'crypto',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });
      marketManager.createMarket({
        title: 'Politics Market', description: 'Test', category: 'politics',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      const crypto = marketManager.listMarkets('crypto');
      expect(crypto).toHaveLength(1);
      expect(crypto[0].title).toBe('Crypto Market');
    });

    it('should return all when category is "all"', () => {
      marketManager.createMarket({
        title: 'M1', description: 'Test', category: 'crypto',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });
      marketManager.createMarket({
        title: 'M2', description: 'Test', category: 'sports',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      expect(marketManager.listMarkets('all')).toHaveLength(2);
    });
  });

  describe('resolveMarket', () => {
    it('should resolve a market as YES and pay winners', () => {
      const market = marketManager.createMarket({
        title: 'Test', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      const u1 = uuid(), u2 = uuid();
      createUser(u1, 'winner');
      createUser(u2, 'loser');

      // Trade: u1 buys YES at 0.60, u2 buys NO at 0.40
      orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
      orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.40, 10);

      const balanceBeforeResolve1 = getUserBalance(u1);
      const balanceBeforeResolve2 = getUserBalance(u2);

      const result = marketManager.resolveMarket(market.id, 'yes');
      expect(result.success).toBe(true);

      const resolved = marketManager.getMarket(market.id);
      expect(resolved!.status).toBe('resolved_yes');
      expect(resolved!.yes_price).toBe(1.0);
      expect(resolved!.no_price).toBe(0.0);

      // Winner (u1) gets $1 per share = $10
      expect(getUserBalance(u1)).toBeCloseTo(balanceBeforeResolve1 + 10, 0);
      // Loser (u2) gets nothing extra
      expect(getUserBalance(u2)).toBeCloseTo(balanceBeforeResolve2, 0);
    });

    it('should resolve a market as NO and pay winners', () => {
      const market = marketManager.createMarket({
        title: 'Test', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      const u1 = uuid(), u2 = uuid();
      createUser(u1, 'yesBuyer');
      createUser(u2, 'noBuyer');

      orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
      orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.40, 10);

      const balanceBefore2 = getUserBalance(u2);
      marketManager.resolveMarket(market.id, 'no');

      // NO buyer wins — gets $1 per share = $10
      expect(getUserBalance(u2)).toBeCloseTo(balanceBefore2 + 10, 0);
    });

    it('should cancel open orders on resolution', () => {
      const market = marketManager.createMarket({
        title: 'Test', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      const u1 = uuid();
      createUser(u1, 'openOrder');

      orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
      const balBefore = getUserBalance(u1);

      marketManager.resolveMarket(market.id, 'yes');

      // Open order should be refunded: 0.60 * 10 = 6.00
      expect(getUserBalance(u1)).toBeCloseTo(balBefore + 6.00, 1);
    });

    it('should not resolve an already resolved market', () => {
      const market = marketManager.createMarket({
        title: 'Test', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      marketManager.resolveMarket(market.id, 'yes');
      const result = marketManager.resolveMarket(market.id, 'no');
      expect(result.success).toBe(false);
      expect(result.error).toBe('Market is not open');
    });

    it('should not resolve a non-existent market', () => {
      const result = marketManager.resolveMarket('fake', 'yes');
      expect(result.success).toBe(false);
    });

    it('should update realized P&L for positions on resolution', () => {
      const market = marketManager.createMarket({
        title: 'PnL Test', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      const u1 = uuid(), u2 = uuid();
      createUser(u1, 'pnlWinner');
      createUser(u2, 'pnlLoser');

      orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
      orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.40, 10);

      marketManager.resolveMarket(market.id, 'yes');

      const winPos = db.prepare("SELECT * FROM positions WHERE user_id = ? AND side = 'yes'").get(u1) as any;
      const losePos = db.prepare("SELECT * FROM positions WHERE user_id = ? AND side = 'no'").get(u2) as any;

      expect(winPos.realized_pnl).toBeGreaterThan(0);
      expect(losePos.realized_pnl).toBeLessThan(0);
    });
  });

  describe('cancelMarket', () => {
    it('should cancel a market and refund orders', () => {
      const market = marketManager.createMarket({
        title: 'Test', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      const u1 = uuid();
      createUser(u1, 'canceller');
      orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
      const balBefore = getUserBalance(u1);

      const result = marketManager.cancelMarket(market.id);
      expect(result.success).toBe(true);

      const cancelled = marketManager.getMarket(market.id);
      expect(cancelled!.status).toBe('cancelled');

      // Refunded
      expect(getUserBalance(u1)).toBeCloseTo(balBefore + 6.00, 1);
    });

    it('should refund positions on cancellation', () => {
      const market = marketManager.createMarket({
        title: 'Test', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      const u1 = uuid(), u2 = uuid();
      createUser(u1, 'posUser1');
      createUser(u2, 'posUser2');

      orderBook.placeOrder(u1, market.id, 'yes', 'limit', 0.60, 10);
      orderBook.placeOrder(u2, market.id, 'no', 'limit', 0.40, 10);

      const bal1Before = getUserBalance(u1);
      const bal2Before = getUserBalance(u2);

      marketManager.cancelMarket(market.id);

      // Both should get position costs refunded
      expect(getUserBalance(u1)).toBeGreaterThan(bal1Before);
      expect(getUserBalance(u2)).toBeGreaterThan(bal2Before);
    });

    it('should not cancel an already resolved market', () => {
      const market = marketManager.createMarket({
        title: 'Test', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });
      marketManager.resolveMarket(market.id, 'yes');
      const result = marketManager.cancelMarket(market.id);
      expect(result.success).toBe(false);
    });
  });
});
