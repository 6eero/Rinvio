import {
  ClimbInput,
  FRENCH_GRADES,
  MODES_BY_STYLE,
  isFirstTryMode,
} from "@/domain/climb";
import { toISODate } from "@/utilities/date";
import { subMonths } from "date-fns";

// Development only: random climbs over the last 6 months.

const CRAGS = ["Finale Ligure", "Arco", "Moonarie", "Céüse", "Wenden"];
const ROUTES = [
  "Via Normale",
  "Spigolo Nord",
  "Diedro Giallo",
  "Fessura",
  "Placca Rossa",
  "Tetto",
  "Strapiombo",
];
const GRADES = FRENCH_GRADES.slice(
  FRENCH_GRADES.indexOf("5c"),
  FRENCH_GRADES.indexOf("7a") + 1,
);

const pick = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

export function createMockClimbs(): ClimbInput[] {
  const climbs: ClimbInput[] = [];

  for (let month = 0; month < 6; month++) {
    for (let j = 0; j < 4; j++) {
      const day = subMonths(new Date(), month);
      day.setDate(Math.floor(Math.random() * 28) + 1);

      const style = Math.random() > 0.2 ? "lead" : "follow";
      const mode = pick(MODES_BY_STYLE[style]);

      climbs.push({
        date: toISODate(day),
        crag: pick(CRAGS),
        route: pick(ROUTES),
        grade: pick(GRADES),
        style,
        mode,
        attempts: isFirstTryMode(mode) ? 1 : Math.floor(Math.random() * 4) + 1,
        difficulty: Math.floor(Math.random() * 5) + 1,
        notes: "",
      });
    }
  }

  return climbs;
}
