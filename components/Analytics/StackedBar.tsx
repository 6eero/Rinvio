import { Colors } from "@/constants/theme";
import { CategoryCounts, OUTCOME_CATEGORIES } from "@/domain/analytics";
import i18n from "@/i18n";
import { Text, View } from "react-native";

export interface Segment {
  key: string;
  label: string;
  count: number;
  color: string;
}

/** One segment per outcome category, from the best to the worst. */
export const outcomeSegments = (counts: CategoryCounts): Segment[] =>
  OUTCOME_CATEGORIES.map((key) => ({
    key,
    label: i18n.t(`analytics.outcome.${key}`),
    count: counts[key],
    color: Colors.outcome[key],
  }));

/**
 * Horizontal bar split by segment, each as wide as its share; a 2px gap keeps
 * neighbouring segments apart without borders.
 */
export function StackedBar({
  segments,
  height = 10,
}: {
  segments: Segment[];
  height?: number;
}) {
  const visible = segments.filter((s) => s.count > 0);
  return (
    <View style={{ flexDirection: "row", gap: 2, height }}>
      {visible.map((s, i) => (
        <View
          key={s.key}
          style={{
            flex: s.count,
            backgroundColor: s.color,
            borderTopLeftRadius: i === 0 ? 4 : 0,
            borderBottomLeftRadius: i === 0 ? 4 : 0,
            borderTopRightRadius: i === visible.length - 1 ? 4 : 0,
            borderBottomRightRadius: i === visible.length - 1 ? 4 : 0,
          }}
        />
      ))}
    </View>
  );
}

/** Colour key with the count (and share) of each segment. */
export function Legend({
  segments,
  showPercent = false,
}: {
  segments: Segment[];
  showPercent?: boolean;
}) {
  const total = segments.reduce((sum, s) => sum + s.count, 0);
  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
      {segments.map((s) => (
        <View
          key={s.key}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: s.color,
            }}
          />
          <Text style={{ color: Colors.textSecondary, fontSize: 12 }}>
            {s.label}
          </Text>
          <Text
            style={{ color: Colors.text, fontSize: 12, fontWeight: "700" }}
          >
            {s.count}
            {showPercent && total > 0 && (
              <Text style={{ color: Colors.textMuted, fontWeight: "400" }}>
                {` · ${Math.round((s.count / total) * 100)}%`}
              </Text>
            )}
          </Text>
        </View>
      ))}
    </View>
  );
}
