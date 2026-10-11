import { fromISODate, toISODate } from "@/utilities/date";
import {
  eachMonthOfInterval,
  format,
  max as maxDate,
  startOfYear,
  subDays,
  subMonths,
} from "date-fns";
import {
  Climb,
  ClimbMode,
  FRENCH_GRADES,
  gradeIndex,
  isCleanAscent,
  isFailure,
  isFirstTryMode,
} from "./climb";

// Statistics for the analytics screen. They follow the sport climbing ethic:
// - only a lead ascent without weighting the rope (onsight, flash, redpoint)
//   is a real send and counts for the climber's grade
// - a hangdog tops the route but is not a send
// - following (top rope) tops the route but says nothing about the lead grade
// - an abandoned route is a failure, whatever the style

// ─── Outcome categories ───────────────────────────────────────────────────────

/** From the best to the worst way a route can go. */
export const OUTCOME_CATEGORIES = [
  "firstTry",
  "redpoint",
  "hangdog",
  "follow",
  "failure",
] as const;
export type OutcomeCategory = (typeof OUTCOME_CATEGORIES)[number];
export type CategoryCounts = Record<OutcomeCategory, number>;

export function outcomeCategory(mode: ClimbMode): OutcomeCategory {
  if (isFailure(mode)) return "failure";
  if (isFirstTryMode(mode)) return "firstTry";
  if (mode === "lead_redpoint") return "redpoint";
  if (mode === "lead_hangdog") return "hangdog";
  return "follow";
}

export function countByCategory(climbs: Climb[]): CategoryCounts {
  const counts: CategoryCounts = {
    firstTry: 0,
    redpoint: 0,
    hangdog: 0,
    follow: 0,
    failure: 0,
  };
  for (const climb of climbs) counts[outcomeCategory(climb.mode)]++;
  return counts;
}

const isLead = (c: Climb) => c.style === "lead";
const isFollow = (c: Climb) => c.style === "follow";
/** A real send: lead, without weighting the rope. */
const isSend = (c: Climb) => isLead(c) && isCleanAscent(c.mode);

/** `part / total` as a rounded percentage, 0 when there is nothing to divide. */
export const percent = (part: number, total: number): number =>
  total > 0 ? Math.round((part / total) * 100) : 0;

// ─── Time range ───────────────────────────────────────────────────────────────

export const TIME_RANGES = ["3m", "12m", "ytd", "all"] as const;
export type TimeRange = (typeof TIME_RANGES)[number];

/** First day ("yyyy-MM-dd") included in `range`, or null for all time. */
export function rangeStart(
  range: TimeRange,
  today: Date = new Date(),
): string | null {
  switch (range) {
    case "3m":
      return toISODate(subMonths(today, 3));
    case "12m":
      return toISODate(subMonths(today, 12));
    case "ytd":
      return toISODate(startOfYear(today));
    case "all":
      return null;
  }
}

export function filterByRange(
  climbs: Climb[],
  range: TimeRange,
  today: Date = new Date(),
): Climb[] {
  const start = rangeStart(range, today);
  return start === null ? climbs : climbs.filter((c) => c.date >= start);
}

// ─── Grades ───────────────────────────────────────────────────────────────────

/**
 * Hardest climb by grade; on a tie the first one in time, since that is when
 * the grade was reached.
 */
export function hardestClimb(climbs: Climb[]): Climb | null {
  let best: Climb | null = null;
  for (const climb of climbs) {
    const diff = best ? gradeIndex(climb.grade) - gradeIndex(best.grade) : 1;
    if (diff > 0 || (diff === 0 && best && climb.date < best.date)) {
      best = climb;
    }
  }
  return best;
}

/** Normalised identity of a route, to recognise it across sessions. */
const routeKey = (c: Climb) =>
  `${c.crag.trim().toLowerCase()}|${c.route.trim().toLowerCase()}`;

export interface TopAverage {
  grade: string;
  /** How many routes the average is made of (at most `size`). */
  count: number;
}

/**
 * Average grade of the `size` hardest routes sent (each route counted once),
 * the usual way to measure a climber's level beyond a single lucky send.
 */
export function topSendsAverage(
  climbs: Climb[],
  size = 10,
): TopAverage | null {
  const bestByRoute = new Map<string, number>();
  for (const climb of climbs.filter(isSend)) {
    const key = routeKey(climb);
    bestByRoute.set(
      key,
      Math.max(bestByRoute.get(key) ?? -1, gradeIndex(climb.grade)),
    );
  }

  const top = [...bestByRoute.values()].sort((a, b) => b - a).slice(0, size);
  if (!top.length) return null;

  const average = top.reduce((sum, i) => sum + i, 0) / top.length;
  return { grade: FRENCH_GRADES[Math.round(average)], count: top.length };
}

