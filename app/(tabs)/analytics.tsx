import ClimbAnalytics from "@/components/ClimbAnalytics";
import Screen from "@/components/Layout/Screen";
import i18n from "@/i18n";
import React from "react";

export default function Analytics() {
  return (
    <Screen title={i18n.t("analytics.title")}>
      <ClimbAnalytics />
    </Screen>
  );
}
