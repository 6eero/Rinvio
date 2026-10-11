import Card from "@/components/Layout/Card";
import { Colors } from "@/constants/theme";
import { CragStat } from "@/domain/analytics";
import i18n from "@/i18n";
import { Text, View } from "react-native";

/** Crags by routes climbed, with a bar relative to the busiest one. */
export default function CragList({ crags }: { crags: CragStat[] }) {
  const maxTotal = Math.max(1, ...crags.map((c) => c.total));
  return (
    <Card>
      {crags.map((crag, i) => (
        <View
          key={crag.crag}
          style={{
            padding: 12,
            gap: 8,
            borderTopWidth: i === 0 ? 0 : 0.5,
            borderTopColor: Colors.borderSubtle,
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}
          >
            <Text
              style={{
                flex: 1,
                color: Colors.text,
                fontSize: 15,
                fontWeight: "600",
              }}
              numberOfLines={1}
            >
              {crag.crag}
            </Text>
            <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
              {[
                i18n.t("home.routes", { count: crag.total }),
                i18n.t("analytics.crags.days", { count: crag.days }),
                crag.maxSend &&
                  i18n.t("home.maxGrade", { grade: crag.maxSend }),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </View>
          <View
            style={{
              height: 6,
              width: `${(crag.total / maxTotal) * 100}%`,
              borderRadius: 3,
              backgroundColor: Colors.chartBar,
            }}
          />
        </View>
      ))}
    </Card>
  );
}
