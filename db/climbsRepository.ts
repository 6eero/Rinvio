import { CLIMB_COLUMNS, Climb, ClimbInput } from "@/domain/climb";
import { SQLiteDatabase } from "expo-sqlite";
import { getDatabase } from "./database";

const COLUMNS = CLIMB_COLUMNS.join(", ");
const PLACEHOLDERS = CLIMB_COLUMNS.map(() => "?").join(", ");
const ASSIGNMENTS = CLIMB_COLUMNS.map((col) => `${col} = ?`).join(", ");

type ClimbRow = Omit<Climb, "notes"> & { notes: string | null };

const fromRow = (row: ClimbRow): Climb => ({ ...row, notes: row.notes ?? "" });

/** Values in CLIMB_COLUMNS order; empty notes are stored as NULL. */
const toParams = (climb: ClimbInput) =>
  CLIMB_COLUMNS.map((col) =>
    col === "notes" ? climb.notes || null : climb[col],
  );

export async function getAllClimbs(): Promise<Climb[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ClimbRow>(
    `SELECT id, ${COLUMNS} FROM climbs ORDER BY date DESC, id DESC`,
  );
  return rows.map(fromRow);
}

export async function insertClimb(climb: ClimbInput): Promise<number> {
  const db = await getDatabase();
  return insert(db, climb);
}

export async function updateClimb(
  id: number,
  climb: ClimbInput,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(`UPDATE climbs SET ${ASSIGNMENTS} WHERE id = ?`, [
    ...toParams(climb),
    id,
  ]);
}

export async function deleteClimb(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM climbs WHERE id = ?", [id]);
}

export async function insertClimbs(climbs: ClimbInput[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    for (const climb of climbs) {
      await insert(db, climb);
    }
  });
}

/** Atomically replaces every climb (used by the CSV import). */
export async function replaceAllClimbs(climbs: ClimbInput[]): Promise<void> {
  const db = await getDatabase();
  await db.withTransactionAsync(async () => {
    await db.runAsync("DELETE FROM climbs");
    for (const climb of climbs) {
      await insert(db, climb);
    }
  });
}

async function insert(db: SQLiteDatabase, climb: ClimbInput): Promise<number> {
  const result = await db.runAsync(
    `INSERT INTO climbs (${COLUMNS}) VALUES (${PLACEHOLDERS})`,
    toParams(climb),
  );
  return result.lastInsertRowId;
}
