import { toISODate } from "@/utilities/date";
import { eachDayOfInterval, startOfYear } from "date-fns";
import {
  Climb,
  ascentOutcome,
  gradeIndex,
  isFailure,
} from "./climb";

/** Highest grade among `climbs`, or null when there are none. */
function hardestGrade(climbs: Climb[]): string | null {
  return climbs.reduce<string | null>(
    (max, c) =>
      max === null || gradeIndex(c.grade) > gradeIndex(max) ? c.grade : max,
    null,
  );
}

/** One entry per day from January 1st of `today`'s year up to `today`. */
export function getYearActivity(
  climbs: Climb[],
  today: Date = new Date(),
): { date: string; count: number }[] {
  const countByDate = climbs.reduce<Record<string, number>>((acc, climb) => {
    acc[climb.date] = (acc[climb.date] ?? 0) + 1;
    return acc;
  }, {});

  return eachDayOfInterval({ start: startOfYear(today), end: today }).map(
    (day) => {
      const date = toISODate(day);
      return { date, count: countByDate[date] ?? 0 };
    },
  );
}

/** Identifies the session (same day and crag) a climb belongs to. */
export const sessionKey = (climb: Climb): string =>
  `${climb.date}|${climb.crag}`;

/** Groups climbs by session (same day and crag), keeping the input order. */
export function groupBySession(climbs: Climb[]): Climb[][] {
  const groups = new Map<string, Climb[]>();
  for (const climb of climbs) {
    const key = sessionKey(climb);
    const group = groups.get(key);
    if (group) group.push(climb);
    else groups.set(key, [climb]);
  }
  return [...groups.values()];
}

export interface SessionSummary {
  total: number;
  closed: number;
  maxGrade: string | null;
}

/** Climbs, closed climbs and hardest clean grade of a session. */
export function getSessionSummary(climbs: Climb[]): SessionSummary {
  return {
    total: climbs.length,
    closed: climbs.filter((c) => !isFailure(c.mode)).length,
    maxGrade: hardestGrade(
      climbs.filter((c) => ascentOutcome(c.mode) === "clean"),
    ),
  };
}

/** Groups sessions by month ("yyyy-MM"), keeping the input order. */
export function groupByMonth(
  sessions: Climb[][],
): { month: string; sessions: Climb[][] }[] {
  const groups = new Map<string, Climb[][]>();
  for (const session of sessions) {
    const month = session[0].date.slice(0, 7);
    const group = groups.get(month);
    if (group) group.push(session);
    else groups.set(month, [session]);
  }
  return [...groups].map(([month, sessions]) => ({ month, sessions }));
}
