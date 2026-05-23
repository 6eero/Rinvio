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

export async function getCragByDate(
  date: string,
  excludeId?: number,
): Promise<string | null> {
  const db = await getDatabase();
  const row = excludeId
    ? await db.getFirstAsync<{ crag: string }>(
        "SELECT crag FROM climbs WHERE date = ? AND id != ? LIMIT 1",
        [date, excludeId],
      )
    : await db.getFirstAsync<{ crag: string }>(
        "SELECT crag FROM climbs WHERE date = ? LIMIT 1",
        [date],
      );
  return row?.crag ?? null;
}

export async function seedMockData(): Promise<void> {
  const db = await getDatabase();

  const crags = ["Finale Ligure", "Arco", "Moonarie", "Céüse", "Wenden"];
  const grades = ["5c", "6a", "6a+", "6b", "6b+", "6c", "7a"];
  const leadModes = [
    "lead_onsight",
    "lead_flash",
    "lead_redpoint",
    "lead_hangdog",
    "lead_failure",
  ];
  const followModes = ["follow_success", "follow_failure"];

  const routes = [
    "Via Normale",
    "Spigolo Nord",
    "Diedro Giallo",
    "Fessura",
    "Placca Rossa",
    "Tetto",
    "Strapiombo",
  ];

  // genera date negli ultimi 6 mesi
  const dates: string[] = [];
  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    for (let j = 0; j < 4; j++) {
      d.setDate(Math.floor(Math.random() * 28) + 1);
      dates.push(d.toISOString().split("T")[0]);
    }
  }

  for (const date of dates) {
    const style = Math.random() > 0.2 ? "lead" : "follow";
    const mode =
      style === "lead"
        ? leadModes[Math.floor(Math.random() * leadModes.length)]
        : followModes[Math.floor(Math.random() * followModes.length)];
    const attempts =
      mode === "lead_onsight" || mode === "lead_flash"
        ? 1
        : Math.floor(Math.random() * 4) + 1;

    await db.runAsync(
      `INSERT INTO climbs (date, crag, route, grade, style, mode, attempts, difficulty, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        date,
        crags[Math.floor(Math.random() * crags.length)],
        routes[Math.floor(Math.random() * routes.length)],
        grades[Math.floor(Math.random() * grades.length)],
        style,
        mode,
        attempts,
        Math.floor(Math.random() * 5) + 1,
        "",
      ],
    );
  }
}
