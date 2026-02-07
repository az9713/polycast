import { getDb } from './connection';
import { runMigrations } from './migrations';
import { seedDatabase } from './seed';

let initialized = false;

export function initializeDatabase() {
  if (initialized) return getDb();
  const db = getDb();
  runMigrations(db);
  seedDatabase(db);
  initialized = true;
  return db;
}

export { getDb, closeDb, getTestDb } from './connection';
export { runMigrations } from './migrations';
export { seedDatabase } from './seed';
