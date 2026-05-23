import { Climb, ClimbInput } from "../types/climb";
import { getDatabase } from "./database";

export async function getAllClimbs(): Promise<Climb[]> {
  const db = await getDatabase();
  return db.getAllAsync<Climb>("SELECT * FROM climbs ORDER BY date DESC");
}

export async function getClimbById(id: number): Promise<Climb | null> {
  const db = await getDatabase();
  return db.getFirstAsync<Climb>("SELECT * FROM climbs WHERE id = ?", [id]);
}

export async function insertClimb(climb: ClimbInput): Promise<number> {
  const db = await getDatabase();
  const result = await db.runAsync(
    `INSERT INTO climbs (date, crag, route, grade, attempts, mode, style, difficulty, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      climb.date,
      climb.crag,
      climb.route,
      climb.grade,
      climb.attempts,
      climb.mode,
      climb.style,
      climb.difficulty,
      climb.notes ?? null,
    ],
  );
  return result.lastInsertRowId;
}

export async function updateClimb(
  id: number,
  climb: ClimbInput,
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    `UPDATE climbs
     SET date=?, crag=?, route=?, grade=?,
         attempts=?, mode=?, style=?, difficulty=?, notes=?
     WHERE id=?`,
    [
      climb.date,
      climb.crag,
      climb.route,
      climb.grade,
      climb.attempts,
      climb.mode,
      climb.style,
      climb.difficulty,
      climb.notes ?? null,
      id,
    ],
  );
}

export async function deleteClimb(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync("DELETE FROM climbs WHERE id = ?", [id]);
}
