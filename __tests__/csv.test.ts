import { ClimbInput } from "@/domain/climb";
import {
  CSVImportError,
  climbsToCSV,
  parseCSVRecords,
  parseClimbsCSV,
} from "@/utilities/CSV";

const climb: ClimbInput = {
  date: "2026-10-12",
  crag: "Céüse",
  route: 'Biographie, "la" via',
  grade: "9a+",
  style: "lead",
  mode: "lead_redpoint",
  attempts: 4,
  difficulty: 5,
  notes: "prima riga\nseconda riga\r\nterza, con virgola",
};

describe("CSV", () => {
  it("round-trips climbs, including multi-line notes and quotes", () => {
    const other: ClimbInput = { ...climb, route: "Tetto", notes: "" };
    expect(parseClimbsCSV(climbsToCSV([climb, other]))).toEqual([
      { ...climb, notes: climb.notes.trim() },
      other,
    ]);
  });

  it("handles CRLF line endings and blank lines", () => {
    expect(parseCSVRecords('a,b\r\n\r\n"x\r\ny",2\r\n')).toEqual([
      ["a", "b"],
      ["x\r\ny", "2"],
    ]);
  });

  it("accepts columns in any order", () => {
    const csv =
      "notes,difficulty,attempts,mode,style,grade,route,crag,date\n" +
      ",2,1,follow_success,follow,5c,Fessura,Arco,2026-01-05";
    expect(parseClimbsCSV(csv)[0]).toMatchObject({
      date: "2026-01-05",
      style: "follow",
      attempts: 1,
    });
  });

  const importError = (text: string) => {
    try {
      parseClimbsCSV(text);
    } catch (e) {
      return e as CSVImportError;
    }
    throw new Error("expected an import error");
  };

  it("rejects an empty file", () => {
    expect(importError("date,crag\n").key).toBe("csv.errorEmpty");
  });

  it("reports missing columns", () => {
    const error = importError("date,crag\n2026-01-01,Arco");
    expect(error.key).toBe("csv.errorMissingColumns");
    expect(error.params.columns).toContain("route");
  });

  it("reports the line and the reason of an invalid row", () => {
    const csv = climbsToCSV([climb, { ...climb, attempts: 1.5 }]);
    expect(importError(csv).params).toEqual({
      line: 3,
      errorKey: "form.errorAttempts",
    });
  });
});
