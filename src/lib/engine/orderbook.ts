import type Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import type { Order, Trade, OrderSide, OrderType, PlaceOrderResult } from './types';

/**
 * Central Limit Order Book (CLOB) for binary prediction markets.
 *
 * Key concept: In a binary market, YES + NO = $1.00.
 * A BUY YES at $0.60 is equivalent to a SELL NO at $0.40.
 * So a YES buy matches with NO buys on the opposite side when prices complement to $1.
 *
 * The book stores BUY orders for both YES and NO sides.
 * Matching happens when: yes_buy_price + no_buy_price >= 1.00
 */
export class OrderBook {
  constructor(private db: Database.Database) {}

  placeOrder(
    userId: string,
    marketId: string,
    side: OrderSide,
    type: OrderType,
    price: number,
    quantity: number
  ): PlaceOrderResult {
    // Validate inputs
    if (price < 0.01 || price > 0.99) {
      return { order: null!, trades: [], error: 'Price must be between 0.01 and 0.99' };
    }
    if (quantity <= 0 || !Number.isInteger(quantity)) {
      return { order: null!, trades: [], error: 'Quantity must be a positive integer' };
    }

    // Check market is open
    const market = this.db.prepare('SELECT status FROM markets WHERE id = ?').get(marketId) as { status: string } | undefined;
    if (!market || market.status !== 'open') {
      return { order: null!, trades: [], error: 'Market is not open for trading' };
    }

    // Check user balance
    const user = this.db.prepare('SELECT balance FROM users WHERE id = ?').get(userId) as { balance: number } | undefined;
    if (!user) {
      return { order: null!, trades: [], error: 'User not found' };
    }

    const cost = price * quantity;
    if (user.balance < cost) {
      return { order: null!, trades: [], error: 'Insufficient balance' };
    }

    // Create the order
    const orderId = uuid();
    const now = new Date().toISOString();
    const order: Order = {
      id: orderId,
      user_id: userId,
      market_id: marketId,
      side,
      type,
      price,
      quantity,
      filled_quantity: 0,
      status: 'open',
      created_at: now,
    };

    // Debit the user's balance for the full order cost
    this.db.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').run(cost, userId);

    // Insert the order
    this.db.prepare(
      `INSERT INTO orders (id, user_id, market_id, side, type, price, quantity, filled_quantity, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(order.id, order.user_id, order.market_id, order.side, order.type,
          order.price, order.quantity, order.filled_quantity, order.status, order.created_at);

    // Try to match
    const trades = this.matchOrder(order);

    // Reload order to get updated fill state
    const updatedOrder = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as Order;

    // Refund any unfilled portion if market order
    if (type === 'market' && updatedOrder.filled_quantity < updatedOrder.quantity) {
      const unfilledQty = updatedOrder.quantity - updatedOrder.filled_quantity;
      const refund = price * unfilledQty;
      this.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(refund, userId);
      this.db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ? AND status IN ('open', 'partial')").run(orderId);
    }

    const finalOrder = this.db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId) as Order;
    return { order: finalOrder, trades };
  }

  private matchOrder(incomingOrder: Order): Trade[] {
    const trades: Trade[] = [];
    const oppositeSide: OrderSide = incomingOrder.side === 'yes' ? 'no' : 'yes';

    // Get matching orders from opposite side
    // A YES buy at price P matches with NO buys where no_price >= (1 - P)
    // Ordered by best price first (highest no_price = best match for yes buyer), then time
    const complementPrice = parseFloat((1 - incomingOrder.price).toFixed(2));

    const matchingOrders = this.db.prepare(
      `SELECT * FROM orders
       WHERE market_id = ? AND side = ? AND status IN ('open', 'partial')
       AND price >= ?
       ORDER BY price DESC, created_at ASC`
    ).all(incomingOrder.market_id, oppositeSide, complementPrice) as Order[];

    let remainingQty = incomingOrder.quantity - incomingOrder.filled_quantity;

    for (const matchOrder of matchingOrders) {
      if (remainingQty <= 0) break;
      // Don't match against own orders
      if (matchOrder.user_id === incomingOrder.user_id) continue;

      const availableQty = matchOrder.quantity - matchOrder.filled_quantity;
      const fillQty = Math.min(remainingQty, availableQty);

      // Trade price: the yes_price for the trade
      // If incoming is YES buy, trade price = 1 - match_no_price (or incoming price, whichever favors the resting order)
      // Price improvement goes to the incoming order
      const tradeYesPrice = incomingOrder.side === 'yes'
        ? parseFloat((1 - matchOrder.price).toFixed(2))
        : parseFloat((1 - incomingOrder.price).toFixed(2));

      const tradeId = uuid();
      const now = new Date().toISOString();

      // Determine buyer/seller order IDs
      // In a binary market, both sides are "buying" their respective outcomes
      // The trade records the two counterparty orders
      const trade: Trade = {
        id: tradeId,
        market_id: incomingOrder.market_id,
        buyer_order_id: incomingOrder.id,
        seller_order_id: matchOrder.id,
        price: tradeYesPrice,
        quantity: fillQty,
        created_at: now,
      };

      // Insert trade
      this.db.prepare(
        `INSERT INTO trades (id, market_id, buyer_order_id, seller_order_id, price, quantity, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      ).run(trade.id, trade.market_id, trade.buyer_order_id, trade.seller_order_id,
            trade.price, trade.quantity, trade.created_at);

      trades.push(trade);

      // Update fill quantities
      this.db.prepare(
        'UPDATE orders SET filled_quantity = filled_quantity + ? WHERE id = ?'
      ).run(fillQty, incomingOrder.id);

      this.db.prepare(
        'UPDATE orders SET filled_quantity = filled_quantity + ? WHERE id = ?'
      ).run(fillQty, matchOrder.id);

      // Update order statuses
      this.updateOrderStatus(incomingOrder.id);
      this.updateOrderStatus(matchOrder.id);

      // Handle price improvement refund
      // If incoming YES buyer gets a better price than they offered
      if (incomingOrder.side === 'yes') {
        const priceDiff = incomingOrder.price - tradeYesPrice;
        if (priceDiff > 0.001) {
          this.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
            .run(parseFloat((priceDiff * fillQty).toFixed(2)), incomingOrder.user_id);
        }
      } else {
        const priceDiff = incomingOrder.price - (1 - tradeYesPrice);
        if (priceDiff > 0.001) {
          this.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?')
            .run(parseFloat((priceDiff * fillQty).toFixed(2)), incomingOrder.user_id);
        }
      }

      // Update positions for both parties
      this.updatePosition(incomingOrder.user_id, incomingOrder.market_id, incomingOrder.side, fillQty,
        incomingOrder.side === 'yes' ? tradeYesPrice : (1 - tradeYesPrice));
      this.updatePosition(matchOrder.user_id, matchOrder.market_id, matchOrder.side, fillQty, matchOrder.price);

      // Update volume
      this.db.prepare('UPDATE markets SET volume = volume + ? WHERE id = ?')
        .run(parseFloat((tradeYesPrice * fillQty).toFixed(2)), incomingOrder.market_id);

      // Update market yes_price to last trade price
      this.db.prepare('UPDATE markets SET yes_price = ?, no_price = ? WHERE id = ?')
        .run(tradeYesPrice, parseFloat((1 - tradeYesPrice).toFixed(2)), incomingOrder.market_id);

      remainingQty -= fillQty;
    }

    return trades;
  }

