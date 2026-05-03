import i18n from "@/i18n";
import { Climb } from "@/types/climb";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  climb: Climb;
  onDeleted: () => void;
};

const OUTCOME_COLOR = {
  success: "#16a34a",
  failure: "#dc2626",
};

export default function ClimbCard({ climb, onDeleted }: Props) {
  return (
    <TouchableOpacity
      onPress={() => router.push(`/edit/${climb.id}`)}
      style={[styles.card, { borderLeftColor: OUTCOME_COLOR[climb.outcome] }]}
      activeOpacity={0.7}
    >
      <View style={styles.mainContainer}>
        {/* Sinistra: Grado e Mode */}
        <View style={styles.gradeContainer}>
          <Text style={styles.gradeText}>{climb.grade}</Text>
          <Text style={styles.miniTagText}>
            {i18n.t(`options.mode.${climb.mode}`).toUpperCase()}
          </Text>
        </View>

        {/* Centro: Nome Via, Falesia e Style */}
        <View style={styles.contentContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.routeNameText} numberOfLines={1}>
              {climb.routeName}
            </Text>
            <Text style={styles.styleLabel}>
              • {i18n.t(`options.style.${climb.style}`)}
            </Text>
          </View>

          <View style={styles.subInfoRow}>
            <MapPin size={12} color="#666" style={{ marginRight: 4 }} />
            <Text style={styles.subInfoText} numberOfLines={1}>
              {climb.crag} {climb.length ? `(${climb.length}m)` : ""}
            </Text>
          </View>
        </View>

        {/* Destra: Solo Stats (senza data) */}
        <View style={styles.rightContainer}>
          <View style={styles.statsBadge}>
            <Text style={styles.statsText}>
              {climb.attempts}t · {climb.difficulty}/10
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#161616",
    borderRadius: 10,
    marginHorizontal: 12,
    marginVertical: 4,
    borderLeftWidth: 3,
    position: "relative",
  },
  mainContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8, // Ridotto ancora per compattezza
    paddingHorizontal: 12,
  },
  gradeContainer: {
    width: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#2a2a2a",
    paddingRight: 8,
  },
  gradeText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "800",
  },
  miniTagText: {
    color: "#e85d04", // Colore brand per evidenziare Onsight/Flash/Redpoint
    fontSize: 8,
    fontWeight: "bold",
    marginTop: 2,
  },
  contentContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  routeNameText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  styleLabel: {
    color: "#888",
    fontSize: 10,
    fontStyle: "italic",
  },
  subInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  subInfoText: {
    color: "#666",
    fontSize: 11,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  dateText: {
    color: "#444",
    fontSize: 9,
    marginBottom: 2,
  },
  statsBadge: {
    backgroundColor: "#262626",
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  statsText: {
    color: "#999",
    fontSize: 10,
    fontWeight: "500",
  },
  deleteAction: {
    position: "absolute",
    right: 8,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
});
