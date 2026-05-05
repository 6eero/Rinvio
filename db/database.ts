import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!db) {
    db = await SQLite.openDatabaseAsync("climbing.db");
    await initSchema(db);
  }
  return db;
}

export function resetDatabase(): void {
  db = null;
}

async function initSchema(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS climbs (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      date       TEXT    NOT NULL,
      crag       TEXT    NOT NULL,
      routeName  TEXT    NOT NULL,
      grade      TEXT    NOT NULL,
      outcome    TEXT    NOT NULL,
      attempts   INTEGER NOT NULL DEFAULT 1,
      mode       TEXT    NOT NULL,
      style      TEXT    NOT NULL,
      difficulty INTEGER NOT NULL,
      notes      TEXT
    );
  `);
}
