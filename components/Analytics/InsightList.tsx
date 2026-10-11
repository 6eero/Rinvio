import Card from "@/components/Layout/Card";
import { Colors } from "@/constants/theme";
import { Insight, InsightTone } from "@/domain/analytics";
import i18n from "@/i18n";
import {
  Lightbulb,
  LucideIcon,
  TrendingUp,
  TriangleAlert,
} from "lucide-react-native";
import { Text, View } from "react-native";

const TONES: Record<InsightTone, { icon: LucideIcon; color: string }> = {
  positive: { icon: TrendingUp, color: Colors.successText },
  neutral: { icon: Lightbulb, color: Colors.textSecondary },
  warning: { icon: TriangleAlert, color: Colors.warningText },
};

/** Readings of the data in plain words, each with an icon for its tone. */
export default function InsightList({ insights }: { insights: Insight[] }) {
  return (
    <Card>
      {insights.map((insight, i) => {
        const { icon: Icon, color } = TONES[insight.tone];
        return (
          <View
            key={insight.key}
            style={{
              flexDirection: "row",
              gap: 12,
              padding: 14,
              borderTopWidth: i === 0 ? 0 : 0.5,
              borderTopColor: Colors.borderSubtle,
            }}
          >
            <Icon size={18} color={color} style={{ marginTop: 1 }} />
            <Text
              style={{
                flex: 1,
                color: Colors.textSecondary,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {i18n.t(`analytics.insights.${insight.key}`, insight.params)}
            </Text>
          </View>
        );
      })}
    </Card>
  );
}
