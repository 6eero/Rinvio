import ClimbHome from "@/components/ClimbHome";
import PageTitle from "@/components/Layout/PageTitle";
import i18n from "@/i18n";
import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#151718",
        paddingTop: insets.top,
        paddingBottom: 60,
      }}
    >
      <PageTitle title={i18n.t("home.title")} />
      <ClimbHome />
    </View>
  );
}
