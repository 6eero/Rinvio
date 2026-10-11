import Card from "@/components/Layout/Card";
import { Colors } from "@/constants/theme";
import {
  TimeRange,
  filterByRange,
  getCragStats,
  getFollowSummary,
  getGradeRows,
  getInsights,
  getLeadSummary,
  getMonthlyStats,
  getOverview,
  getProjects,
  getRecords,
  topSendsAverage,
} from "@/domain/analytics";
import { Climb } from "@/domain/climb";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ActivityCalendar from "./Analytics/ActivityCalendar";
import CragList from "./Analytics/CragList";
import GradePyramid from "./Analytics/GradePyramid";
import InsightList from "./Analytics/InsightList";
import KPI from "./Analytics/KPI";
import MonthlyCharts from "./Analytics/MonthlyCharts";
import ProjectList from "./Analytics/ProjectList";
import RangeSelector from "./Analytics/RangeSelector";
import AnalyticSection from "./Analytics/Section";
import { Legend, StackedBar, outcomeSegments } from "./Analytics/StackedBar";

const LIST_SIZE = 5;

/** Props of a KPI showing a record: its grade and where it was set. */
const recordKPI = (climb: Climb | null) =>
  climb
    ? {
        value: climb.grade,
        caption: climb.route,
        onPress: () => router.push(`/edit/${climb.id}`),
      }
    : { value: "—" };

