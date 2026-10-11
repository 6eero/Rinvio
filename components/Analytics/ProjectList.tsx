import Card from "@/components/Layout/Card";
import { Colors, Radius } from "@/constants/theme";
import { Project } from "@/domain/analytics";
import i18n from "@/i18n";
import { formatShortDate } from "@/utilities/date";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";

/** Routes still to send on lead, hardest first; each opens its latest entry. */
export default function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <Card style={{ overflow: "hidden" }}>
      {projects.map(({ last, sessions, attempts }, i) => (
        <TouchableOpacity
          key={last.id}
          onPress={() => router.push(`/edit/${last.id}`)}
          activeOpacity={0.7}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 12,
            borderTopWidth: i === 0 ? 0 : 0.5,
            borderTopColor: Colors.borderSubtle,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.surfaceRaised,
              paddingVertical: 6,
              borderRadius: Radius.md,
              minWidth: 46,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: Colors.text,
                fontSize: 14,
                fontWeight: "800",
                fontFamily: "monospace",
              }}
            >
              {last.grade}
            </Text>
          </View>
          <View style={{ flex: 1, gap: 2 }}>
            <Text
              style={{ color: Colors.text, fontSize: 15, fontWeight: "600" }}
              numberOfLines={1}
            >
              {last.route}
            </Text>
            <Text
              style={{ color: Colors.textMuted, fontSize: 12 }}
              numberOfLines={1}
            >
              {[
                last.crag,
                i18n.t("home.attempts", { count: attempts }),
                sessions > 1 &&
                  i18n.t("analytics.projects.sessions", { count: sessions }),
                formatShortDate(last.date, i18n.locale),
              ]
                .filter(Boolean)
                .join(" · ")}
            </Text>
          </View>
          <ChevronRight size={16} color={Colors.textFaint} />
        </TouchableOpacity>
      ))}
    </Card>
  );
}
