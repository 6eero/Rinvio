import Card from "@/components/Layout/Card";
import { Colors } from "@/constants/theme";
import { Climb } from "@/domain/climb";
import { getSessionSummary } from "@/domain/stats";
import i18n from "@/i18n";
import { daysAgo, formatShortDate } from "@/utilities/date";
import { router } from "expo-router";
import { ChevronDown, Plus } from "lucide-react-native";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ClimbCard from "./ClimbCard";

function sessionDateLabel(date: string): string {
  const days = daysAgo(date);
  if (days === 0) return i18n.t("home.today");
  if (days === 1) return i18n.t("home.yesterday");
  return formatShortDate(date, i18n.locale);
}

/** Collapsible group of the climbs of one session (same day and crag). */
export default function ClimbAccordion({
  date,
  crag,
  climbs,
  expanded,
  onToggle,
}: {
  date: string;
  crag: string;
  climbs: Climb[];
  expanded: boolean;
  onToggle: () => void;
}) {
  const rotation = useSharedValue(expanded ? 180 : 0);

  useEffect(() => {
    rotation.set(withTiming(expanded ? 180 : 0, { duration: 200 }));
  }, [expanded, rotation]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.get()}deg` }],
  }));

  const summary = getSessionSummary(climbs);
  const subtitle = [
    sessionDateLabel(date),
    i18n.t("home.routes", { count: summary.total }),
    summary.closed > 0 && i18n.t("home.closed", { count: summary.closed }),
    summary.maxGrade && i18n.t("home.maxGrade", { grade: summary.maxGrade }),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Card style={{ overflow: "hidden" }}>
      <TouchableOpacity
        onPress={onToggle}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
          padding: 16,
        }}
        activeOpacity={0.7}
      >
        <View style={{ flex: 1, gap: 4 }}>
          <Text
            style={{ color: Colors.text, fontSize: 17, fontWeight: "700" }}
            numberOfLines={1}
          >
            {crag}
          </Text>
          <Text style={{ color: Colors.textMuted, fontSize: 13 }}>
            {subtitle}
          </Text>
        </View>

        <Animated.View style={chevronStyle}>
          <ChevronDown size={20} color={Colors.textMuted} />
        </Animated.View>
      </TouchableOpacity>

      {expanded && (
        <>
          {climbs.map((climb) => (
            <View
              key={climb.id}
              style={{
                borderTopWidth: 0.5,
                borderTopColor: Colors.borderSubtle,
              }}
            >
              <ClimbCard climb={climb} />
            </View>
          ))}

          {/* the add form takes the crag from the date, so the date is enough */}
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/add", params: { date } })}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              padding: 14,
              borderTopWidth: 0.5,
              borderTopColor: Colors.borderSubtle,
            }}
          >
            <Plus size={16} color={Colors.textMuted} />
            <Text
              style={{
                color: Colors.textMuted,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              {i18n.t("home.addToSession")}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </Card>
  );
}
