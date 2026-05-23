import i18n from "@/i18n";
import { Climb } from "@/types/climb";
import { router } from "expo-router";
import { RotateCcw } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Badge from "./Badge/Badge";
import DotRating from "./Indicators/DotRating";

export default function ClimbCard({ climb }: { climb: Climb }) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/edit/${climb.id}`)}
      style={{
        backgroundColor: "#161616",
        borderColor: "rgba(255,255,255,0.07)",
        flexDirection: "row",
        borderRadius: 12,
        marginHorizontal: 12,
        marginVertical: 4,
        borderWidth: 0.5,
        overflow: "hidden",
      }}
      activeOpacity={0.75}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 0,
          paddingRight: 12,
          gap: 14,
        }}
      >
        {/* LEFT */}
        <View
          style={{
            backgroundColor: "#1f1f1f",
            borderRightColor: "rgba(255,255,255,0.08)",
            borderRightWidth: 0.5,
            minWidth: 54,
            alignSelf: "stretch",
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 8,
            paddingVertical: 14,
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 21,
              fontWeight: "700",
              fontFamily: "monospace",
              letterSpacing: -0.5,
            }}
          >
            {climb.grade}
          </Text>
        </View>

        {/* CENTER */}
        <View
          style={{
            flex: 1,
            gap: 5,
            paddingVertical: 12,
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontSize: 14,
              fontWeight: "600",
              flexShrink: 1,
            }}
            numberOfLines={1}
          >
            {climb.route}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Badge
              text={i18n.t(`options.style.${climb.style}`).toUpperCase()}
            />
            <Badge text={i18n.t(`options.mode.${climb.mode}`).toUpperCase()} />
          </View>
        </View>

        {/* RIGHT */}
        <View
          style={{
            alignItems: "flex-end",
            gap: 6,
            flexShrink: 0,
            paddingVertical: 12,
          }}
        >
          <Badge text={climb.attempts.toString()} icon={<RotateCcw />} />
          <DotRating value={climb.difficulty} />
        </View>
      </View>
    </TouchableOpacity>
  );
}
