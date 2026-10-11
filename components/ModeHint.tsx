import { Colors, Radius } from "@/constants/theme";
import { outcomeCategory } from "@/domain/analytics";
import { ClimbMode } from "@/domain/climb";
import i18n from "@/i18n";
import { StyleSheet, Text, View } from "react-native";

/**
 * Explains the selected mode, so onsight / flash / redpoint don't get mixed up.
 * The accent uses the mode's outcome color, as in the analytics charts.
 */
export default function ModeHint({
  mode,
  firstTryOnly,
}: {
  mode: ClimbMode;
  /** Shows why onsight and flash are disabled. */
  firstTryOnly: boolean;
}) {
  return (
    <View style={styles.card}>
      <View
        style={[
          styles.accent,
          { backgroundColor: Colors.outcome[outcomeCategory(mode)] },
        ]}
      />
      <View style={styles.body}>
        <Text style={styles.title}>{i18n.t(`options.mode.${mode}`)}</Text>
        <Text style={styles.text}>{i18n.t(`options.modeHint.${mode}`)}</Text>
        {firstTryOnly && (
          <Text style={styles.note}>
            {i18n.t("options.modeHint.firstTryOnly")}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderSubtle,
    borderRadius: Radius.lg,
    overflow: "hidden",
  },
  accent: { width: 3 },
  body: { flex: 1, paddingVertical: 10, paddingHorizontal: 12, gap: 2 },
  title: { color: Colors.text, fontSize: 13, fontWeight: "700" },
  text: { color: Colors.textSecondary, fontSize: 13, lineHeight: 18 },
  note: {
    color: Colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 4,
  },
});