export default function ClimbAnalytics() {
  const climbs = useClimbsStore((s) => s.climbs);
  const [range, setRange] = useState<TimeRange>("all");

  const data = useMemo(() => {
    const today = new Date();
    const inRange = filterByRange(climbs, range, today);
    return {
      climbs: inRange,
      overview: getOverview(inRange),
      records: getRecords(inRange),
      top10: topSendsAverage(inRange),
      lead: getLeadSummary(inRange),
      follow: getFollowSummary(inRange),
      gradeRows: getGradeRows(inRange),
      months: getMonthlyStats(inRange, range, today),
      insights: getInsights(inRange, climbs, today),
      crags: getCragStats(inRange),
      // a project stays open until sent, whenever that happened
      projects: getProjects(climbs),
    };
  }, [climbs, range]);

  if (!climbs.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>{i18n.t("analytics.empty")}</Text>
      </View>
    );
  }

  const { overview, records, top10, lead, follow, projects } = data;

  return (
    <>
      <RangeSelector value={range} onChange={setRange} />

      {!data.climbs.length ? (
        <Text style={[styles.emptyText, { textAlign: "center" }]}>
          {i18n.t("analytics.emptyRange")}
        </Text>
      ) : (
        <>
          <AnalyticSection title={i18n.t("analytics.overview.title")}>
            <View style={styles.grid}>
              <KPI
                singleLine
                label={i18n.t("analytics.overview.routes")}
                value={String(overview.total)}
                caption={i18n.t("analytics.overview.split", {
                  lead: overview.lead,
                  follow: overview.follow,
                })}
              />
              <KPI
                singleLine
                label={i18n.t("analytics.overview.days")}
                value={String(overview.days)}
                caption={i18n.t("analytics.overview.crags", {
                  count: overview.crags,
                })}
              />
            </View>
            <Card style={{ padding: 14, gap: 12, marginTop: 10 }}>
              <StackedBar segments={outcomeSegments(overview.counts)} />
              <Legend segments={outcomeSegments(overview.counts)} showPercent />
            </Card>
          </AnalyticSection>

          {lead && (
            <AnalyticSection
              title={i18n.t("analytics.lead.title")}
              subtitle={i18n.t("analytics.lead.subtitle", {
                count: lead.total,
              })}
            >
              <View style={styles.grid}>
                <KPI
                  singleLine
                  label={i18n.t("analytics.level.maxSend")}
                  accent={Colors.outcome.redpoint}
                  {...recordKPI(records.send)}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.level.top10")}
                  value={top10?.grade ?? "—"}
                  caption={
                    top10
                      ? i18n.t("analytics.level.top10Caption", {
                          count: top10.count,
                        })
                      : undefined
                  }
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.level.maxOnsight")}
                  accent={Colors.outcome.firstTry}
                  {...recordKPI(records.onsight)}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.level.maxFlash")}
                  accent={Colors.outcome.firstTry}
                  {...recordKPI(records.flash)}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.lead.sendRate")}
                  value={`${lead.sendRate}%`}
                  caption={i18n.t("analytics.lead.sendCaption", {
                    onsight: lead.onsight,
                    flash: lead.flash,
                    redpoint: lead.redpoint,
                  })}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.lead.firstTryRate")}
                  value={`${lead.firstTryRate}%`}
                  caption={i18n.t("analytics.lead.firstTryCaption")}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.lead.hangdog")}
                  accent={Colors.outcome.hangdog}
                  value={String(lead.hangdog)}
                  caption={
                    records.hangdog
                      ? i18n.t("home.maxGrade", {
                          grade: records.hangdog.grade,
                        })
                      : undefined
                  }
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.lead.failure")}
                  accent={Colors.outcome.failure}
                  value={String(lead.failure)}
                  caption={i18n.t("analytics.lead.failureCaption", {
                    rate: lead.failureRate,
                  })}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.lead.toppedRate")}
                  value={`${lead.toppedRate}%`}
                  caption={i18n.t("analytics.lead.toppedCaption")}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.lead.avgRedpointAttempts")}
                  value={
                    lead.avgRedpointAttempts === null
                      ? "—"
                      : String(lead.avgRedpointAttempts)
                  }
                  caption={i18n.t("analytics.lead.avgRedpointCaption")}
                />
              </View>
            </AnalyticSection>
          )}

          {data.insights.length > 0 && (
            <AnalyticSection title={i18n.t("analytics.insights.title")}>
              <InsightList insights={data.insights} />
            </AnalyticSection>
          )}

          {follow && (
            <AnalyticSection
              title={i18n.t("analytics.follow.title")}
              subtitle={i18n.t("analytics.follow.subtitle")}
            >
              <View style={styles.grid}>
                <KPI
                  singleLine
                  label={i18n.t("analytics.follow.topped")}
                  accent={Colors.outcome.follow}
                  value={`${follow.topped}/${follow.total}`}
                  caption={`${follow.toppedRate}%`}
                />
                <KPI
                  singleLine
                  label={i18n.t("analytics.follow.maxGrade")}
                  value={follow.maxGrade ?? "—"}
                  caption={i18n.t("analytics.follow.failures", {
                    count: follow.failure,
                  })}
                />
              </View>
            </AnalyticSection>
          )}

          <AnalyticSection
            title={i18n.t("analytics.pyramid.title")}
            subtitle={i18n.t("analytics.pyramid.subtitle")}
          >
            <GradePyramid rows={data.gradeRows} climbs={data.climbs} />
          </AnalyticSection>

          {data.months.length > 1 && (
            <AnalyticSection
              title={i18n.t("analytics.monthly.title")}
              subtitle={i18n.t("analytics.monthly.subtitle")}
            >
              <MonthlyCharts months={data.months} />
            </AnalyticSection>
          )}

          <AnalyticSection title={i18n.t("analytics.crags.title")}>
            <CragList crags={data.crags.slice(0, LIST_SIZE)} />
          </AnalyticSection>
        </>
      )}

      {/* projects and calendar don't depend on the selected period */}
      {projects.open.length > 0 && (
        <AnalyticSection
          title={i18n.t("analytics.projects.title")}
          subtitle={i18n.t("analytics.projects.subtitle", {
            open: projects.open.length,
            sent: projects.sent,
          })}
        >
          <ProjectList projects={projects.open.slice(0, LIST_SIZE)} />
        </AnalyticSection>
      )}

      <AnalyticSection
        title={i18n.t("analytics.calendar.title", {
          year: new Date().getFullYear(),
        })}
      >
        <ActivityCalendar climbs={climbs} />
      </AnalyticSection>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: Colors.textFaint, fontSize: 16 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
