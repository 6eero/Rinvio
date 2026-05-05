import i18n from "@/i18n";
import { Climb } from "@/types/climb";
import { router } from "expo-router";
import { RotateCcw } from "lucide-react-native";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  climb: Climb;
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
    bgDark: "rgba(180,178,169,0.1)",
    label: climb.mode?.slice(0, 2).toUpperCase() ?? "—",
  };

  const isFailure = climb.outcome === "failure";

  return (
    <TouchableOpacity
      onPress={() => router.push(`/edit/${climb.id}`)}
      style={styles.card}
      activeOpacity={0.75}
    >
      <View style={styles.inner}>
        {/* PRIMO BLOCCO (A Sinistra): Grado stilizzato con box dedicato */}
        <View style={styles.gradeCol}>
          <Text style={styles.gradeText}>{climb.grade}</Text>
        </View>

        {/* SECONDO BLOCCO (Al Centro): Due righe richieste */}
        <View style={styles.content}>
          {/* Prima riga: Nome della via */}
          <Text style={styles.routeName} numberOfLines={1}>
            {climb.routeName}
          </Text>

          {/* Seconda riga: Stile + Esito/Tipologia Badge */}
          <View style={styles.metaRow}>
            {/* Badge dello Stile (es. Lead / Top Rope) */}
            <View style={styles.styleBadge}>
              <Text style={styles.styleLabel}>
                {i18n.t(`options.style.${climb.style}`)}
              </Text>
            </View>

            {/* Badge dell'Esito (OS, FL, RP o Fail) */}
            {isFailure ? (
              <View style={styles.failBadge}>
                <Text style={styles.failLabel}>FAIL</Text>
              </View>
            ) : (
              <View
                style={[styles.modeBadge, { backgroundColor: modeInfo.bgDark }]}
              >
                <Text style={[styles.modeLabel, { color: modeInfo.textDark }]}>
                  {modeInfo.label}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* TERZO BLOCCO (A Destra): Tentativi + Difficoltà */}
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

  inner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 0,
    paddingRight: 12,
    gap: 14,
  },

  /* Sinistra */
  gradeCol: {
    backgroundColor: "#1f1f1f",
    borderRightColor: "rgba(255,255,255,0.08)",
    borderRightWidth: 0.5,
    minWidth: 54,
    alignSelf: "stretch",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 14,
  },

  gradeText: {
    color: "#ffffff",
    fontSize: 21,
    fontWeight: "700",
    fontFamily: "monospace",
    letterSpacing: -0.5,
  },

  /* Centro */
  content: {
    flex: 1,
    gap: 5,
    paddingVertical: 12,
  },

  routeName: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  modeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  styleBadge: {
    backgroundColor: "#222222",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  failBadge: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  failLabel: {
    color: "#f87171",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  modeLabel: {
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  styleLabel: {
    color: "#a3a3a3",
    fontSize: 8,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  separator: {
    color: "#5F5E5A",
    paddingHorizontal: 6,
    fontSize: 11,
  },

  modeTag: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },

  failTag: {
    backgroundColor: "rgba(239,68,68,0.15)",
    paddingHorizontal: 6,
    paddingVertical: 2.5,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Destra */
  rightCol: {
    alignItems: "flex-end",
    gap: 6,
    flexShrink: 0,
    paddingVertical: 12,
  },

  attemptsPill: {
    backgroundColor: "#202020",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  attemptsText: {
    color: "#888780",
    fontSize: 11,
    fontWeight: "600",
  },

  dotsRow: {
    flexDirection: "row",
    gap: 3,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  dotFilledDark: {
    backgroundColor: "#B4B2A9",
  },

  dotEmptyDark: {
    backgroundColor: "#2a2a2a",
  },
});