export interface Records {
  /** Hardest send: onsight, flash or redpoint. */
  send: Climb | null;
  onsight: Climb | null;
  flash: Climb | null;
  /** Hardest route topped on lead hanging on the rope. */
  hangdog: Climb | null;
  /** Hardest route topped as second. */
  follow: Climb | null;
}

export function getRecords(climbs: Climb[]): Records {
  const ofMode = (mode: ClimbMode) =>
    hardestClimb(climbs.filter((c) => c.mode === mode));
  return {
    send: hardestClimb(climbs.filter(isSend)),
    onsight: ofMode("lead_onsight"),
    flash: ofMode("lead_flash"),
    hangdog: ofMode("lead_hangdog"),
    follow: ofMode("follow_success"),
  };
}

// ─── Overview ─────────────────────────────────────────────────────────────────

export interface Overview {
  total: number;
  lead: number;
  follow: number;
  /** Distinct (day, crag) pairs. */
  sessions: number;
  /** Distinct days out climbing. */
  days: number;
  crags: number;
  counts: CategoryCounts;
}

export function getOverview(climbs: Climb[]): Overview {
  return {
    total: climbs.length,
    lead: climbs.filter(isLead).length,
    follow: climbs.filter(isFollow).length,
    sessions: new Set(climbs.map((c) => `${c.date}|${c.crag}`)).size,
    days: new Set(climbs.map((c) => c.date)).size,
    crags: new Set(climbs.map((c) => c.crag.trim().toLowerCase())).size,
    counts: countByCategory(climbs),
  };
}

// ─── Lead and follow ──────────────────────────────────────────────────────────

export interface LeadSummary {
  total: number;
  onsight: number;
  flash: number;
  redpoint: number;
  hangdog: number;
  failure: number;
  /** Sends over lead attempts. */
  sendRate: number;
  /** Topped routes (sends and hangdogs) over lead attempts. */
  toppedRate: number;
  failureRate: number;
  /** Onsight and flash over sends. */
  firstTryRate: number;
  /** Average attempts a redpoint took, null without redpoints. */
  avgRedpointAttempts: number | null;
}

export function getLeadSummary(climbs: Climb[]): LeadSummary | null {
  const lead = climbs.filter(isLead);
  if (!lead.length) return null;

  const count = (mode: ClimbMode) => lead.filter((c) => c.mode === mode).length;
  const onsight = count("lead_onsight");
  const flash = count("lead_flash");
  const redpoint = count("lead_redpoint");
  const hangdog = count("lead_hangdog");
  const failure = count("lead_failure");
  const sends = onsight + flash + redpoint;

  const redpoints = lead.filter((c) => c.mode === "lead_redpoint");
  const avgRedpointAttempts = redpoints.length
    ? Math.round(
        (redpoints.reduce((sum, c) => sum + c.attempts, 0) / redpoints.length) *
          10,
      ) / 10
    : null;

  return {
    total: lead.length,
    onsight,
    flash,
    redpoint,
    hangdog,
    failure,
    sendRate: percent(sends, lead.length),
    toppedRate: percent(sends + hangdog, lead.length),
    failureRate: percent(failure, lead.length),
    firstTryRate: percent(onsight + flash, sends),
    avgRedpointAttempts,
  };
}

export interface FollowSummary {
  total: number;
  topped: number;
  failure: number;
  toppedRate: number;
  maxGrade: string | null;
}

export function getFollowSummary(climbs: Climb[]): FollowSummary | null {
  const follow = climbs.filter(isFollow);
  if (!follow.length) return null;

  const topped = follow.filter((c) => !isFailure(c.mode));
  return {
    total: follow.length,
    topped: topped.length,
    failure: follow.length - topped.length,
    toppedRate: percent(topped.length, follow.length),
    maxGrade: hardestClimb(topped)?.grade ?? null,
  };
}

// ─── By grade ─────────────────────────────────────────────────────────────────

export interface GradeRow {
  grade: string;
  total: number;
  counts: CategoryCounts;
  /** Average perceived difficulty (1–5), rounded to one decimal. */
  avgDifficulty: number;
}

/**
 * One row per grade from the easiest to the hardest climbed, empty grades in
 * between included so the scale reads evenly.
 */
