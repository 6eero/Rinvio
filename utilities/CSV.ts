import { CSV_COLUMNS } from "@/constants/constants";
import { ClimbRow } from "@/types/climb";

/**
 * Escapa un valore per il formato CSV (RFC 4180).
 * Racchiude tra virgolette doppie se il valore contiene virgole,
 * newline o virgolette; raddoppia le virgolette interne.
 */
export function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (
    str.includes(",") ||
    str.includes('"') ||
    str.includes("\n") ||
    str.includes("\r")
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converte un array di righe in stringa CSV con intestazione.
 * Aggiunge il BOM UTF-8 così Google Fogli / Excel riconoscono
 * subito la codifica e mostrano correttamente accenti e caratteri speciali.
 */
export function rowsToCSV(rows: ClimbRow[]): string {
  const BOM = "\uFEFF";
  const header = CSV_COLUMNS.join(",");
  const lines = rows.map((row) =>
    CSV_COLUMNS.map((col) => escapeCSV(row[col])).join(","),
  );
  return BOM + [header, ...lines].join("\n");
}

/**
 * Parsa una riga CSV rispettando le virgolette RFC 4180.
 */
export function parseCSVRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Virgoletta raddoppiata → virgoletta letterale
        current += '"';
        i += 2;
      } else {
        inQuotes = !inQuotes;
        i++;
      }
    } else if (ch === "," && !inQuotes) {
      result.push(current);
      current = "";
      i++;
    } else {
      current += ch;
      i++;
    }
  }
  result.push(current);
  return result;
}

/**
 * Parsa l'intero testo CSV.
 * - Rimuove il BOM se presente.
 * - Salta le righe vuote.
 * - Valida che l'intestazione corrisponda alle colonne attese.
 * Lancia un errore descrittivo in caso di problemi.
 */
export function parseCSV(text: string): ClimbRow[] {
  const clean = text.startsWith("\uFEFF") ? text.slice(1) : text;
  const lines = clean.split(/\r?\n/).filter((l) => l.trim() !== "");

  if (lines.length < 2) {
    throw new Error(
      "Il file CSV non contiene dati (almeno una riga dati è richiesta).",
    );
  }

  const headers = parseCSVRow(lines[0]).map((h) => h.trim());

  // Verifica che tutte le colonne attese siano presenti
  const missing = CSV_COLUMNS.filter((col) => !headers.includes(col));
  if (missing.length > 0) {
    throw new Error(
      `Colonne mancanti nel CSV: ${missing.join(", ")}.\n` +
        `Assicurati di esportare il file dall'app e di non eliminare colonne in Google Fogli.`,
    );
  }

  return lines.slice(1).map((line, lineIdx) => {
    const values = parseCSVRow(line);
    const row: Record<string, unknown> = {};

    headers.forEach((header, idx) => {
      row[header] = values[idx]?.trim() ?? "";
    });

    // Casting e normalizzazione dei tipi
    return {
      date: row.date as string,
      crag: row.crag as string,
      route: row.route as string,
      grade: row.grade as string,
      style: row.style as string,
      mode: row.mode as string,
      // attempts: intero, default 1 se mancante o non numerico
      attempts: (() => {
        const n = parseInt(row.attempts as string, 10);
        if (isNaN(n)) {
          throw new Error(
            `Riga ${lineIdx + 2}: "attempts" non è un numero intero valido ("${row.attempts}").`,
          );
        }
        return n;
      })(),
      // difficulty: intero
      difficulty: (() => {
        const n = parseInt(row.difficulty as string, 10);
        if (isNaN(n)) {
          throw new Error(
            `Riga ${lineIdx + 2}: "difficulty" non è un numero intero valido ("${row.difficulty}").`,
          );
        }
        return n;
      })(),
      // notes: stringa vuota → NULL
      notes: (row.notes as string) || null,
    } satisfies ClimbRow;
  });
}
