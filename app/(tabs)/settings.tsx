import ClimbSettings from "@/components/ClimbSettings";
import PageTitle from "@/components/Layout/PageTitle";
import i18n from "@/i18n";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DebugScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#151718",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <PageTitle title={i18n.t("settings.title")} />
      <ClimbSettings />
    </View>
  );
}
