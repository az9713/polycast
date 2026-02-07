import type Database from 'better-sqlite3';
import { ALL_TABLES } from './schema';

export function runMigrations(db: Database.Database): void {
  for (const sql of ALL_TABLES) {
    db.exec(sql);
  }
}
