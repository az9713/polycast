import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { MarketManager } from '@/lib/engine/market';
import { OrderBook } from '@/lib/engine/orderbook';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = initializeDatabase();
    const marketManager = new MarketManager(db);
    const orderBook = new OrderBook(db);

    const market = marketManager.getMarket(id);
    if (!market) {
      return NextResponse.json({ error: 'Market not found' }, { status: 404 });
    }

    const book = orderBook.getOrderBook(id);

    // Get recent trades
    const trades = db.prepare(
      'SELECT * FROM trades WHERE market_id = ? ORDER BY created_at DESC LIMIT 20'
    ).all(id);

    return NextResponse.json({ market, orderBook: book, recentTrades: trades });
  } catch (error) {
    console.error('Error fetching market:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
