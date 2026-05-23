import { Climb } from "@/types/climb";
import React from "react";
import { View } from "react-native";
import ChartBar from "./ChartBar";

import { useClimbAnalysis } from "@/hooks/useClimbAnalysis";

export const GradeChart = ({ climbs }: { climbs: Climb[] }) => {
  const { getLeadChartData } = useClimbAnalysis();
  const data = getLeadChartData(climbs);
  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderColor: "rgba(255,255,255,0.075)",
        borderWidth: 0.5,
        borderRadius: 12,
        padding: 14,
        flexDirection: "row",
        gap: 8,
        alignItems: "flex-end",
      }}
    >
      {data.map((item) => (
        <ChartBar
          key={item.label}
          label={item.label}
          value={item.value}
          maxValue={maxValue}
        />
      ))}
    </View>
  );
};
