import {
  daysAgo,
  formatMonth,
  formatShortDate,
  fromISODate,
  isISODate,
  toISODate,
} from "@/utilities/date";

describe("date utilities", () => {
  it("runs in a timezone ahead of UTC", () => {
    expect(new Date(2026, 0, 1).getTimezoneOffset()).toBeLessThan(0);
  });

  it("keeps the local calendar day just after midnight", () => {
    // 00:30 in Italy is still the previous day in UTC
    expect(toISODate(new Date(2026, 9, 12, 0, 30))).toBe("2026-10-12");
  });

  it("round-trips yyyy-MM-dd strings", () => {
    const date = fromISODate("2026-03-29"); // DST change day
    expect(date.getDate()).toBe(29);
    expect(toISODate(date)).toBe("2026-03-29");
  });

  it.each(["2026-10-12", "2024-02-29"])("accepts %s", (value) => {
    expect(isISODate(value)).toBe(true);
  });

  it.each(["", "2026-13-01", "2026-02-30", "12/10/2026", "2026-1-5"])(
    "rejects %p",
    (value) => {
      expect(isISODate(value)).toBe(false);
    },
  );
});

describe("session date labels", () => {
  const today = new Date(2026, 9, 12, 0, 30);

  it("counts calendar days, not 24h periods", () => {
    expect(daysAgo("2026-10-12", today)).toBe(0);
    expect(daysAgo("2026-10-11", today)).toBe(1);
    expect(daysAgo("2026-09-12", today)).toBe(30);
  });

  it("shows the year only for past years", () => {
    expect(formatShortDate("2026-10-10", "en", today)).not.toContain("2026");
    expect(formatShortDate("2025-10-10", "en", today)).toContain("2025");
  });

  it("capitalizes the month heading", () => {
    expect(formatMonth("2026-10", "it")).toBe("Ottobre 2026");
  });
});
