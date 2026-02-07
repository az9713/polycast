import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export async function GET() {
  try {
    const db = initializeDatabase();

    // Get leaderboard: users ranked by total P&L (realized + unrealized estimate)
    const leaders = db.prepare(`
      SELECT
        u.id,
        u.username,
        u.balance,
        COALESCE(SUM(p.realized_pnl), 0) as total_realized_pnl,
        COUNT(DISTINCT p.market_id) as markets_traded,
        COALESCE(SUM(p.shares), 0) as total_shares
      FROM users u
      LEFT JOIN positions p ON u.id = p.user_id AND p.shares > 0
      GROUP BY u.id
      ORDER BY (u.balance + COALESCE(SUM(p.realized_pnl), 0)) DESC
      LIMIT 50
    `).all();

    // Get trade counts per user
    const tradeCounts = db.prepare(`
      SELECT o.user_id, COUNT(DISTINCT t.id) as trade_count
      FROM orders o
      JOIN trades t ON t.buyer_order_id = o.id OR t.seller_order_id = o.id
      GROUP BY o.user_id
    `).all() as { user_id: string; trade_count: number }[];

    const tradeCountMap = new Map(tradeCounts.map(tc => [tc.user_id, tc.trade_count]));

    const leaderboard = (leaders as any[]).map((leader, idx) => ({
      rank: idx + 1,
      id: leader.id,
      username: leader.username,
      balance: leader.balance,
      totalPnl: parseFloat((leader.balance - 1000 + leader.total_realized_pnl).toFixed(2)),
      totalRealizedPnl: parseFloat(leader.total_realized_pnl.toFixed(2)),
      marketsTraded: leader.markets_traded,
      tradeCount: tradeCountMap.get(leader.id) || 0,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
