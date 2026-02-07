import { NextRequest, NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';
import { MarketManager } from '@/lib/engine/market';
import { getCurrentUser } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const db = initializeDatabase();
    const marketManager = new MarketManager(db);
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const markets = marketManager.listMarkets(category);
    return NextResponse.json(markets);
  } catch (error) {
    console.error('Error fetching markets:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, resolution_source, resolution_date, initial_yes_price } = body;

    if (!title || !description || !category || !resolution_source || !resolution_date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = initializeDatabase();
    const marketManager = new MarketManager(db);
    const market = marketManager.createMarket({
      title,
      description,
      category,
      resolution_source,
      resolution_date,
      initial_yes_price,
    });

    return NextResponse.json(market, { status: 201 });
  } catch (error) {
    console.error('Error creating market:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
