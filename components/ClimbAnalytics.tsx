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
  total: number;
  successRate: number;
  maxLeadGrade: string;
  mostVisitedCrag: string;
  avgAttempts: number;
}

function getAnalytics(climbs: Climb[]): AnalyticsResult {
  if (!climbs || climbs.length === 0) {
    return {
      total: 0,
      successRate: 0,
      maxLeadGrade: "—",
      mostVisitedCrag: "—",
      avgAttempts: 0,
    };
  }

  const total = climbs.length;

  const successfulClimbs = climbs.filter((c) => c.outcome === "success");
  const successRate = Math.round((successfulClimbs.length / total) * 100);

  let maxLeadGrade = "—";
  const leadSuccesses = successfulClimbs.filter((c) => c.style === "lead");
  if (leadSuccesses.length > 0) {
    const sorted = [...leadSuccesses].sort(
      (a, b) => FRENCH_GRADES.indexOf(a.grade) - FRENCH_GRADES.indexOf(b.grade),
    );
    maxLeadGrade = sorted[sorted.length - 1].grade;
  }

  const cragCounts: Record<string, number> = {};
  climbs.forEach((c) => {
    if (c.crag) cragCounts[c.crag] = (cragCounts[c.crag] || 0) + 1;
  });
  const cragKeys = Object.keys(cragCounts);
  const mostVisitedCrag =
    cragKeys.length > 0
      ? cragKeys.reduce((a, b) => (cragCounts[a] >= cragCounts[b] ? a : b))
      : "—";

  const totalAttempts = climbs.reduce((sum, c) => sum + (c.attempts ?? 1), 0);
  const avgAttempts = Math.round((totalAttempts / total) * 10) / 10;

  return {
    total,
    successRate,
    maxLeadGrade,
    mostVisitedCrag,
    avgAttempts,
  };
}

export default function ClimbAnalytics() {
  const climbs = useClimbsStore((s) => s.climbs);
  const refresh = useClimbsStore((s) => s.refresh);

  useEffect(() => {
    refresh();
  }, []);

  const stats = useMemo(() => getAnalytics(climbs), [climbs]);

  if (stats.total === 0) {
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
    {
      label: i18n.t("analytics.maxLeadGrade"),
      value: stats.maxLeadGrade,
    },
    {
      label: i18n.t("analytics.favoriteCrag"),
      value: stats.mostVisitedCrag,
    },
    {
      label: i18n.t("analytics.totalClimbs"),
      value: String(stats.total),
    },
    {
      label: i18n.t("analytics.closedClimbs"),
      value: String(Math.round((stats.successRate / 100) * stats.total)),
    },
    {
      label: i18n.t("analytics.successRate"),
      value: `${stats.successRate}%`,
    },
    {
      label: i18n.t("analytics.avgAttempts"),
      value: String(stats.avgAttempts),
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