export function getGradeRows(climbs: Climb[]): GradeRow[] {
  const indexes = climbs.map((c) => gradeIndex(c.grade));
  if (!indexes.length) return [];

  return FRENCH_GRADES.slice(
    Math.min(...indexes),
    Math.max(...indexes) + 1,
  ).map((grade) => {
    const ofGrade = climbs.filter((c) => c.grade === grade);
    const difficulty = ofGrade.reduce((sum, c) => sum + c.difficulty, 0);
    return {
      grade,
      total: ofGrade.length,
      counts: countByCategory(ofGrade),
      avgDifficulty: ofGrade.length
        ? Math.round((difficulty / ofGrade.length) * 10) / 10
        : 0,
    };
  });
}

/** Lead attempts per grade, only for grades tried on lead. */
export const getLeadGradeRows = (climbs: Climb[]): GradeRow[] =>
  getGradeRows(climbs.filter(isLead)).filter((row) => row.total > 0);

/** Sends over lead attempts of a lead grade row. */
export const sendRateOf = (row: GradeRow): number =>
  percent(row.counts.firstTry + row.counts.redpoint, row.total);

// ─── Over time ────────────────────────────────────────────────────────────────

export interface MonthStat {
  month: string; // yyyy-MM
  total: number;
  counts: CategoryCounts;
  /** Hardest send of the month. */
  maxSend: string | null;
  /** Hardest onsight or flash of the month. */
  maxFirstTry: string | null;
}

/**
 * One entry per month, empty months included, from the start of `range` (or
 * the first climb) to the month of `today`.
 */
