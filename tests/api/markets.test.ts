import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';
import { MarketManager } from '@/lib/engine/market';
import { runMigrations } from '@/lib/db/migrations';

let db: Database.Database;
let marketManager: MarketManager;

describe('Markets API logic', () => {
  beforeEach(() => {
    db = new Database(':memory:');
    db.pragma('foreign_keys = ON');
    runMigrations(db);
    marketManager = new MarketManager(db);
  });

  describe('GET all markets', () => {
    it('should return empty array when no markets exist', () => {
      const markets = marketManager.listMarkets();
      expect(markets).toEqual([]);
    });

    it('should return all markets sorted by volume', () => {
      marketManager.createMarket({
        title: 'Low Volume', description: 'Test', category: 'crypto',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });
      marketManager.createMarket({
        title: 'High Volume', description: 'Test', category: 'crypto',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      const markets = marketManager.listMarkets();
      expect(markets).toHaveLength(2);
    });

    it('should filter by category', () => {
      marketManager.createMarket({
        title: 'Crypto', description: 'Test', category: 'crypto',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });
      marketManager.createMarket({
        title: 'Sports', description: 'Test', category: 'sports',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });
      marketManager.createMarket({
        title: 'AI', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      expect(marketManager.listMarkets('crypto')).toHaveLength(1);
      expect(marketManager.listMarkets('sports')).toHaveLength(1);
      expect(marketManager.listMarkets('ai')).toHaveLength(1);
      expect(marketManager.listMarkets('all')).toHaveLength(3);
    });
  });

  describe('GET single market', () => {
    it('should return market by id', () => {
      const created = marketManager.createMarket({
        title: 'Test Market', description: 'A test', category: 'ai',
        resolution_source: 'Papers', resolution_date: '2026-12-31',
      });

      const fetched = marketManager.getMarket(created.id);
      expect(fetched).toBeDefined();
      expect(fetched!.title).toBe('Test Market');
      expect(fetched!.category).toBe('ai');
    });

    it('should return undefined for non-existent id', () => {
      expect(marketManager.getMarket('nonexistent')).toBeUndefined();
    });
  });

  describe('POST create market', () => {
    it('should create a market with all fields', () => {
      const market = marketManager.createMarket({
        title: 'Will BTC hit 100K?',
        description: 'Resolves YES if BTC exceeds $100,000',
        category: 'crypto',
        resolution_source: 'CoinGecko',
        resolution_date: '2026-12-31',
        initial_yes_price: 0.65,
      });

      expect(market.title).toBe('Will BTC hit 100K?');
      expect(market.status).toBe('open');
      expect(market.yes_price).toBe(0.65);
      expect(market.no_price).toBe(0.35);
      expect(market.volume).toBe(0);
    });

    it('should default yes_price to 0.50', () => {
      const market = marketManager.createMarket({
        title: 'Default Price', description: 'Test', category: 'ai',
        resolution_source: 'test', resolution_date: '2026-12-31',
      });

      expect(market.yes_price).toBe(0.50);
    });
  });
});
