import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { OrderBook } from '@/lib/engine/orderbook';
import { getCurrentUser } from '@/lib/auth';
import type { OrderSide, OrderType } from '@/lib/engine/types';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: marketId } = await params;
    const body = await request.json();
    const { side, type, price, quantity } = body as {
      side: OrderSide;
      type: OrderType;
      price: number;
      quantity: number;
    };

    if (!side || !type || price === undefined || !quantity) {
      return NextResponse.json({ error: 'Missing required fields: side, type, price, quantity' }, { status: 400 });
    }

    if (!['yes', 'no'].includes(side)) {
      return NextResponse.json({ error: 'Side must be "yes" or "no"' }, { status: 400 });
    }

    if (!['limit', 'market'].includes(type)) {
      return NextResponse.json({ error: 'Type must be "limit" or "market"' }, { status: 400 });
    }

    const db = initializeDatabase();
    const orderBook = new OrderBook(db);
    const result = orderBook.placeOrder(user.id, marketId, side, type, price, quantity);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      order: result.order,
      trades: result.trades,
      tradesCount: result.trades.length,
    }, { status: 201 });
  } catch (error) {
    console.error('Error placing order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
