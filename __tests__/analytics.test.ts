import {
  countByCategory,
  filterByRange,
  getCragStats,
  getFollowSummary,
  getGradeRows,
  getInsights,
  getLeadGradeRows,
  getLeadSummary,
  getMonthlyStats,
  getOverview,
  getProjects,
  getRecords,
  outcomeCategory,
  sendRateOf,
  topSendsAverage,
} from "@/domain/analytics";
import { Climb } from "@/domain/climb";

let nextId = 1;
const climb = (patch: Partial<Climb>): Climb => ({
  id: nextId++,
  date: "2026-10-12",
  crag: "Arco",
  route: `Via ${nextId}`,
  grade: "6a",
  style: "lead",
  mode: "lead_redpoint",
  attempts: 1,
  difficulty: 3,
  notes: "",
  ...patch,
});
const follow = (patch: Partial<Climb>) =>
  climb({ style: "follow", mode: "follow_success", ...patch });

const TODAY = new Date(2026, 9, 12);

describe("outcomeCategory", () => {
  it("ranks each mode by the sport climbing ethic", () => {
    expect(outcomeCategory("lead_onsight")).toBe("firstTry");
    expect(outcomeCategory("lead_flash")).toBe("firstTry");
    expect(outcomeCategory("lead_redpoint")).toBe("redpoint");
    expect(outcomeCategory("lead_hangdog")).toBe("hangdog");
    expect(outcomeCategory("follow_success")).toBe("follow");
    expect(outcomeCategory("lead_failure")).toBe("failure");
    expect(outcomeCategory("follow_failure")).toBe("failure");
  });
});

describe("filterByRange", () => {
  const old = climb({ date: "2025-06-01" });
  const lastYear = climb({ date: "2025-12-01" });
  const recent = climb({ date: "2026-09-01" });
  const all = [recent, lastYear, old];

  it("keeps the climbs inside the period", () => {
    expect(filterByRange(all, "3m", TODAY)).toEqual([recent]);
    expect(filterByRange(all, "ytd", TODAY)).toEqual([recent]);
    expect(filterByRange(all, "12m", TODAY)).toEqual([recent, lastYear]);
    expect(filterByRange(all, "all", TODAY)).toEqual(all);
  });
});

describe("getRecords", () => {
  it("only counts clean lead ascents for the max grade", () => {
    const records = getRecords([
      climb({ grade: "7b", mode: "lead_hangdog" }),
      climb({ grade: "7c", mode: "lead_failure" }),
      follow({ grade: "7a" }),
      climb({ grade: "6c", mode: "lead_redpoint", attempts: 4 }),
      climb({ grade: "6b", mode: "lead_onsight" }),
      climb({ grade: "6b+", mode: "lead_flash" }),
    ]);
    expect(records.send?.grade).toBe("6c");
    expect(records.onsight?.grade).toBe("6b");
    expect(records.flash?.grade).toBe("6b+");
    expect(records.hangdog?.grade).toBe("7b");
    expect(records.follow?.grade).toBe("7a");
  });

  it("keeps the first time a grade was reached", () => {
    const first = climb({ grade: "7a", date: "2026-01-01" });
    const second = climb({ grade: "7a", date: "2026-05-01" });
    expect(getRecords([second, first]).send).toBe(first);
  });

  it("has no records without matching climbs", () => {
    expect(getRecords([follow({})]).send).toBeNull();
  });
});

describe("topSendsAverage", () => {
  it("averages the hardest sends, each route once", () => {
    expect(
      topSendsAverage(
        [
          climb({ route: "A", grade: "7a" }),
          climb({ route: "A", grade: "7a" }),
          climb({ route: "B", grade: "6c" }),
          climb({ route: "C", grade: "6a" }),
          climb({ route: "D", grade: "8a", mode: "lead_hangdog" }),
          follow({ route: "E", grade: "8a" }),
        ],
        2,
      ),
    ).toEqual({ grade: "6c+", count: 2 });
  });

  it("returns null without sends", () => {
    expect(topSendsAverage([climb({ mode: "lead_failure" })])).toBeNull();
  });
});

