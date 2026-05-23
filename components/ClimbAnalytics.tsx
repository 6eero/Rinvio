import { FRENCH_GRADES } from "@/constants/constants";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { Climb } from "@/types/climb";
import React, { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import KPI from "./Analytics/KPI";

// ─── Logica Analytics ────────────────────────────────────────────────────────
interface AnalyticsResult {
  maxLeadGrade: string;
  favoriteCrag: string;
  totalLead: number;
  closedLead: number;
  completionRateLead: number;
  avgAttemptsLead: number;
}

function getAnalytics(climbs: Climb[]): AnalyticsResult {
  const empty = {
    maxLeadGrade: "—",
    favoriteCrag: "—",
    totalLead: 0,
    closedLead: 0,
    completionRateLead: 0,
    avgAttemptsLead: 0,
  };

  if (!climbs || climbs.length === 0) return empty;

  const leadClimbs = climbs.filter((c) => c.style === "lead");
  if (leadClimbs.length === 0) return empty;

  // Massimo grado lead (su tutte le lead, non solo chiuse)
  const sorted = [...leadClimbs].sort(
    (a, b) => FRENCH_GRADES.indexOf(a.grade) - FRENCH_GRADES.indexOf(b.grade),
  );
  const maxLeadGrade = sorted[sorted.length - 1].grade;

  // Falesia preferita (su tutte le salite)
  const cragCounts: Record<string, number> = {};
  climbs.forEach((c) => {
    if (c.crag) cragCounts[c.crag] = (cragCounts[c.crag] || 0) + 1;
  });
  const cragKeys = Object.keys(cragCounts);
  const favoriteCrag =
    cragKeys.length > 0
      ? cragKeys.reduce((a, b) => (cragCounts[a] >= cragCounts[b] ? a : b))
      : "—";

  // Salite lead chiuse (onsight, flash, redpoint)
  const closedLead = leadClimbs.filter(
    (c) =>
      c.mode === "lead_onsight" ||
      c.mode === "lead_flash" ||
      c.mode === "lead_redpoint",
  ).length;

  const completionRateLead = Math.round((closedLead / leadClimbs.length) * 100);

  const avgAttemptsLead =
    Math.round(
      (leadClimbs.reduce((sum, c) => sum + (c.attempts ?? 1), 0) /
        leadClimbs.length) *
        10,
    ) / 10;

  return {
    maxLeadGrade,
    favoriteCrag,
    totalLead: leadClimbs.length,
    closedLead,
    completionRateLead,
    avgAttemptsLead,
  };
}

export default function ClimbAnalytics() {
  const climbs = useClimbsStore((s) => s.climbs);
  const refresh = useClimbsStore((s) => s.refresh);

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(() => getAnalytics(climbs), [climbs]);

  if (stats.totalLead === 0) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["left", "right", "bottom"]}
      >
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nessun dato da analizzare</Text>
        </View>
      </SafeAreaView>
    );
  }

  const kpiConfig = [
    { label: i18n.t("analytics.maxLeadGrade"), value: stats.maxLeadGrade },
    { label: i18n.t("analytics.favoriteCrag"), value: stats.favoriteCrag },
    { label: i18n.t("analytics.totalLead"), value: String(stats.totalLead) },
    { label: i18n.t("analytics.closedLead"), value: String(stats.closedLead) },
    {
      label: i18n.t("analytics.completionRateLead"),
      value: `${stats.completionRateLead}%`,
    },
    {
      label: i18n.t("analytics.avgAttemptsLead"),
      value: String(stats.avgAttemptsLead),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── KPI GRID ── */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 24,
          }}
        >
          {kpiConfig.map((kpi, index) => (
            <KPI key={index} singleLine label={kpi.label} value={kpi.value} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#6b6a65", fontSize: 16 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20 },
});
