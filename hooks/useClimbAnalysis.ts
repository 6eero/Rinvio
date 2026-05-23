import { FRENCH_GRADES } from "@/constants/constants";
import { GlobalStats, LeadStats } from "@/types/analysis";
import { Climb } from "@/types/climb";

function getGlobalStats(climbs: Climb[]): GlobalStats {
  if (!climbs.length)
    return { total: 0, favoriteCrag: "—", successRate: 0, avgAttempts: 0 };

  const cragCounts: Record<string, number> = {};
  climbs.forEach((c) => {
    if (c.crag) cragCounts[c.crag] = (cragCounts[c.crag] || 0) + 1;
  });
  const favoriteCrag = Object.keys(cragCounts).reduce((a, b) =>
    cragCounts[a] >= cragCounts[b] ? a : b,
  );

  const successful = climbs.filter(
    (c) => c.mode !== "lead_failure" && c.mode !== "follow_failure",
  ).length;

  const avgAttempts =
    Math.round(
      (climbs.reduce((s, c) => s + (c.attempts ?? 1), 0) / climbs.length) * 10,
    ) / 10;

  return {
    total: climbs.length,
    favoriteCrag,
    successRate: Math.round((successful / climbs.length) * 100),
    avgAttempts,
  };
}

function getLeadStats(climbs: Climb[]): LeadStats | null {
  const lead = climbs.filter((c) => c.style === "lead");
  if (!lead.length) return null;

  const sorted = [...lead].sort(
    (a, b) => FRENCH_GRADES.indexOf(a.grade) - FRENCH_GRADES.indexOf(b.grade),
  );
  const maxGrade = sorted[sorted.length - 1].grade;

  const closed = lead.filter(
    (c) =>
      c.mode === "lead_onsight" ||
      c.mode === "lead_flash" ||
      c.mode === "lead_redpoint",
  ).length;

  const avgAttempts =
    Math.round(
      (lead.reduce((s, c) => s + (c.attempts ?? 1), 0) / lead.length) * 10,
    ) / 10;

  return {
    maxGrade,
    total: lead.length,
    closed,
    completionRate: Math.round((closed / lead.length) * 100),
    avgAttempts,
  };
}

export function useClimbAnalysis() {
  return {
    getGlobalStats,
    getLeadStats,
  };
}
