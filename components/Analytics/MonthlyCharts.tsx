import Card from "@/components/Layout/Card";
import { Colors } from "@/constants/theme";
import { MonthStat } from "@/domain/analytics";
import { FRENCH_GRADES, gradeIndex } from "@/domain/climb";
import i18n from "@/i18n";
import { formatMonth } from "@/utilities/date";
import { parse } from "date-fns";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Text as SvgText } from "react-native-svg";
import { Legend, Segment, StackedBar, outcomeSegments } from "./StackedBar";

const AXIS_WIDTH = 34;
const PROGRESSION_HEIGHT = 170;
const VOLUME_HEIGHT = 110;
const PAD_Y = 10;

const shortMonth = (month: string) =>
  parse(month, "yyyy-MM", new Date()).toLocaleDateString(i18n.locale, {
    month: "narrow",
  });

/** Selection overlay: one tappable column per month over a chart. */
function MonthColumns({
  months,
  onSelect,
}: {
  months: MonthStat[];
  onSelect: (index: number) => void;
}) {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: AXIS_WIDTH,
        right: 0,
        flexDirection: "row",
      }}
    >
      {months.map((m, i) => (
        <Pressable
          key={m.month}
          style={{ flex: 1 }}
          onPress={() => onSelect(i)}
          accessibilityLabel={formatMonth(m.month, i18n.locale)}
        />
      ))}
    </View>
  );
}

/** Month initials under a chart, thinned out when months are many. */
function MonthAxis({
  months,
  selected,
}: {
  months: MonthStat[];
  selected: number;
}) {
  const step = Math.ceil(months.length / 12);
  return (
    <View style={{ flexDirection: "row", marginLeft: AXIS_WIDTH, marginTop: 6 }}>
      {months.map((m, i) => (
        <Text
          key={m.month}
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 10,
            color: i === selected ? Colors.text : Colors.textMuted,
            fontWeight: i === selected ? "700" : "400",
          }}
          numberOfLines={1}
        >
          {i === selected || (months.length - 1 - i) % step === 0
            ? shortMonth(m.month)
            : ""}
        </Text>
      ))}
    </View>
  );
}

/** Hardest send and hardest onsight/flash of each month, on the grade scale. */
function ProgressionChart({
  months,
  selected,
  width,
}: {
  months: MonthStat[];
  selected: number;
  width: number;
}) {
  const indexes = months.flatMap((m) =>
    [m.maxSend, m.maxFirstTry]
      .filter((g): g is string => g !== null)
      .map(gradeIndex),
  );
  if (!indexes.length) {
    return (
      <Text
        style={{
          color: Colors.textMuted,
          fontSize: 13,
          textAlign: "center",
          paddingVertical: 24,
        }}
      >
        {i18n.t("analytics.monthly.noSends")}
      </Text>
    );
  }

  const min = Math.max(0, Math.min(...indexes) - 1);
  const max = Math.min(FRENCH_GRADES.length - 1, Math.max(...indexes) + 1);
  const plotWidth = width - AXIS_WIDTH;
  const colWidth = plotWidth / months.length;
  const x = (i: number) => AXIS_WIDTH + colWidth * (i + 0.5);
  const y = (index: number) =>
    PAD_Y +
    (PROGRESSION_HEIGHT - 2 * PAD_Y) * (1 - (index - min) / (max - min || 1));

  const gridStep = Math.ceil((max - min + 1) / 7);
  const gridIndexes = [];
  for (let i = max; i >= min; i -= gridStep) gridIndexes.push(i);

  const series = [
    { key: "maxSend", color: Colors.outcome.redpoint },
    { key: "maxFirstTry", color: Colors.outcome.firstTry },
  ] as const;

  return (
    <Svg width={width} height={PROGRESSION_HEIGHT}>
      {gridIndexes.map((index) => (
        <Line
          key={index}
          x1={AXIS_WIDTH}
          x2={width}
          y1={y(index)}
          y2={y(index)}
          stroke={Colors.chartGrid}
          strokeWidth={0.5}
        />
      ))}
      {gridIndexes.map((index) => (
        <SvgText
          key={`label-${index}`}
          x={0}
          y={y(index) + 4}
          fill={Colors.textMuted}
          fontSize={11}
          fontFamily="monospace"
        >
          {FRENCH_GRADES[index]}
        </SvgText>
      ))}

      <Line
        x1={x(selected)}
        x2={x(selected)}
        y1={0}
        y2={PROGRESSION_HEIGHT}
        stroke={Colors.borderSelected}
        strokeWidth={1}
      />

      {series.map(({ key, color }) => {
        // lines only join consecutive months: a gap means no sends that month
        let d = "";
        months.forEach((m, i) => {
          const grade = m[key];
          if (grade === null) return;
          const prev = months[i - 1]?.[key];
          d += `${prev ? "L" : "M"} ${x(i)} ${y(gradeIndex(grade))} `;
        });
        if (!d) return null;
        return (
          <Path
            key={key}
            d={d}
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinejoin="round"
          />
        );
      })}

      {series.map(({ key, color }) =>
        months.map((m, i) => {
          const grade = m[key];
          if (grade === null) return null;
          return (
            <Circle
              key={`${key}-${m.month}`}
              cx={x(i)}
              cy={y(gradeIndex(grade))}
              r={i === selected ? 5 : 4}
              fill={color}
              stroke={Colors.surface}
              strokeWidth={2}
            />
          );
        }),
      )}
    </Svg>
  );
}

