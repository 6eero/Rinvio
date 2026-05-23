import KPI from "@/components/Analytics/KPI";
import { useClimbAnalysis } from "@/hooks/useClimbAnalysis";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { Climb } from "@/types/climb";
import React, { useEffect, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ClimbAnalytics() {
  const climbs = useClimbsStore((s) => s.climbs);
  const refresh = useClimbsStore((s) => s.refresh);
  const { getGlobalStats, getLeadStats } = useClimbAnalysis();

  useEffect(() => {
    refresh();
  }, []);

  const global = useMemo(() => getGlobalStats(climbs), [climbs]);
  const lead = useMemo(() => getLeadStats(climbs), [climbs]);

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
        {/* ── GLOBALI ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {i18n.t("analytics.globalTitle")}
          </Text>
        </View>
        <View style={styles.grid}>
          <KPI
            singleLine
            label={i18n.t("analytics.total")}
            value={String(global.total)}
          />
          <KPI
            singleLine
            label={i18n.t("analytics.successRate")}
            value={`${global.successRate}%`}
          />
          <KPI
            singleLine
            label={i18n.t("analytics.avgAttempts")}
            value={String(global.avgAttempts)}
          />
        </View>

        {/* ── LEAD ── */}
        {lead && (
          <>
            <View style={[styles.sectionHeader, { marginTop: 28 }]}>
              <Text style={styles.sectionTitle}>
                {i18n.t("analytics.leadTitle")}
              </Text>
            </View>
            <View style={styles.grid}>
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
              <KPI
                singleLine
                label={i18n.t("analytics.avgAttemptsLead")}
                value={String(lead.avgAttempts)}
              />
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#6b6a65", fontSize: 16 },
  scrollContent: { paddingHorizontal: 16, paddingVertical: 20 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
function getGlobalStats(climbs: Climb[]): any {
  throw new Error("Function not implemented.");
}

function getLeadStats(climbs: Climb[]): any {
  throw new Error("Function not implemented.");
}