  private updateOrderStatus(orderId: string): void {
    const order = this.db.prepare('SELECT quantity, filled_quantity FROM orders WHERE id = ?').get(orderId) as
      { quantity: number; filled_quantity: number };

    let status: string;
    if (order.filled_quantity >= order.quantity) {
      status = 'filled';
    } else if (order.filled_quantity > 0) {
      status = 'partial';
    } else {
      status = 'open';
    }

    this.db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, orderId);
  }

  private updatePosition(
    userId: string,
    marketId: string,
    side: OrderSide,
    shares: number,
    price: number
  ): void {
    const existing = this.db.prepare(
      'SELECT * FROM positions WHERE user_id = ? AND market_id = ? AND side = ?'
    ).get(userId, marketId, side) as { id: string; shares: number; avg_price: number; realized_pnl: number } | undefined;

    if (existing) {
      // Calculate new weighted average price
      const totalShares = existing.shares + shares;
      const newAvgPrice = totalShares > 0
        ? (existing.avg_price * existing.shares + price * shares) / totalShares
        : 0;

      this.db.prepare(
        'UPDATE positions SET shares = ?, avg_price = ? WHERE id = ?'
      ).run(totalShares, parseFloat(newAvgPrice.toFixed(4)), existing.id);
    } else {
      this.db.prepare(
        'INSERT INTO positions (id, user_id, market_id, side, shares, avg_price, realized_pnl) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).run(uuid(), userId, marketId, side, shares, price, 0);
    }
  }

  getOrderBook(marketId: string): { yesBids: Order[]; noBids: Order[] } {
    const yesBids = this.db.prepare(
      `SELECT * FROM orders WHERE market_id = ? AND side = 'yes' AND status IN ('open', 'partial')
       ORDER BY price DESC, created_at ASC`
    ).all(marketId) as Order[];

    const noBids = this.db.prepare(
      `SELECT * FROM orders WHERE market_id = ? AND side = 'no' AND status IN ('open', 'partial')
       ORDER BY price DESC, created_at ASC`
    ).all(marketId) as Order[];

    return { yesBids, noBids };
  }

  cancelOrder(orderId: string, userId: string): { success: boolean; error?: string } {
    const order = this.db.prepare(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?'
    ).get(orderId, userId) as Order | undefined;

    if (!order) return { success: false, error: 'Order not found' };
    if (order.status === 'filled' || order.status === 'cancelled') {
      return { success: false, error: 'Order cannot be cancelled' };
    }

    const unfilledQty = order.quantity - order.filled_quantity;
    const refund = order.price * unfilledQty;

    this.db.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").run(orderId);
    this.db.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').run(refund, userId);

    return { success: true };
  }
}
