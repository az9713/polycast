import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { OrderBook } from '@/lib/engine/orderbook';
import { MarketManager } from '@/lib/engine/market';
import { runMigrations } from '@/lib/db/migrations';
import { v4 as uuid } from 'uuid';

let db: Database.Database;
let orderBook: OrderBook;
let marketManager: MarketManager;
let marketId: string;
let user1Id: string;
let user2Id: string;

function createUser(id: string, username: string, balance: number = 1000) {
  db.prepare(
    'INSERT INTO users (id, username, email, password_hash, balance) VALUES (?, ?, ?, ?, ?)'
  ).run(id, username, `${username}@test.com`, 'hash', balance);
}

describe('Orders API logic', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
    orderBook = new OrderBook(db);
    marketManager = new MarketManager(db);

    user1Id = uuid();
    user2Id = uuid();
    createUser(user1Id, 'orderUser1');
    createUser(user2Id, 'orderUser2');

    const market = marketManager.createMarket({
      title: 'Test', description: 'Test', category: 'crypto',
      resolution_source: 'test', resolution_date: '2026-12-31',
    });
    marketId = market.id;
  });

  describe('Place order validation', () => {
    it('should reject unauthenticated order', () => {
      const result = orderBook.placeOrder('nonexistent', marketId, 'yes', 'limit', 0.50, 10);
      expect(result.error).toBeDefined();
    });

    it('should reject order on closed market', () => {
      marketManager.resolveMarket(marketId, 'yes');
      const result = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.50, 10);
      expect(result.error).toBe('Market is not open for trading');
    });

    it('should validate price bounds', () => {
      expect(orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0, 10).error).toBeDefined();
      expect(orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 1, 10).error).toBeDefined();
      expect(orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', -0.5, 10).error).toBeDefined();
    });

    it('should validate quantity', () => {
      expect(orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.50, 0).error).toBeDefined();
      expect(orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.50, -5).error).toBeDefined();
    });
  });

  describe('Order execution flow', () => {
    it('should place and match a complete trade', () => {
      // Place yes order
      const yesResult = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      expect(yesResult.error).toBeUndefined();
      expect(yesResult.trades).toHaveLength(0);

      // Place matching no order
      const noResult = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);
      expect(noResult.error).toBeUndefined();
      expect(noResult.trades).toHaveLength(1);

      // Verify both orders are filled
      const order1 = db.prepare('SELECT * FROM orders WHERE id = ?').get(yesResult.order.id) as any;
      const order2 = db.prepare('SELECT * FROM orders WHERE id = ?').get(noResult.order.id) as any;
      expect(order1.status).toBe('filled');
      expect(order2.status).toBe('filled');
    });

    it('should return trade details in response', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      const result = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

      expect(result.trades).toHaveLength(1);
      expect(result.trades[0].market_id).toBe(marketId);
      expect(result.trades[0].quantity).toBe(10);
      expect(result.trades[0].price).toBeDefined();
    });

    it('should handle multiple orders building up the book', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.55, 10);
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.65, 10);

      const book = orderBook.getOrderBook(marketId);
      expect(book.yesBids).toHaveLength(3);
      expect(book.yesBids[0].price).toBe(0.65); // Best price first
    });

    it('should sweep through multiple price levels', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 5);
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.65, 5);

      // NO order at 0.40 can match both (complement 0.60 and 0.65 both >= 0.60)
      // But YES at 0.60 has complement 0.40 = exactly NO price
      // YES at 0.65 has complement 0.35 <= 0.40 so matches
      const result = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);
      expect(result.trades.length).toBeGreaterThanOrEqual(1);
    });
  });
});
