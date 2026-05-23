import i18n from "@/i18n";
import { Climb } from "@/types/climb";
import { router } from "expo-router";
import { RotateCcw } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Badge from "./Badge/Badge";
import DotRating from "./Indicators/DotRating";

export default function ClimbCard({ climb }: { climb: Climb }) {
  const isFailed =
    climb.mode === "lead_failure" || climb.mode === "follow_failure";

  return (
    <TouchableOpacity
      onPress={() => router.push(`/edit/${climb.id}`)}
      activeOpacity={0.8}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
      }}
    >
      {/* Voto (Grade) - Stile "Tabellino" */}
      <View
        style={{
          backgroundColor: "#252525",
          padding: 8,
          borderRadius: 8,
          minWidth: 50,
          alignItems: "center",
          marginRight: 16,
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 16,
            fontWeight: "800",
            fontFamily: "monospace",
          }}
        >
          {climb.grade}
        </Text>
      </View>

      {/* Info Centrali */}
      <View style={{ flex: 1, gap: 4 }}>
        <Text
          style={{ color: "#f0f0f0", fontSize: 16, fontWeight: "600" }}
          numberOfLines={1}
        >
          {climb.route}
        </Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Badge text={i18n.t(`options.style.${climb.style}`).toUpperCase()} />
          <Badge
            text={i18n.t(`options.mode.${climb.mode}`).toUpperCase()}
            badgeColor={isFailed ? "#4a2a2a" : "#2a4a2a"}
            textColor={isFailed ? "#ffaaaa" : "#aaffaa"}
          />
        </View>
      </View>

      {/* Indicatori a destra */}
      <View style={{ alignItems: "flex-end", gap: 6 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <RotateCcw size={14} color="#888" />
          <Text style={{ color: "#888", fontSize: 12 }}>{climb.attempts}</Text>
        </View>
        <DotRating value={climb.difficulty} />
      </View>
    </TouchableOpacity>
  );
}