export function getMonthlyStats(
  climbs: Climb[],
  range: TimeRange,
  today: Date = new Date(),
): MonthStat[] {
  if (!climbs.length) return [];

  const dates = climbs.map((c) => c.date).sort();
  const months = eachMonthOfInterval({
    start: fromISODate(rangeStart(range, today) ?? dates[0]),
    end: maxDate([today, fromISODate(dates[dates.length - 1])]),
  }).map((d) => format(d, "yyyy-MM"));

  return months.map((month) => {
    const ofMonth = climbs.filter((c) => c.date.startsWith(month));
    const firstTry = ofMonth.filter((c) => isLead(c) && isFirstTryMode(c.mode));
    return {
      month,
      total: ofMonth.length,
      counts: countByCategory(ofMonth),
      maxSend: hardestClimb(ofMonth.filter(isSend))?.grade ?? null,
      maxFirstTry: hardestClimb(firstTry)?.grade ?? null,
    };
  });
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface Project {
  /** Latest entry of the route, to open it. */
  last: Climb;
  /** Entries logged on lead for the route. */
  sessions: number;
  /** Lead attempts across all entries. */
  attempts: number;
}

export interface ProjectsSummary {
  /** Routes tried on lead and never sent, hardest first. */
  open: Project[];
  /** Routes that took more than one go and were eventually sent. */
  sent: number;
}

/**
 * A route is a project once it takes more than one go on lead: a hangdog,
 * an abandoned attempt or a redpoint after several tries. It stays open until
 * it is sent on lead; topping it as second doesn't count.
 */
export function getProjects(climbs: Climb[]): ProjectsSummary {
  const byRoute = new Map<string, Climb[]>();
  for (const climb of climbs.filter(isLead)) {
    const key = routeKey(climb);
    const entries = byRoute.get(key);
    if (entries) entries.push(climb);
    else byRoute.set(key, [climb]);
  }

  const open: Project[] = [];
  let sent = 0;
  for (const entries of byRoute.values()) {
    const attempts = entries.reduce((sum, c) => sum + c.attempts, 0);
    const isProject = entries.length > 1 || attempts > 1 || !isSend(entries[0]);
    if (!isProject) continue;

    if (entries.some(isSend)) {
      sent++;
      continue;
    }
    const last = entries.reduce((a, b) => (b.date > a.date ? b : a));
    open.push({ last, sessions: entries.length, attempts });
  }

  open.sort(
    (a, b) =>
      gradeIndex(b.last.grade) - gradeIndex(a.last.grade) ||
      b.last.date.localeCompare(a.last.date),
  );
  return { open, sent };
}

// ─── Crags ────────────────────────────────────────────────────────────────────

export interface CragStat {
  crag: string;
  total: number;
  days: number;
  sends: number;
  maxSend: string | null;
  lastDate: string;
}

/** Crags by number of routes climbed there. */
export function getCragStats(climbs: Climb[]): CragStat[] {
  const byCrag = new Map<string, Climb[]>();
  for (const climb of climbs) {
    const key = climb.crag.trim().toLowerCase();
    const entries = byCrag.get(key);
    if (entries) entries.push(climb);
    else byCrag.set(key, [climb]);
  }

  return [...byCrag.values()]
    .map((entries) => {
      const sends = entries.filter(isSend);
      return {
        crag: entries[0].crag,
        total: entries.length,
        days: new Set(entries.map((c) => c.date)).size,
        sends: sends.length,
        maxSend: hardestClimb(sends)?.grade ?? null,
        lastDate: entries.reduce((d, c) => (c.date > d ? c.date : d), ""),
      };
    })
    .sort((a, b) => b.total - a.total || b.lastDate.localeCompare(a.lastDate));
}

// ─── Insights ─────────────────────────────────────────────────────────────────

export type InsightTone = "positive" | "neutral" | "warning";

export interface Insight {
  /** i18n key under analytics.insights */
  key: string;
  params: Record<string, string | number>;
  tone: InsightTone;
}

/** Days compared by the trend insight: this period against the one before. */
const TREND_DAYS = 90;

/**
 * Short readings of the data, in the order they are worth reading.
 * `climbs` is the selected range; `allClimbs` feeds the time trend, which
 * always looks at the last months.
 */
export function getInsights(
  climbs: Climb[],
  allClimbs: Climb[],
  today: Date = new Date(),
): Insight[] {
  const insights: Insight[] = [];
  const records = getRecords(climbs);
  const lead = getLeadSummary(climbs);

  // Trend: hardest send of the last months against the months before
  const recentStart = toISODate(subDays(today, TREND_DAYS));
  const previousStart = toISODate(subDays(today, TREND_DAYS * 2));
  const recent = hardestClimb(
    allClimbs.filter((c) => isSend(c) && c.date >= recentStart),
  );
  const previous = hardestClimb(
    allClimbs.filter(
      (c) => isSend(c) && c.date >= previousStart && c.date < recentStart,
    ),
  );
  if (recent && previous) {
    const diff = gradeIndex(recent.grade) - gradeIndex(previous.grade);
    insights.push({
      key: diff > 0 ? "trendUp" : diff < 0 ? "trendDown" : "trendSteady",
      params: { recent: recent.grade, previous: previous.grade },
      tone: diff > 0 ? "positive" : diff < 0 ? "warning" : "neutral",
    });
  }

  // Gap between first-try level and worked level: a classic training marker
  if (records.send) {
    const firstTry = hardestClimb(
      [records.onsight, records.flash].filter((c): c is Climb => c !== null),
    );
    if (firstTry) {
      const gap = gradeIndex(records.send.grade) - gradeIndex(firstTry.grade);
      insights.push({
        key: gap === 0 ? "firstTryAtMax" : "firstTryGap",
        params: {
          firstTry: firstTry.grade,
          send: records.send.grade,
          count: gap,
        },
        tone: gap === 0 ? "positive" : "neutral",
      });
    }
  }

  // Comfort zone and wall, from lead attempts per grade
  const leadRows = getLeadGradeRows(climbs);
  const comfort = leadRows.findLast(
    (row) => row.total >= 3 && sendRateOf(row) >= 80,
  );
  if (comfort) {
    insights.push({
      key: "comfortZone",
      params: { grade: comfort.grade, rate: sendRateOf(comfort) },
      tone: "positive",
    });
  }
  const wall = leadRows.find(
    (row) =>
      row.total >= 2 &&
      sendRateOf(row) < 50 &&
      (!comfort || gradeIndex(row.grade) > gradeIndex(comfort.grade)),
  );
  if (wall) {
    insights.push({
      key: "wallGrade",
      params: { grade: wall.grade, rate: sendRateOf(wall) },
      tone: "warning",
    });
  }

  // Failures on lead: too many burn sessions, none means not pushing
  if (lead && lead.total >= 5) {
    if (lead.failureRate >= 30) {
      insights.push({
        key: "highFailure",
        params: { rate: lead.failureRate },
        tone: "warning",
      });
    } else if (lead.total >= 10 && lead.failure === 0 && lead.hangdog === 0) {
      insights.push({ key: "noFailure", params: {}, tone: "neutral" });
    }
  }

  // Routes topped as second don't make the lead grade
  const topped = climbs.filter((c) => !isFailure(c.mode));
  const followTopped = topped.filter(isFollow).length;
  const followShare = percent(followTopped, topped.length);
  if (topped.length >= 5 && followShare >= 30) {
    insights.push({
      key: "followShare",
      params: { rate: followShare },
      tone: "neutral",
    });
  }

  return insights;
}
