import type Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import type { Market, MarketStatus, Position } from './types';

export class MarketManager {
  constructor(private db: Database.Database) {}

  createMarket(params: {
    title: string;
    description: string;
    category: string;
    resolution_source: string;
    resolution_date: string;
    initial_yes_price?: number;
  }): Market {
    const id = uuid();
    const yesPrice = params.initial_yes_price ?? 0.50;
    const noPrice = parseFloat((1 - yesPrice).toFixed(2));
    const now = new Date().toISOString();

    this.db.prepare(
      `INSERT INTO markets (id, title, description, category, resolution_source, resolution_date, status, yes_price, no_price, volume, created_at)
       VALUES (?, ?, ?, ?, ?, ?, 'open', ?, ?, 0, ?)`
    ).run(id, params.title, params.description, params.category,
          params.resolution_source, params.resolution_date, yesPrice, noPrice, now);

    return this.db.prepare('SELECT * FROM markets WHERE id = ?').get(id) as Market;
  }

  getMarket(id: string): Market | undefined {
    return this.db.prepare('SELECT * FROM markets WHERE id = ?').get(id) as Market | undefined;
  }

  listMarkets(category?: string): Market[] {
    if (category && category !== 'all') {
      return this.db.prepare(
        "SELECT * FROM markets WHERE category = ? ORDER BY volume DESC"
      ).all(category) as Market[];
    }
    return this.db.prepare(
      "SELECT * FROM markets ORDER BY volume DESC"
    ).all() as Market[];
  }

  resolveMarket(marketId: string, outcome: 'yes' | 'no'): { success: boolean; error?: string } {
    const market = this.getMarket(marketId);
    if (!market) return { success: false, error: 'Market not found' };
    if (market.status !== 'open') return { success: false, error: 'Market is not open' };

    const newStatus: MarketStatus = outcome === 'yes' ? 'resolved_yes' : 'resolved_no';

    // Update market status
    this.db.prepare('UPDATE markets SET status = ?, yes_price = ?, no_price = ? WHERE id = ?')
      .run(newStatus, outcome === 'yes' ? 1.0 : 0.0, outcome === 'yes' ? 0.0 : 1.0, marketId);

    // Cancel all open orders and refund
    const openOrders = this.db.prepare(
      "SELECT * FROM orders WHERE market_id = ? AND status IN ('open', 'partial')"
    ).all(marketId) as { id: string; user_id: string; price: number; quantity: number; filled_quantity: number }[];

    for (const order of openOrders) {
      const unfilledQty = order.quantity - order.filled_quantity;
      const refund = order.price * unfilledQty;
      this.db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(order.id);
      this.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(refund, order.user_id);
    }

    // Pay out winning positions
    const winningSide = outcome; // 'yes' or 'no'
    const winningPositions = this.db.prepare(
      'SELECT * FROM positions WHERE market_id = ? AND side = ? AND shares > 0'
    ).all(marketId, winningSide) as Position[];

    for (const pos of winningPositions) {
      // Winners get $1 per share
      const payout = pos.shares;
      const profit = payout - (pos.avg_price * pos.shares);

      this.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
        .run(payout, pos.user_id);

      this.db.prepare('UPDATE positions SET realized_pnl = realized_pnl + ? WHERE id = ?')
        .run(parseFloat(profit.toFixed(2)), pos.id);
    }

    // Update losing positions' realized P&L
    const losingSide = outcome === 'yes' ? 'no' : 'yes';
    const losingPositions = this.db.prepare(
      'SELECT * FROM positions WHERE market_id = ? AND side = ? AND shares > 0'
    ).all(marketId, losingSide) as Position[];

    for (const pos of losingPositions) {
      // Losers get $0 per share, their cost is the loss
      const loss = -(pos.avg_price * pos.shares);
      this.db.prepare('UPDATE positions SET realized_pnl = realized_pnl + ? WHERE id = ?')
        .run(parseFloat(loss.toFixed(2)), pos.id);
    }

    return { success: true };
  }

  cancelMarket(marketId: string): { success: boolean; error?: string } {
    const market = this.getMarket(marketId);
    if (!market) return { success: false, error: 'Market not found' };
    if (market.status !== 'open') return { success: false, error: 'Market is not open' };

    this.db.prepare("UPDATE markets SET status = 'cancelled' WHERE id = ?").run(marketId);

    // Refund all open orders
    const openOrders = this.db.prepare(
      "SELECT * FROM orders WHERE market_id = ? AND status IN ('open', 'partial')"
    ).all(marketId) as { id: string; user_id: string; price: number; quantity: number; filled_quantity: number }[];

    for (const order of openOrders) {
      const unfilledQty = order.quantity - order.filled_quantity;
      const refund = order.price * unfilledQty;
      this.db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(order.id);
      this.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(refund, order.user_id);
    }

    // Refund all positions at their average cost
    const positions = this.db.prepare(
      'SELECT * FROM positions WHERE market_id = ? AND shares > 0'
    ).all(marketId) as Position[];

    for (const pos of positions) {
      const refund = pos.avg_price * pos.shares;
      this.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
        .run(parseFloat(refund.toFixed(2)), pos.user_id);
    }

    return { success: true };
  }
}
