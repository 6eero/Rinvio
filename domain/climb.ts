import { isISODate, todayISO } from "@/utilities/date";

// Single source of truth for climb styles, modes and their rules.
// Everything else (types, form, validation, stats, UI) derives from here.

export const CLIMB_STYLES = ["lead", "follow"] as const;
export type ClimbStyle = (typeof CLIMB_STYLES)[number];

export const MODES_BY_STYLE = {
  lead: [
    "lead_onsight",
    "lead_flash",
    "lead_redpoint",
    "lead_hangdog",
    "lead_failure",
  ],
  follow: ["follow_success", "follow_failure"],
} as const satisfies Record<ClimbStyle, readonly string[]>;

export type ClimbMode = (typeof MODES_BY_STYLE)[ClimbStyle][number];

export const CLIMB_MODES: readonly ClimbMode[] = CLIMB_STYLES.flatMap(
  (style) => MODES_BY_STYLE[style],
);

/** Mode selected when the user switches to a style. */
export const DEFAULT_MODE_BY_STYLE: Record<ClimbStyle, ClimbMode> = {
  lead: "lead_onsight",
  follow: "follow_success",
};

export const FRENCH_GRADES = [
  "4a", "4b", "4c",
  "5a", "5b", "5c",
  "6a", "6a+", "6b", "6b+", "6c", "6c+",
  "7a", "7a+", "7b", "7b+", "7c", "7c+",
  "8a", "8a+", "8b", "8b+", "8c", "8c+",
  "9a", "9a+", "9b", "9b+", "9c",
] as const;

export const DIFFICULTY_MIN = 1;
export const DIFFICULTY_MAX = 5;

export interface Climb {
  id: number;
  date: string; // yyyy-MM-dd, local calendar day
  crag: string;
  route: string;
  grade: string;
  style: ClimbStyle;
  mode: ClimbMode;
  attempts: number;
  difficulty: number;
  notes: string;
}

export type ClimbInput = Omit<Climb, "id">;

/** Persisted / exported columns, in order. */
export const CLIMB_COLUMNS = [
  "date",
  "crag",
  "route",
  "grade",
  "style",
  "mode",
  "attempts",
  "difficulty",
  "notes",
] as const satisfies readonly (keyof ClimbInput)[];

// ─── Mode rules ───────────────────────────────────────────────────────────────

export const isClimbStyle = (value: string): value is ClimbStyle =>
  (CLIMB_STYLES as readonly string[]).includes(value);

export const isModeOfStyle = (mode: string, style: ClimbStyle): boolean =>
  (MODES_BY_STYLE[style] as readonly string[]).includes(mode);

/** Onsight and flash can only happen on the first attempt. */
export const isFirstTryMode = (mode: ClimbMode): boolean =>
  mode === "lead_onsight" || mode === "lead_flash";

/** Route topped without hanging on the rope. */
export const isCleanAscent = (mode: ClimbMode): boolean =>
  isFirstTryMode(mode) || mode === "lead_redpoint";

/** Route not topped. Everything else counts as closed, hangdog included. */
export const isFailure = (mode: ClimbMode): boolean =>
  mode === "lead_failure" || mode === "follow_failure";

export type AscentOutcome = "clean" | "hangdog" | "failure";

/** How the route went, whatever the style: topped clean, topped hanging on the rope, or not topped. */
export const ascentOutcome = (mode: ClimbMode): AscentOutcome =>
  isFailure(mode) ? "failure" : mode === "lead_hangdog" ? "hangdog" : "clean";

export const gradeIndex = (grade: string): number =>
  (FRENCH_GRADES as readonly string[]).indexOf(grade);

/** Case-insensitive match of `query` against crag, route and grade. */
export function matchesQuery(climb: Climb, query: string): boolean {
  const q = query.trim().toLowerCase();
  return (
    !q ||
    [climb.crag, climb.route, climb.grade].some((field) =>
      field.toLowerCase().includes(q),
    )
  );
}

// ─── Input helpers ────────────────────────────────────────────────────────────

/** A fresh input for the add form; computed on each call so the date is always today. */
export function createClimbInput(): ClimbInput {
  return {
    date: todayISO(),
    crag: "",
    route: "",
    grade: "5a",
    style: "lead",
    mode: "lead_redpoint",
    attempts: 1,
    difficulty: 3,
    notes: "",
  };
}

export function normalizeClimbInput(input: ClimbInput): ClimbInput {
  return {
    ...input,
    crag: input.crag.trim(),
    route: input.route.trim(),
    notes: input.notes?.trim() ?? "",
  };
}

/**
 * Validates a climb and returns the i18n key of the first error, or null.
 * Used both by the form and by the CSV import.
 */
export function validateClimb(input: ClimbInput): string | null {
  if (!isISODate(input.date)) return "form.errorInvalidDate";
  if (!input.crag.trim()) return "form.errorCrag";
  if (!input.route.trim()) return "form.errorRoute";
  if (gradeIndex(input.grade) === -1) return "form.errorGrade";
  if (!isClimbStyle(input.style)) return "form.errorStyle";

  if (!isModeOfStyle(input.mode, input.style)) {
    return input.style === "lead"
      ? "form.errorInvalidLeadMode"
      : "form.errorInvalidFollowMode";
  }

  if (!Number.isInteger(input.attempts) || input.attempts < 1) {
    return "form.errorAttempts";
  }
  if (isFirstTryMode(input.mode) && input.attempts !== 1) {
    return "form.errorPerfectAscentAttempts";
  }

  if (
    !Number.isInteger(input.difficulty) ||
    input.difficulty < DIFFICULTY_MIN ||
    input.difficulty > DIFFICULTY_MAX
  ) {
    return "form.errorDifficulty";
  }

  return null;
}
