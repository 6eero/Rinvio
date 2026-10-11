import ClimbSettings from "@/components/ClimbSettings";
import Screen from "@/components/Layout/Screen";
import i18n from "@/i18n";

export default function SettingsScreen() {
  return (
    <Screen title={i18n.t("settings.title")}>
      <ClimbSettings />
    </Screen>
  );
}
