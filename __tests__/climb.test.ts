import {
  CLIMB_MODES,
  ClimbInput,
  ascentOutcome,
  createClimbInput,
  isModeOfStyle,
  matchesQuery,
  validateClimb,
} from "@/domain/climb";
import { todayISO } from "@/utilities/date";

const valid: ClimbInput = {
  date: "2026-10-12",
  crag: "Arco",
  route: "Via Normale",
  grade: "6a",
  style: "lead",
  mode: "lead_redpoint",
  attempts: 3,
  difficulty: 3,
  notes: "",
};

describe("validateClimb", () => {
  it("accepts a valid climb", () => {
    expect(validateClimb(valid)).toBeNull();
  });

  it.each<[Partial<ClimbInput>, string]>([
    [{ date: "2026-02-30" }, "form.errorInvalidDate"],
    [{ crag: "  " }, "form.errorCrag"],
    [{ route: "" }, "form.errorRoute"],
    [{ grade: "6z" }, "form.errorGrade"],
    [{ style: "solo" as never }, "form.errorStyle"],
    [{ mode: "follow_success" }, "form.errorInvalidLeadMode"],
    [{ style: "follow", mode: "lead_flash" }, "form.errorInvalidFollowMode"],
    [{ attempts: 0 }, "form.errorAttempts"],
    [{ mode: "lead_onsight", attempts: 2 }, "form.errorPerfectAscentAttempts"],
    [{ difficulty: 6 }, "form.errorDifficulty"],
  ])("rejects %p", (patch, error) => {
    expect(validateClimb({ ...valid, ...patch })).toBe(error);
  });
});

describe("modes", () => {
  it("assigns every mode to exactly one style", () => {
    for (const mode of CLIMB_MODES) {
      const styles = (["lead", "follow"] as const).filter((s) =>
        isModeOfStyle(mode, s),
      );
      expect(styles).toHaveLength(1);
    }
  });

  it("creates a new input dated today", () => {
    expect(createClimbInput().date).toBe(todayISO());
  });
});

describe("ascentOutcome", () => {
  it.each([
    ["lead_onsight", "clean"],
    ["lead_flash", "clean"],
    ["lead_redpoint", "clean"],
    ["lead_hangdog", "hangdog"],
    ["lead_failure", "failure"],
    ["follow_success", "clean"],
    ["follow_failure", "failure"],
  ] as const)("%s is %s", (mode, outcome) => {
    expect(ascentOutcome(mode)).toBe(outcome);
  });
});

describe("matchesQuery", () => {
  const climb = { ...valid, id: 1 };

  it.each(["", "  ", "arco", "NORMALE", "6a"])("matches %p", (query) => {
    expect(matchesQuery(climb, query)).toBe(true);
  });

  it("rejects unrelated text", () => {
    expect(matchesQuery(climb, "finale")).toBe(false);
  });
});
