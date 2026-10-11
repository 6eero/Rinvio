import { Climb } from "@/domain/climb";
import {
  getSessionSummary,
  getYearActivity,
  groupByMonth,
  groupBySession,
} from "@/domain/stats";

let nextId = 1;
const climb = (patch: Partial<Climb>): Climb => ({
  id: nextId++,
  date: "2026-10-12",
  crag: "Arco",
  route: "Via",
  grade: "6a",
  style: "lead",
  mode: "lead_redpoint",
  attempts: 1,
  difficulty: 3,
  notes: "",
  ...patch,
});

describe("getYearActivity", () => {
  it("counts each climb on its own day", () => {
    const activity = getYearActivity(
      [climb({ date: "2026-10-12" }), climb({ date: "2026-10-12" })],
      new Date(2026, 9, 13),
    );
    const byDate = Object.fromEntries(activity.map((d) => [d.date, d.count]));

    expect(activity[0].date).toBe("2026-01-01");
    expect(activity.at(-1)?.date).toBe("2026-10-13");
    expect(byDate["2026-10-11"]).toBe(0);
    expect(byDate["2026-10-12"]).toBe(2);
    expect(byDate["2026-10-13"]).toBe(0);
  });
});

describe("groupBySession", () => {
  it("groups by day and crag, keeping order", () => {
    const a = climb({ date: "2026-10-12", crag: "Arco" });
    const b = climb({ date: "2026-10-12", crag: "Finale" });
    const c = climb({ date: "2026-10-12", crag: "Arco" });
    const d = climb({ date: "2026-10-11", crag: "Arco" });
    expect(groupBySession([a, b, c, d])).toEqual([[a, c], [b], [d]]);
  });
});

describe("getSessionSummary", () => {
  it("counts closed climbs and the hardest clean grade", () => {
    expect(
      getSessionSummary([
        climb({ grade: "6a", mode: "lead_onsight" }),
        climb({ grade: "6b", mode: "follow_success", style: "follow" }),
        climb({ grade: "7a", mode: "lead_hangdog" }),
        climb({ grade: "7b", mode: "lead_failure" }),
      ]),
    ).toEqual({ total: 4, closed: 3, maxGrade: "6b" });
  });

  it("has no max grade without clean ascents", () => {
    expect(getSessionSummary([climb({ mode: "lead_hangdog" })])).toEqual({
      total: 1,
      closed: 1,
      maxGrade: null,
    });
  });
});

describe("groupByMonth", () => {
  it("groups sessions by month, keeping order", () => {
    const a = [climb({ date: "2026-10-12" })];
    const b = [climb({ date: "2026-10-01" })];
    const c = [climb({ date: "2026-09-30" })];
    expect(groupByMonth([a, b, c])).toEqual([
      { month: "2026-10", sessions: [a, b] },
      { month: "2026-09", sessions: [c] },
    ]);
  });
});
