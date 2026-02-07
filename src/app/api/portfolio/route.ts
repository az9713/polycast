import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const db = initializeDatabase();

    // Get all positions with market info
    const positions = db.prepare(`
      SELECT
        p.id,
        p.side,
        p.shares,
        p.avg_price,
        p.realized_pnl,
        m.id as market_id,
        m.title as market_title,
        m.yes_price,
        m.no_price,
        m.status as market_status
      FROM positions p
      JOIN markets m ON p.market_id = m.id
      WHERE p.user_id = ? AND p.shares > 0
      ORDER BY p.shares DESC
    `).all(user.id);

    // Calculate unrealized P&L for each position
    const positionsWithPnl = positions.map((pos: any) => {
      const currentPrice = pos.side === 'yes' ? pos.yes_price : pos.no_price;
      const unrealizedPnl = (currentPrice - pos.avg_price) * pos.shares;
      return {
        ...pos,
        current_price: currentPrice,
        unrealized_pnl: parseFloat(unrealizedPnl.toFixed(2)),
      };
    });

    // Get open orders
    const openOrders = db.prepare(`
      SELECT o.*, m.title as market_title
      FROM orders o
      JOIN markets m ON o.market_id = m.id
      WHERE o.user_id = ? AND o.status IN ('open', 'partial')
      ORDER BY o.created_at DESC
    `).all(user.id);

    // Total unrealized P&L
    const totalUnrealizedPnl = positionsWithPnl.reduce(
      (sum: number, p: any) => sum + p.unrealized_pnl, 0
    );

    // Total realized P&L
    const totalRealizedPnl = positionsWithPnl.reduce(
      (sum: number, p: any) => sum + p.realized_pnl, 0
    );

    return NextResponse.json({
      balance: user.balance,
      positions: positionsWithPnl,
      openOrders,
      totalUnrealizedPnl: parseFloat(totalUnrealizedPnl.toFixed(2)),
      totalRealizedPnl: parseFloat(totalRealizedPnl.toFixed(2)),
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
