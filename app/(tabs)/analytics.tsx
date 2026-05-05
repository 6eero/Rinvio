import ClimbAnalytics from "@/components/ClimbAnalytics";
import PageTitle from "@/components/Layout/PageTitle";
import i18n from "@/i18n";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Analytics() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#151718",
        paddingTop: insets.top,
      }}
    >
      <PageTitle title={i18n.t("analytics.title")} />
      <ClimbAnalytics />
    </View>
  );
}
