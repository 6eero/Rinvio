import Card from "@/components/Layout/Card";
import { Colors } from "@/constants/theme";
import { GradeRow, countByCategory } from "@/domain/analytics";
import { Climb } from "@/domain/climb";
import i18n from "@/i18n";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Legend, StackedBar, outcomeSegments } from "./StackedBar";

/**
 * Routes per grade, hardest on top, each bar split by how the routes went.
 * Tapping a grade shows its breakdown in the legend.
 */
export default function GradePyramid({
  rows,
  climbs,
}: {
  rows: GradeRow[];
  climbs: Climb[];
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const maxTotal = Math.max(1, ...rows.map((r) => r.total));
  const selectedRow = rows.find((r) => r.grade === selected);

  return (
    <Card style={{ padding: 14, gap: 6 }}>
      {[...rows].reverse().map((row) => {
        const dimmed = selected !== null && selected !== row.grade;
        return (
          <TouchableOpacity
            key={row.grade}
            activeOpacity={0.7}
            disabled={row.total === 0}
            onPress={() =>
              setSelected((s) => (s === row.grade ? null : row.grade))
            }
            accessibilityLabel={`${row.grade}: ${row.total}`}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              opacity: dimmed ? 0.35 : 1,
            }}
          >
            <Text
              style={{
                width: 34,
                color: row.total ? Colors.text : Colors.textFaint,
                fontSize: 13,
                fontWeight: "700",
                fontFamily: "monospace",
              }}
            >
              {row.grade}
            </Text>
            <View style={{ flex: 1 }}>
              <View style={{ width: `${(row.total / maxTotal) * 100}%` }}>
                <StackedBar
                  segments={outcomeSegments(row.counts)}
                  height={14}
                />
              </View>
            </View>
            <Text
              style={{
                width: 26,
                textAlign: "right",
                color: Colors.textMuted,
                fontSize: 12,
              }}
            >
              {row.total || ""}
            </Text>
          </TouchableOpacity>
        );
      })}

      <View
        style={{
          borderTopWidth: 0.5,
          borderTopColor: Colors.divider,
          marginTop: 8,
          paddingTop: 12,
          gap: 8,
        }}
      >
        <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
          {selectedRow
            ? i18n.t("analytics.pyramid.selected", {
                grade: selectedRow.grade,
                count: selectedRow.total,
              })
            : i18n.t("analytics.pyramid.hint")}
        </Text>
        <Legend
          segments={outcomeSegments(
            selectedRow ? selectedRow.counts : countByCategory(climbs),
          )}
          showPercent
        />
      </View>
    </Card>
  );
}
