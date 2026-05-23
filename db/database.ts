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
      route      TEXT    NOT NULL,
      grade      TEXT    NOT NULL,
      style      TEXT    NOT NULL,
      mode       TEXT    NOT NULL,
      attempts   INTEGER NOT NULL DEFAULT 1,
      difficulty INTEGER NOT NULL,
      notes      TEXT,

      CONSTRAINT check_style_mode CHECK (
        (style = 'lead' AND mode IN ('lead_onsight', 'lead_flash', 'lead_redpoint', 'lead_hangdog', 'lead_failure')) OR
        (style = 'follow' AND mode IN ('follow_success', 'follow_failure'))
      )
    );
  `);
}
