import { FRENCH_GRADES } from "@/constants/constants";
import { LeadStats } from "@/types/analysis";
import { Climb } from "@/types/climb";

function getLeadStats(climbs: Climb[]): LeadStats | null {
  const lead = climbs.filter((c) => c.style === "lead");
  if (!lead.length) return null;

  const closed = lead.filter(
    (c) =>
      c.mode === "lead_onsight" ||
      c.mode === "lead_flash" ||
      c.mode === "lead_redpoint",
  );

  const sorted = [...closed].sort(
    (a, b) => FRENCH_GRADES.indexOf(a.grade) - FRENCH_GRADES.indexOf(b.grade),
  );
  const maxGrade = sorted.length ? sorted[sorted.length - 1].grade : "—";

  const avgAttempts =
    Math.round(
      (lead.reduce((s, c) => s + (c.attempts ?? 1), 0) / lead.length) * 10,
    ) / 10;

  return {
    maxGrade,
    total: lead.length,
    closed: closed.length,
    completionRate: Math.round((closed.length / lead.length) * 100),
    avgAttempts,
  };
}

export function getLeadChartData(
  climbs: Climb[],
): { label: string; value: number }[] {
  const filtered = climbs.filter(
    (c) => c.style === "lead" && c.mode !== "lead_failure",
  );

  const gradeCounts = filtered.reduce<Record<string, number>>((acc, climb) => {
    acc[climb.grade] = (acc[climb.grade] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(gradeCounts)
    .map(([label, value]) => ({ label, value }))
    .sort(
      (a, b) => FRENCH_GRADES.indexOf(a.label) - FRENCH_GRADES.indexOf(b.label),
    );
}

export function useClimbAnalysis() {
  return {
    getLeadStats,
    getLeadChartData,
  };
}
