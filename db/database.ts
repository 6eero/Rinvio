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
      date       TEXT    NOT NULL CHECK(date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
      crag       TEXT    NOT NULL CHECK(length(trim(crag)) > 0),
      routeName  TEXT    NOT NULL CHECK(length(trim(routeName)) > 0),
      grade      TEXT    NOT NULL,
      outcome    TEXT    NOT NULL CHECK(outcome IN ('success', 'hangdog', 'failure')),
      attempts   INTEGER NOT NULL DEFAULT 1 CHECK(attempts >= 1),
      mode       TEXT    NOT NULL CHECK(mode IN ('onsight', 'flash', 'redpoint')),
      style      TEXT    NOT NULL CHECK(style IN ('lead', 'follow')),
      difficulty INTEGER NOT NULL CHECK(difficulty BETWEEN 1 AND 5),
      notes      TEXT
    );
  `);
}