describe("getOverview", () => {
  it("counts routes, days, sessions and crags", () => {
    const overview = getOverview([
      climb({ date: "2026-10-12", crag: "Arco" }),
      climb({ date: "2026-10-12", crag: "Finale" }),
      follow({ date: "2026-10-11", crag: "arco " }),
    ]);
    expect(overview).toMatchObject({
      total: 3,
      lead: 2,
      follow: 1,
      sessions: 3,
      days: 2,
      crags: 2,
    });
  });
});

describe("getLeadSummary", () => {
  it("separates sends, hangdogs and failures", () => {
    expect(
      getLeadSummary([
        climb({ mode: "lead_onsight" }),
        climb({ mode: "lead_redpoint", attempts: 3 }),
        climb({ mode: "lead_redpoint", attempts: 2 }),
        climb({ mode: "lead_hangdog" }),
        climb({ mode: "lead_failure" }),
        follow({}),
      ]),
    ).toEqual({
      total: 5,
      onsight: 1,
      flash: 0,
      redpoint: 2,
      hangdog: 1,
      failure: 1,
      sendRate: 60,
      toppedRate: 80,
      failureRate: 20,
      firstTryRate: 33,
      avgRedpointAttempts: 2.5,
    });
  });

  it("returns null without lead climbs", () => {
    expect(getLeadSummary([follow({})])).toBeNull();
  });
});

describe("getFollowSummary", () => {
  it("counts topped and abandoned routes on follow", () => {
    expect(
      getFollowSummary([
        follow({ grade: "6c" }),
        follow({ grade: "7a", mode: "follow_failure" }),
        climb({ grade: "8a" }),
      ]),
    ).toEqual({
      total: 2,
      topped: 1,
      failure: 1,
      toppedRate: 50,
      maxGrade: "6c",
    });
  });
});

describe("getGradeRows", () => {
  it("covers every grade between the easiest and the hardest", () => {
    const rows = getGradeRows([
      climb({ grade: "6a", difficulty: 2 }),
      climb({ grade: "6a", difficulty: 3, mode: "lead_failure" }),
      follow({ grade: "6b" }),
    ]);
    expect(rows.map((r) => r.grade)).toEqual(["6a", "6a+", "6b"]);
    expect(rows[0]).toEqual({
      grade: "6a",
      total: 2,
      counts: countByCategory([
        climb({ mode: "lead_redpoint" }),
        climb({ mode: "lead_failure" }),
      ]),
      avgDifficulty: 2.5,
    });
    expect(rows[1].total).toBe(0);
  });

  it("keeps only lead grades for the lead table", () => {
    const rows = getLeadGradeRows([
      climb({ grade: "6a" }),
      climb({ grade: "6a", mode: "lead_hangdog" }),
      climb({ grade: "6b", mode: "lead_failure" }),
      follow({ grade: "7a" }),
    ]);
    expect(rows.map((r) => [r.grade, sendRateOf(r)])).toEqual([
      ["6a", 50],
      ["6b", 0],
    ]);
  });
});

describe("getMonthlyStats", () => {
  it("lists every month of the period with its best sends", () => {
    const months = getMonthlyStats(
      [
        climb({ date: "2026-10-01", grade: "7a", mode: "lead_redpoint" }),
        climb({ date: "2026-10-02", grade: "6b", mode: "lead_onsight" }),
        climb({ date: "2026-10-03", grade: "7c", mode: "lead_hangdog" }),
        follow({ date: "2026-08-10", grade: "6c" }),
      ],
      "3m",
      TODAY,
    );
    expect(months.map((m) => m.month)).toEqual([
      "2026-07",
      "2026-08",
      "2026-09",
      "2026-10",
    ]);
    expect(months[1]).toMatchObject({
      total: 1,
      maxSend: null,
      maxFirstTry: null,
    });
    expect(months[3]).toMatchObject({
      total: 3,
      maxSend: "7a",
      maxFirstTry: "6b",
    });
  });

  it("starts from the first climb for all time", () => {
    const months = getMonthlyStats(
      [climb({ date: "2026-09-15" })],
      "all",
      TODAY,
    );
    expect(months.map((m) => m.month)).toEqual(["2026-09", "2026-10"]);
  });
});

