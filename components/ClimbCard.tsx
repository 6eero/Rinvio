import i18n from "@/i18n";
import { Climb } from "@/types/climb";
import { router } from "expo-router";
import { MapPin, RotateCcw } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  climb: Climb;
};

const OUTCOME_COLOR = {
  success: "#16a34a",
  failure: "#dc2626",
};

const MODE_STYLE = {
  onsight: {
    textDark: "#5DCAA5",
    bgDark: "rgba(93,202,165,0.1)",
    label: "OS",
  },
  flash: {
    textDark: "#85B7EB",
    bgDark: "rgba(133,183,235,0.1)",
    label: "FL",
  },
  redpoint: {
    textDark: "#F0997B",
    bgDark: "rgba(240,153,123,0.1)",
    label: "RP",
  },
};

function DifficultyDots({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <View style={styles.dotsRow}>
      {Array.from({ length: max }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i < value ? styles.dotFilledDark : styles.dotEmptyDark,
          ]}
        />
      ))}
    </View>
  );
}

export default function ClimbCard({ climb }: Props) {
  const modeInfo = MODE_STYLE[climb.mode] ?? {
    textDark: "#B4B2A9",
    label: climb.mode?.slice(0, 2).toUpperCase() ?? "—",
  };

  const pinColor = "#5F5E5A";

  return (
    <TouchableOpacity
      onPress={() => router.push(`/edit/${climb.id}`)}
      style={styles.card}
      activeOpacity={0.75}
    >
      {/* Accent bar sinistra */}
      <View
        style={[
          styles.accent,
          { backgroundColor: OUTCOME_COLOR[climb.outcome] },
        ]}
      />

      <View style={styles.inner}>
        {/* Colonna grado + mode */}
        <View style={styles.gradeCol}>
          <Text style={styles.gradeText}>{climb.grade}</Text>
          <Text
            style={[
              styles.modeTag,
              { color: modeInfo.textDark, backgroundColor: modeInfo.bgDark },
            ]}
          >
            {modeInfo.label}
          </Text>
        </View>

        {/* Contenuto centrale */}
        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.routeName} numberOfLines={1}>
              {climb.routeName}
            </Text>
            <Text style={styles.styleLabel}>
              · {i18n.t(`options.style.${climb.style}`)}
            </Text>
          </View>

          <View style={styles.subRow}>
            <MapPin size={11} color={pinColor} style={{ marginRight: 3 }} />
            <Text style={styles.subText} numberOfLines={1}>
              {climb.crag}
            </Text>
          </View>
        </View>

        {/* Colonna destra: tentativi + difficoltà */}
        <View style={styles.rightCol}>
          <View style={styles.attemptsPill}>
            <Text style={styles.attemptsText}>{climb.attempts}</Text>
            <RotateCcw size={10} color="#888780" style={{ marginLeft: 4 }} />
          </View>
          <DifficultyDots value={climb.difficulty} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#161616",
    borderColor: "rgba(255,255,255,0.07)",
    flexDirection: "row",
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 4,
    borderWidth: 0.5,
    overflow: "hidden",
  },

  accent: {
    width: 4,
    flexShrink: 0,
  },

  inner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 12,
  },

  /* Grado */
  gradeCol: {
    borderRightColor: "rgba(255,255,255,0.07)",
    minWidth: 44,
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 12,
    borderRightWidth: 0.5,
    gap: 5,
  },

  gradeText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 22,
  },

  modeTag: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },

  modeTagText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  /* Contenuto */
  content: { flex: 1, gap: 3 },
  titleRow: { flexDirection: "row", alignItems: "baseline", gap: 5 },

  routeName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },

  styleLabel: { color: "#5F5E5A", fontSize: 11, flexShrink: 0 },

  subRow: { flexDirection: "row", alignItems: "center" },

  subText: { color: "#5F5E5A", fontSize: 11 },

  /* Destra */
  rightCol: { alignItems: "flex-end", gap: 6, flexShrink: 0 },

  attemptsPill: {
    backgroundColor: "#262626",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  attemptsText: { color: "#888780", fontSize: 11, fontWeight: "600" },

  /* Difficulty dots */
  dotsRow: { flexDirection: "row", gap: 3 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotFilledDark: { backgroundColor: "#B4B2A9" },
  dotEmptyDark: { backgroundColor: "#2a2a2a" },
});
