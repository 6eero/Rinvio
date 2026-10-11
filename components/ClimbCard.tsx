import { Colors, Radius } from "@/constants/theme";
import {
  AscentOutcome,
  Climb,
  DIFFICULTY_MAX,
  ascentOutcome,
  isFirstTryMode,
} from "@/domain/climb";
import i18n from "@/i18n";
import { router } from "expo-router";
import { NotebookPen, Zap } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Badge from "./Badge/Badge";
import DifficultyGauge from "./Indicators/DifficultyGauge";

const OUTCOME_COLORS: Record<AscentOutcome, { bg: string; text: string }> = {
  clean: { bg: Colors.successBg, text: Colors.successText },
  hangdog: { bg: Colors.warningBg, text: Colors.warningText },
  failure: { bg: Colors.failureBg, text: Colors.failureText },
};

export default function ClimbCard({ climb }: { climb: Climb }) {
  const colors = OUTCOME_COLORS[ascentOutcome(climb.mode)];

  return (
    <TouchableOpacity
      onPress={() => router.push(`/edit/${climb.id}`)}
      activeOpacity={0.8}
      style={{ flexDirection: "row", alignItems: "center", padding: 12 }}
    >
      {/* Grade */}
      <View
        style={{
          backgroundColor: Colors.surfaceRaised,
          padding: 8,
          borderRadius: Radius.md,
          minWidth: 50,
          alignItems: "center",
          marginRight: 16,
        }}
      >
        <Text
          style={{
            color: Colors.text,
            fontSize: 16,
            fontWeight: "800",
            fontFamily: "monospace",
          }}
        >
          {climb.grade}
        </Text>
      </View>

      {/* Route and how it went; lead is the norm, so only follow is labelled */}
      <View style={{ flex: 1, gap: 6 }}>
        <Text
          style={{ color: Colors.text, fontSize: 16, fontWeight: "600" }}
          numberOfLines={1}
        >
          {climb.route}
        </Text>
        {/* attempts and notes only when they say something */}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Badge
            text={i18n.t(`options.mode.${climb.mode}`).toUpperCase()}
            icon={isFirstTryMode(climb.mode) ? Zap : undefined}
            badgeColor={colors.bg}
            textColor={colors.text}
          />
          {climb.style === "follow" && (
            <Badge text={i18n.t("options.style.follow").toUpperCase()} />
          )}
          {climb.attempts > 1 && (
            <Text style={{ color: Colors.textMuted, fontSize: 12 }}>
              {i18n.t("home.attempts", { count: climb.attempts })}
            </Text>
          )}
          {climb.notes !== "" && (
            <NotebookPen size={13} color={Colors.textMuted} />
          )}
        </View>
      </View>

      {/* Perceived difficulty */}
      <View
        style={{ marginLeft: 12 }}
        accessible
        accessibilityLabel={`${i18n.t("form.difficulty")} ${climb.difficulty}/${DIFFICULTY_MAX}`}
      >
        <DifficultyGauge value={climb.difficulty} />
      </View>
    </TouchableOpacity>
  );
}
