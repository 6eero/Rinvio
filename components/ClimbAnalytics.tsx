import KPI from "@/components/Analytics/KPI";
import { useClimbAnalysis } from "@/hooks/useClimbAnalysis";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import React, { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ActivityCalendar from "./Analytics/ActivityCalendar";
import { GradeChart } from "./Analytics/GradeChart";
import AnalyticSection from "./Analytics/Section";

export default function ClimbAnalytics() {
  const climbs = useClimbsStore((s) => s.climbs);
  const refresh = useClimbsStore((s) => s.refresh);
  const { getLeadStats } = useClimbAnalysis();

  useEffect(() => {
    refresh();
  }, []);

  const lead = useMemo(() => getLeadStats(climbs), [climbs]);

  const currentYear = new Date().getFullYear();

  if (!climbs.length) {
    return (
      <SafeAreaView
        style={styles.container}
        edges={["left", "right", "bottom"]}
      >
        <View style={styles.center}>
          <Text style={styles.emptyText}>{i18n.t("analytics.empty")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── KPIs ── */}
        {lead && (
          <AnalyticSection
            title={i18n.t("analytics.leadTitle")}
            children={
              <View style={styles.grid}>
                <KPI
                  singleLine
                  label={i18n.t("analytics.maxLeadGrade")}
                  value={lead.maxGrade}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.totalLead")}
                  value={String(lead.total)}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.closedLead")}
                  value={String(lead.closed)}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.completionRateLead")}
                  value={`${lead.completionRate}%`}
                />
              </View>
            }
          />
        )}

        {/* ── CALENDAR ── */}
        <AnalyticSection
          title={i18n.t("analytics.calendar.title", { year: currentYear })}
          children={<ActivityCalendar climbs={climbs} />}
        />

        {/* ── Grade chart ── */}
        <AnalyticSection
          title={i18n.t("analytics.gradeChart.title")}
          children={<GradeChart climbs={climbs} />}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#6b6a65", fontSize: 16 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
