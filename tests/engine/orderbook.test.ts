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
let user3Id: string;

function createUser(id: string, username: string, balance: number = 1000) {
  db.prepare(
    'INSERT INTO users (id, username, email, password_hash, balance) VALUES (?, ?, ?, ?, ?)'
  ).run(id, username, `${username}@test.com`, 'hash', balance);
}

function createMarket(id: string, title: string = 'Test Market') {
  db.prepare(
    `INSERT INTO markets (id, title, description, category, resolution_source, resolution_date, status, yes_price, no_price, volume)
     VALUES (?, ?, 'Test', 'crypto', 'test', '2026-12-31', 'open', 0.50, 0.50, 0)`
  ).run(id, title);
}

function getUserBalance(userId: string): number {
  return (db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as { balance: number }).balance;
}

describe('OrderBook', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
    orderBook = new OrderBook(db);

    marketId = uuid();
    user1Id = uuid();
    user2Id = uuid();
    user3Id = uuid();

    createUser(user1Id, 'trader1');
    createUser(user2Id, 'trader2');
    createUser(user3Id, 'trader3');
    createMarket(marketId);
  });

  describe('Basic order placement', () => {
    it('should place a YES limit order', () => {
      const result = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      expect(result.error).toBeUndefined();
      expect(result.order).toBeDefined();
      expect(result.order.side).toBe('yes');
      expect(result.order.price).toBe(0.60);
      expect(result.order.quantity).toBe(10);
      expect(result.order.status).toBe('open');
    });

    it('should place a NO limit order', () => {
      const result = orderBook.placeOrder(user1Id, marketId, 'no', 'limit', 0.40, 10);
      expect(result.error).toBeUndefined();
      expect(result.order.side).toBe('no');
    });

    it('should debit user balance on order placement', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      expect(getUserBalance(user1Id)).toBeCloseTo(994, 0); // 1000 - 6.00
    });

    it('should reject order with price below 0.01', () => {
      const result = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.005, 10);
      expect(result.error).toBe('Price must be between 0.01 and 0.99');
    });

    it('should reject order with price above 0.99', () => {
      const result = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 1.00, 10);
      expect(result.error).toBe('Price must be between 0.01 and 0.99');
    });

    it('should reject order with zero quantity', () => {
      const result = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.50, 0);
      expect(result.error).toBe('Quantity must be a positive integer');
    });

    it('should reject order with non-integer quantity', () => {
      const result = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.50, 5.5);
      expect(result.error).toBe('Quantity must be a positive integer');
    });

    it('should reject order with insufficient balance', () => {
      const result = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 2000);
      expect(result.error).toBe('Insufficient balance');
    });

    it('should reject order on non-existent market', () => {
      const result = orderBook.placeOrder(user1Id, 'fake-market', 'yes', 'limit', 0.50, 10);
      expect(result.error).toBe('Market is not open for trading');
    });

    it('should reject order for non-existent user', () => {
      const result = orderBook.placeOrder('fake-user', marketId, 'yes', 'limit', 0.50, 10);
      expect(result.error).toBe('User not found');
    });
  });

  describe('Order matching', () => {
    it('should match a YES buy with a NO buy when prices complement to >= 1', () => {
      // User1 buys YES at 0.60
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      // User2 buys NO at 0.40 — complement = 0.60, so YES at 0.60 + NO at 0.40 = 1.00
      const result = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

      expect(result.trades).toHaveLength(1);
      expect(result.trades[0].quantity).toBe(10);
      expect(result.order.status).toBe('filled');
    });

    it('should match a YES buy with a NO buy when prices sum exceeds 1', () => {
      // User1 buys YES at 0.65
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.65, 10);
      // User2 buys NO at 0.45 — complement = 0.55. YES at 0.65 >= complement 0.55
      const result = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.45, 10);

      expect(result.trades).toHaveLength(1);
      expect(result.trades[0].quantity).toBe(10);
    });

    it('should NOT match when prices do not complement', () => {
      // User1 buys YES at 0.40
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.40, 10);
      // User2 buys NO at 0.40 — complement = 0.60. YES at 0.40 < 0.60, no match
      const result = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

      expect(result.trades).toHaveLength(0);
      expect(result.order.status).toBe('open');
    });

    it('should handle partial fills', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 20);
      const result = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

      expect(result.trades).toHaveLength(1);
      expect(result.trades[0].quantity).toBe(10);
      expect(result.order.status).toBe('filled');

      // Check the original order is partial
      const originalOrder = db.prepare('SELECT * FROM orders WHERE user_id = ? AND side = ?').get(user1Id, 'yes') as any;
      expect(originalOrder.filled_quantity).toBe(10);
      expect(originalOrder.status).toBe('partial');
    });

    it('should match against multiple resting orders', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 5);
      orderBook.placeOrder(user3Id, marketId, 'yes', 'limit', 0.60, 5);

      const result = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

      expect(result.trades).toHaveLength(2);
      expect(result.trades[0].quantity).toBe(5);
      expect(result.trades[1].quantity).toBe(5);
      expect(result.order.status).toBe('filled');
    });

    it('should respect price-time priority', () => {
      // User1 places at 0.60, then user3 places at 0.65
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      orderBook.placeOrder(user3Id, marketId, 'yes', 'limit', 0.65, 10);

      // User2 buys NO at 0.40 — should match with user3's 0.65 first (better price = complement 0.35)
      const result = orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 5);

      expect(result.trades).toHaveLength(1);
      // The match should be with user3's YES at 0.65 because it's a better price for the NO buyer
    });

    it('should not match orders from the same user', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      const result = orderBook.placeOrder(user1Id, marketId, 'no', 'limit', 0.40, 10);

      expect(result.trades).toHaveLength(0);
    });

    it('should update market yes_price after trade', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.70, 10);
      orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.30, 10);

      const market = db.prepare('SELECT * FROM markets WHERE id = ?').get(marketId) as any;
      expect(market.yes_price).toBeCloseTo(0.70, 1);
      expect(market.no_price).toBeCloseTo(0.30, 1);
    });

    it('should update market volume after trade', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

      const market = db.prepare('SELECT * FROM markets WHERE id = ?').get(marketId) as any;
      expect(market.volume).toBeGreaterThan(0);
    });

    it('should create positions after trade', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

      const pos1 = db.prepare('SELECT * FROM positions WHERE user_id = ? AND market_id = ?').get(user1Id, marketId) as any;
      const pos2 = db.prepare('SELECT * FROM positions WHERE user_id = ? AND market_id = ?').get(user2Id, marketId) as any;

      expect(pos1).toBeDefined();
      expect(pos1.shares).toBe(10);
      expect(pos1.side).toBe('yes');

      expect(pos2).toBeDefined();
      expect(pos2.shares).toBe(10);
      expect(pos2.side).toBe('no');
    });
  });

  describe('Market orders', () => {
    it('should fill a market order at best available price', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      const result = orderBook.placeOrder(user2Id, marketId, 'no', 'market', 0.40, 10);

      expect(result.trades).toHaveLength(1);
    });

    it('should cancel unfilled portion of market order', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 5);
      const result = orderBook.placeOrder(user2Id, marketId, 'no', 'market', 0.40, 10);

      expect(result.trades).toHaveLength(1);
      expect(result.trades[0].quantity).toBe(5);
      // Market order should be cancelled after partial fill (no resting)
      const finalOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.order.id) as any;
      expect(finalOrder.status).toBe('cancelled');
    });
  });

  describe('Order cancellation', () => {
    it('should cancel an open order', () => {
      const placed = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      const balanceBefore = getUserBalance(user1Id);
      const result = orderBook.cancelOrder(placed.order.id, user1Id);

      expect(result.success).toBe(true);
      expect(getUserBalance(user1Id)).toBeCloseTo(balanceBefore + 6.00, 1);
    });

    it('should not cancel a filled order', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

      const filledOrder = db.prepare("SELECT * FROM orders WHERE user_id = ? AND status = 'filled'").get(user1Id) as any;
      const result = orderBook.cancelOrder(filledOrder.id, user1Id);
      expect(result.success).toBe(false);
    });

    it('should not cancel another user order', () => {
      const placed = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      const result = orderBook.cancelOrder(placed.order.id, user2Id);
      expect(result.success).toBe(false);
    });

    it('should refund only unfilled portion on partial cancel', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 20);
      orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.40, 10);

      const partialOrder = db.prepare("SELECT * FROM orders WHERE user_id = ? AND status = 'partial'").get(user1Id) as any;
      const balanceBefore = getUserBalance(user1Id);
      orderBook.cancelOrder(partialOrder.id, user1Id);
      // Refund: 0.60 * 10 unfilled = 6.00
      expect(getUserBalance(user1Id)).toBeCloseTo(balanceBefore + 6.00, 1);
    });
  });

  describe('getOrderBook', () => {
    it('should return open orders grouped by side', () => {
      orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      orderBook.placeOrder(user2Id, marketId, 'no', 'limit', 0.30, 10);
      orderBook.placeOrder(user3Id, marketId, 'yes', 'limit', 0.55, 5);

      const book = orderBook.getOrderBook(marketId);
      expect(book.yesBids).toHaveLength(2);
      expect(book.noBids).toHaveLength(1);
      // Yes bids should be sorted by price DESC
      expect(book.yesBids[0].price).toBe(0.60);
      expect(book.yesBids[1].price).toBe(0.55);
    });

    it('should not include filled or cancelled orders', () => {
      const placed = orderBook.placeOrder(user1Id, marketId, 'yes', 'limit', 0.60, 10);
      orderBook.cancelOrder(placed.order.id, user1Id);

      const book = orderBook.getOrderBook(marketId);
      expect(book.yesBids).toHaveLength(0);
    });
  });
});