describe("getProjects", () => {
  it("keeps routes open until they are sent on lead", () => {
    const { open, sent } = getProjects([
      // sent after a hangdog: closed project
      climb({ route: "Sent", date: "2026-10-10", mode: "lead_redpoint" }),
      climb({ route: "Sent", date: "2026-10-01", mode: "lead_hangdog" }),
      // topped as second only: still open
      follow({ route: "Open", date: "2026-10-11", grade: "7a" }),
      climb({
        route: "Open",
        date: "2026-10-05",
        grade: "7a",
        mode: "lead_failure",
        attempts: 2,
      }),
      climb({
        route: "open ",
        date: "2026-10-08",
        grade: "7a",
        mode: "lead_hangdog",
      }),
      // abandoned once
      climb({ route: "Easy", grade: "6a", mode: "lead_failure" }),
      // onsight: never a project
      climb({ route: "Onsight", mode: "lead_onsight" }),
    ]);

    expect(sent).toBe(1);
    expect(open.map((p) => [p.last.route, p.sessions, p.attempts])).toEqual([
      ["open ", 2, 3],
      ["Easy", 1, 1],
    ]);
  });
});

describe("getCragStats", () => {
  it("sorts crags by routes and finds their hardest send", () => {
    expect(
      getCragStats([
        climb({ crag: "Arco", grade: "7a", date: "2026-10-01" }),
        climb({ crag: "Arco", grade: "8a", mode: "lead_hangdog" }),
        climb({ crag: "Finale", grade: "6a" }),
      ]),
    ).toEqual([
      {
        crag: "Arco",
        total: 2,
        days: 2,
        sends: 1,
        maxSend: "7a",
        lastDate: "2026-10-12",
      },
      {
        crag: "Finale",
        total: 1,
        days: 1,
        sends: 1,
        maxSend: "6a",
        lastDate: "2026-10-12",
      },
    ]);
  });
});

describe("getInsights", () => {
  const keys = (climbs: Climb[]) =>
    getInsights(climbs, climbs, TODAY).map((i) => i.key);

  it("compares the last months with the ones before", () => {
    const climbs = [
      climb({ date: "2026-10-01", grade: "7a" }),
      climb({ date: "2026-06-01", grade: "6c" }),
    ];
    const [trend] = getInsights(climbs, climbs, TODAY);
    expect(trend).toEqual({
      key: "trendUp",
      params: { recent: "7a", previous: "6c" },
      tone: "positive",
    });
  });

  it("measures the gap between first-try and worked grade", () => {
    const insight = getInsights(
      [
        climb({ grade: "7a", mode: "lead_redpoint" }),
        climb({ grade: "6b", mode: "lead_onsight" }),
      ],
      [],
      TODAY,
    ).find((i) => i.key === "firstTryGap");
    expect(insight?.params.count).toBe(4);
  });

  it("finds the comfort zone and the wall above it", () => {
    const climbs = [
      ...Array.from({ length: 3 }, () => climb({ grade: "6a" })),
      climb({ grade: "6b" }),
      climb({ grade: "6b", mode: "lead_failure" }),
      climb({ grade: "6b", mode: "lead_hangdog" }),
    ];
    const insights = getInsights(climbs, [], TODAY);
    expect(insights.find((i) => i.key === "comfortZone")?.params).toEqual({
      grade: "6a",
      rate: 100,
    });
    expect(insights.find((i) => i.key === "wallGrade")?.params).toEqual({
      grade: "6b",
      rate: 33,
    });
  });

  it("flags many abandoned lead routes and many follows", () => {
    expect(
      keys([
        ...Array.from({ length: 3 }, () => climb({ mode: "lead_failure" })),
        ...Array.from({ length: 2 }, () => climb({})),
        ...Array.from({ length: 3 }, () => follow({})),
      ]),
    ).toEqual(expect.arrayContaining(["highFailure", "followShare"]));
  });
});
