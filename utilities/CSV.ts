import {
  CLIMB_COLUMNS,
  ClimbInput,
  ClimbMode,
  ClimbStyle,
  normalizeClimbInput,
  validateClimb,
} from "@/domain/climb";

const BOM = "﻿";

/** Import failure; `key` and `params` are an i18n message for the user. */
export class CSVImportError extends Error {
  constructor(
    public readonly key: string,
    public readonly params: Record<string, unknown> = {},
  ) {
    super(key);
    this.name = "CSVImportError";
  }
}

// Spreadsheets run a cell starting with one of these as a formula
// (CSV injection): such text is exported with a leading apostrophe.
const FORMULA_TRIGGER = /^[=+\-@\t\r]/;
const DEFUSED_FORMULA = /^'[=+\-@\t\r]/;

/**
 * Escapes a value for CSV (RFC 4180): wraps it in double quotes when it
 * contains commas, newlines or quotes, and doubles the inner quotes.
 * Text that a spreadsheet would read as a formula is prefixed with `'`.
 */
export function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return "";
  let str = String(value);
  if (typeof value === "string" && FORMULA_TRIGGER.test(str)) str = `'${str}`;
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
}

/** Reverts the formula prefix added by escapeCSV. */
const unescapeFormula = (value: string): string =>
  DEFUSED_FORMULA.test(value) ? value.slice(1) : value;

/**
 * Serializes climbs to CSV with a header row. The UTF-8 BOM lets
 * Google Sheets / Excel detect the encoding and show accents correctly.
 */
export function climbsToCSV(climbs: ClimbInput[]): string {
  const header = CLIMB_COLUMNS.join(",");
  const lines = climbs.map((climb) =>
    CLIMB_COLUMNS.map((col) => escapeCSV(climb[col])).join(","),
  );
  return BOM + [header, ...lines].join("\n");
}

/**
 * Splits CSV text into records (RFC 4180). Works on the whole text, not line
 * by line, so quoted fields may contain commas, quotes and newlines.
 */
export function parseCSVRecords(text: string): string[][] {
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      record.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      record.push(field);
      records.push(record);
      record = [];
      field = "";
    } else {
      field += ch;
    }
  }

  record.push(field);
  records.push(record);

  // Drop blank lines (e.g. a trailing newline)
  return records.filter((r) => r.some((f) => f.trim() !== ""));
}

/**
 * Parses and validates a CSV exported by the app.
 * Throws a CSVImportError describing the first problem found.
 */
export function parseClimbsCSV(text: string): ClimbInput[] {
  const clean = text.startsWith(BOM) ? text.slice(1) : text;
  const [headerRow, ...rows] = parseCSVRecords(clean);

  if (!headerRow || rows.length === 0) {
    throw new CSVImportError("csv.errorEmpty");
  }

  const headers = headerRow.map((h) => h.trim());
  const missing = CLIMB_COLUMNS.filter((col) => !headers.includes(col));
  if (missing.length > 0) {
    throw new CSVImportError("csv.errorMissingColumns", {
      columns: missing.join(", "),
    });
  }

  return rows.map((values, idx) => {
    const line = idx + 2; // 1-based, after the header
    const raw: Record<string, string> = {};
    headers.forEach((header, col) => {
      raw[header] = unescapeFormula(values[col]?.trim() ?? "");
    });

    const climb = normalizeClimbInput({
      date: raw.date,
      crag: raw.crag,
      route: raw.route,
      grade: raw.grade,
      style: raw.style as ClimbStyle,
      mode: raw.mode as ClimbMode,
      attempts: parseInteger(raw.attempts),
      difficulty: parseInteger(raw.difficulty),
      notes: raw.notes,
    });

    const error = validateClimb(climb);
    if (error) {
      throw new CSVImportError("csv.errorRow", { line, errorKey: error });
    }
    return climb;
  });
}

const parseInteger = (value: string): number =>
  /^-?\d+$/.test(value) ? Number(value) : NaN;