/** Routes per month, split by how they went. */
function VolumeChart({
  months,
  selected,
}: {
  months: MonthStat[];
  selected: number;
}) {
  const maxTotal = Math.max(1, ...months.map((m) => m.total));
  return (
    <View
      style={{
        flexDirection: "row",
        height: VOLUME_HEIGHT,
        marginLeft: AXIS_WIDTH,
        alignItems: "flex-end",
      }}
    >
      {months.map((m, i) => {
        // bottom-up, best outcome on the baseline
        const segments = outcomeSegments(m.counts).filter((s) => s.count > 0);
        return (
          <View
            key={m.month}
            style={{
              flex: 1,
              alignItems: "center",
              opacity: i === selected ? 1 : 0.55,
            }}
          >
            <View
              style={{
                width: "60%",
                maxWidth: 18,
                height: (m.total / maxTotal) * VOLUME_HEIGHT,
                flexDirection: "column-reverse",
                gap: 2,
              }}
            >
              {segments.map((s, j) => (
                <View
                  key={s.key}
                  style={{
                    flex: s.count,
                    backgroundColor: s.color,
                    borderTopLeftRadius: j === segments.length - 1 ? 4 : 0,
                    borderTopRightRadius: j === segments.length - 1 ? 4 : 0,
                  }}
                />
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

function MonthDetail({ month }: { month: MonthStat }) {
  const parts = [
    i18n.t("home.routes", { count: month.total }),
    month.maxSend &&
      i18n.t("analytics.monthly.maxSend", { grade: month.maxSend }),
    month.maxFirstTry &&
      i18n.t("analytics.monthly.maxFirstTry", { grade: month.maxFirstTry }),
  ].filter(Boolean);

  return (
    <View style={{ gap: 8 }}>
      <Text style={{ color: Colors.text, fontSize: 14, fontWeight: "700" }}>
        {formatMonth(month.month, i18n.locale)}
        <Text style={{ color: Colors.textMuted, fontWeight: "400" }}>
          {`  ${parts.join(" · ")}`}
        </Text>
      </Text>
      {month.total > 0 && (
        <>
          <StackedBar segments={outcomeSegments(month.counts)} height={8} />
          <Legend
            segments={outcomeSegments(month.counts).filter((s) => s.count > 0)}
          />
        </>
      )}
    </View>
  );
}

/**
 * Grade progression and volume month by month. Tapping a month on either
 * chart selects it in both and shows its numbers.
 */
export default function MonthlyCharts({ months }: { months: MonthStat[] }) {
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  // default to the latest month with climbs
  const latest = months.findLastIndex((m) => m.total > 0);
  const current = Math.min(selected ?? latest, months.length - 1);

  const seriesLegend: Segment[] = [
    {
      key: "maxSend",
      label: i18n.t("analytics.monthly.sendSeries"),
      count: 0,
      color: Colors.outcome.redpoint,
    },
    {
      key: "maxFirstTry",
      label: i18n.t("analytics.monthly.firstTrySeries"),
      count: 0,
      color: Colors.outcome.firstTry,
    },
  ];

  return (
    <Card style={{ padding: 14, gap: 16 }}>
      <View style={{ gap: 10 }}>
        <Text style={{ color: Colors.textLabel, fontSize: 12, fontWeight: "700" }}>
          {i18n.t("analytics.monthly.progression")}
        </Text>
        <SeriesKey segments={seriesLegend} />
        <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
          {width > 0 && (
            <ProgressionChart months={months} selected={current} width={width} />
          )}
          <MonthColumns months={months} onSelect={setSelected} />
        </View>
        <MonthAxis months={months} selected={current} />
      </View>

      <View style={{ gap: 10 }}>
        <Text style={{ color: Colors.textLabel, fontSize: 12, fontWeight: "700" }}>
          {i18n.t("analytics.monthly.volume")}
        </Text>
        <View>
          <VolumeChart months={months} selected={current} />
          <MonthColumns months={months} onSelect={setSelected} />
        </View>
        <MonthAxis months={months} selected={current} />
      </View>

      <View
        style={{
          borderTopWidth: 0.5,
          borderTopColor: Colors.divider,
          paddingTop: 12,
        }}
      >
        <MonthDetail month={months[current]} />
      </View>
    </Card>
  );
}

/** Line series key: a short stroke instead of a dot. */
function SeriesKey({ segments }: { segments: Segment[] }) {
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 14 }}>
      {segments.map((s) => (
        <View
          key={s.key}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <View
            style={{
              width: 14,
              height: 2,
              borderRadius: 1,
              backgroundColor: s.color,
            }}
          />
          <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
