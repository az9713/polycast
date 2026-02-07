import type Database from 'better-sqlite3';
import { v4 as uuid } from 'uuid';
import { hashSync } from 'bcryptjs';

export interface SeedMarket {
  id: string;
  title: string;
  description: string;
  category: string;
  resolution_source: string;
  resolution_date: string;
  yes_price: number;
  volume: number;
}

export function seedDatabase(db: Database.Database): void {
  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (existingUsers.count > 0) return;

  const insertUser = db.prepare(
    'INSERT INTO users (id, username, email, password_hash, balance) VALUES (?, ?, ?, ?, ?)'
  );
  const insertMarket = db.prepare(
    'INSERT INTO markets (id, title, description, category, resolution_source, resolution_date, yes_price, no_price, volume) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  );
  const insertPosition = db.prepare(
    'INSERT INTO positions (id, user_id, market_id, side, shares, avg_price, realized_pnl) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const seedUsers = [
    { username: 'alpha_trader', balance: 2450.00 },
    { username: 'crypto_whale', balance: 3200.50 },
    { username: 'polymath', balance: 1875.30 },
    { username: 'data_driven', balance: 950.00 },
    { username: 'contrarian', balance: 1620.75 },
    { username: 'momentum_mike', balance: 780.25 },
    { username: 'steady_sarah', balance: 1340.00 },
    { username: 'risk_taker', balance: 2100.00 },
    { username: 'hedge_fund_hank', balance: 3500.00 },
    { username: 'newbie_nancy', balance: 990.00 },
  ];

  const userIds: string[] = [];
  const transaction = db.transaction(() => {
    for (const user of seedUsers) {
      const id = uuid();
      userIds.push(id);
      insertUser.run(
        id,
        user.username,
        `${user.username}@polycast.app`,
        hashSync('password123', 10),
        user.balance
      );
    }

    const markets: SeedMarket[] = [
      // Crypto
      {
        id: uuid(), title: 'Will BTC be above $110K by Dec 31, 2026?',
        description: 'Resolves YES if the price of Bitcoin exceeds $110,000 USD on any major exchange at any point before midnight UTC on December 31, 2026.',
        category: 'crypto', resolution_source: 'CoinMarketCap', resolution_date: '2026-12-31',
        yes_price: 0.42, volume: 125000,
      },
      {
        id: uuid(), title: 'Will ETH flip BTC in market cap by 2027?',
        description: 'Resolves YES if Ethereum\'s total market capitalization exceeds Bitcoin\'s at any point before January 1, 2027.',
        category: 'crypto', resolution_source: 'CoinGecko', resolution_date: '2027-01-01',
        yes_price: 0.08, volume: 45000,
      },
      {
        id: uuid(), title: 'Will a country adopt BTC as legal tender in 2026?',
        description: 'Resolves YES if any sovereign nation officially adopts Bitcoin as legal tender during 2026. El Salvador already counts.',
        category: 'crypto', resolution_source: 'Reuters', resolution_date: '2026-12-31',
        yes_price: 0.31, volume: 67000,
      },
      // Politics
      {
        id: uuid(), title: 'Will there be a US government shutdown in 2026?',
        description: 'Resolves YES if the US federal government experiences a partial or full shutdown lasting at least 24 hours during 2026.',
        category: 'politics', resolution_source: 'Congressional Record', resolution_date: '2026-12-31',
        yes_price: 0.55, volume: 230000,
      },
      {
        id: uuid(), title: 'Will the EU pass comprehensive AI regulation by mid-2026?',
        description: 'Resolves YES if the European Union passes binding AI legislation beyond the AI Act by June 30, 2026.',
        category: 'politics', resolution_source: 'EUR-Lex', resolution_date: '2026-06-30',
        yes_price: 0.72, volume: 89000,
      },
      {
        id: uuid(), title: 'Will voter turnout exceed 60% in 2026 US midterms?',
        description: 'Resolves YES if voter turnout among eligible voters exceeds 60% in the 2026 US midterm elections.',
        category: 'politics', resolution_source: 'US Election Project', resolution_date: '2026-11-15',
        yes_price: 0.38, volume: 156000,
      },
      // Sports
      {
        id: uuid(), title: 'Will the Super Bowl LXII have over 120M viewers?',
        description: 'Resolves YES if Super Bowl LXII attracts more than 120 million total viewers across all platforms.',
        category: 'sports', resolution_source: 'Nielsen Ratings', resolution_date: '2027-02-15',
        yes_price: 0.65, volume: 340000,
      },
      {
        id: uuid(), title: 'Will a sub-2-hour marathon be officially ratified by end of 2026?',
        description: 'Resolves YES if a sub-2-hour marathon is completed under official World Athletics conditions and ratified by December 31, 2026.',
        category: 'sports', resolution_source: 'World Athletics', resolution_date: '2026-12-31',
        yes_price: 0.15, volume: 28000,
      },
      {
        id: uuid(), title: 'Will the US win the most golds at 2026 Winter Olympics?',
        description: 'Resolves YES if the United States wins the most gold medals at the 2026 Milan-Cortina Winter Olympics.',
        category: 'sports', resolution_source: 'Olympics.com', resolution_date: '2026-02-28',
        yes_price: 0.44, volume: 185000,
      },
      // AI
      {
        id: uuid(), title: 'Will AI pass the Turing test by 2027?',
        description: 'Resolves YES if an AI system passes a rigorous, independently administered Turing test with >70% of judges fooled, before January 1, 2027.',
        category: 'ai', resolution_source: 'Independent Panel', resolution_date: '2027-01-01',
        yes_price: 0.22, volume: 98000,
      },
      {
        id: uuid(), title: 'Will an AI model score >90% on all MMLU categories?',
        description: 'Resolves YES if any AI model achieves >90% accuracy on every individual MMLU category by December 31, 2026.',
        category: 'ai', resolution_source: 'Papers with Code', resolution_date: '2026-12-31',
        yes_price: 0.58, volume: 145000,
      },
      {
        id: uuid(), title: 'Will OpenAI or Anthropic IPO by end of 2026?',
        description: 'Resolves YES if either OpenAI or Anthropic completes an initial public offering by December 31, 2026.',
        category: 'ai', resolution_source: 'SEC Filings', resolution_date: '2026-12-31',
        yes_price: 0.35, volume: 210000,
      },
      // Entertainment
      {
        id: uuid(), title: 'Will the movie "Prestige III" gross over $1B?',
        description: 'Resolves YES if the hypothetical film "Prestige III" grosses over $1 billion worldwide at the box office.',
        category: 'entertainment', resolution_source: 'Box Office Mojo', resolution_date: '2026-12-31',
        yes_price: 0.28, volume: 76000,
      },
      {
        id: uuid(), title: 'Will a fully AI-generated film win a major festival award?',
        description: 'Resolves YES if a film primarily generated by AI wins an award at Cannes, Venice, Sundance, Berlin, or Toronto by end of 2026.',
        category: 'entertainment', resolution_source: 'Festival Records', resolution_date: '2026-12-31',
        yes_price: 0.12, volume: 34000,
      },
      {
        id: uuid(), title: 'Will streaming surpass cable TV subscribers worldwide by 2027?',
        description: 'Resolves YES if combined streaming subscribers worldwide exceed traditional cable/satellite subscribers before January 1, 2027.',
        category: 'entertainment', resolution_source: 'Statista', resolution_date: '2027-01-01',
        yes_price: 0.81, volume: 167000,
      },
    ];

    const marketIds: string[] = [];
    for (const market of markets) {
      insertMarket.run(
        market.id, market.title, market.description, market.category,
        market.resolution_source, market.resolution_date,
        market.yes_price, parseFloat((1 - market.yes_price).toFixed(2)), market.volume
      );
      marketIds.push(market.id);
    }

    // Create some positions for seeded users
    const positionData = [
      { userIdx: 0, marketIdx: 0, side: 'yes', shares: 150, avg_price: 0.38, pnl: 45.00 },
      { userIdx: 0, marketIdx: 3, side: 'no', shares: 200, avg_price: 0.42, pnl: -12.00 },
      { userIdx: 1, marketIdx: 0, side: 'yes', shares: 500, avg_price: 0.35, pnl: 120.50 },
      { userIdx: 1, marketIdx: 4, side: 'yes', shares: 100, avg_price: 0.65, pnl: 30.00 },
      { userIdx: 2, marketIdx: 1, side: 'no', shares: 300, avg_price: 0.88, pnl: 15.30 },
      { userIdx: 2, marketIdx: 9, side: 'yes', shares: 250, avg_price: 0.18, pnl: -5.00 },
      { userIdx: 3, marketIdx: 5, side: 'yes', shares: 100, avg_price: 0.35, pnl: 8.00 },
      { userIdx: 3, marketIdx: 10, side: 'no', shares: 180, avg_price: 0.45, pnl: -20.00 },
      { userIdx: 4, marketIdx: 6, side: 'no', shares: 400, avg_price: 0.38, pnl: 55.75 },
      { userIdx: 4, marketIdx: 11, side: 'yes', shares: 150, avg_price: 0.30, pnl: 25.00 },
      { userIdx: 5, marketIdx: 2, side: 'yes', shares: 200, avg_price: 0.28, pnl: -15.25 },
      { userIdx: 5, marketIdx: 7, side: 'no', shares: 100, avg_price: 0.82, pnl: 10.00 },
      { userIdx: 6, marketIdx: 8, side: 'yes', shares: 350, avg_price: 0.40, pnl: 40.00 },
      { userIdx: 7, marketIdx: 12, side: 'yes', shares: 600, avg_price: 0.22, pnl: 90.00 },
      { userIdx: 7, marketIdx: 13, side: 'no', shares: 250, avg_price: 0.85, pnl: 35.00 },
      { userIdx: 8, marketIdx: 14, side: 'yes', shares: 800, avg_price: 0.75, pnl: 200.00 },
      { userIdx: 8, marketIdx: 0, side: 'no', shares: 300, avg_price: 0.55, pnl: -50.00 },
      { userIdx: 9, marketIdx: 3, side: 'yes', shares: 50, avg_price: 0.52, pnl: 5.00 },
    ];

    for (const pos of positionData) {
      insertPosition.run(
        uuid(),
        userIds[pos.userIdx],
        marketIds[pos.marketIdx],
        pos.side,
        pos.shares,
        pos.avg_price,
        pos.pnl
      );
    }
  });

  transaction();
}

// Allow running as standalone script
if (typeof require !== 'undefined' && require.main === module) {
  const { getDb } = require('./connection');
  const { runMigrations } = require('./migrations');
  const db = getDb();
  runMigrations(db);
  seedDatabase(db);
  console.log('Database seeded successfully!');
}
