import * as SQLite from "expo-sqlite";

const DB_NAME = "climbing.db";

/**
 * Schema migrations, applied in order. The schema version is stored in
 * `PRAGMA user_version`: migration N brings the database to version N + 1.
 *
 * Never edit a migration that has already shipped: add a new one instead,
 * otherwise existing installs won't receive the change.
 */
const MIGRATIONS: string[] = [
  // v1 — initial schema (IF NOT EXISTS: installs from before migrations
  // already have this table and only need the version bump)
  `CREATE TABLE IF NOT EXISTS climbs (
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
  );`,
];

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

/**
 * Returns the shared database connection. The promise is cached so that
 * concurrent callers at startup don't open the database twice.
 */
export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  dbPromise ??= openDatabase().catch((e) => {
    dbPromise = null; // allow a retry
    throw e;
  });
  return dbPromise;
}

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const db = await SQLite.openDatabaseAsync(DB_NAME);
  await migrate(db);
  return db;
}

async function migrate(db: SQLite.SQLiteDatabase): Promise<void> {
  const row = await db.getFirstAsync<{ user_version: number }>(
    "PRAGMA user_version",
  );
  const current = row?.user_version ?? 0;

  for (let version = current; version < MIGRATIONS.length; version++) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(MIGRATIONS[version]);
      await db.execAsync(`PRAGMA user_version = ${version + 1}`);
    });
  }
}
