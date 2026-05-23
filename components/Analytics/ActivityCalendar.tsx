import { Climb } from "@/types/climb";
import React from "react";
import { View } from "react-native";
import { SmartSquare } from "./SmartSquare";

export default function SquareGrid({ climbs }: { climbs: Climb[] }) {
  const year = new Date().getFullYear();
  const start = new Date(year, 0, 1);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: Date[] = [];
  const current = new Date(start);
  while (current <= today) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const climbsCountByDate = climbs.reduce<Record<string, number>>(
    (acc, climb) => {
      const dateStr = climb.date.slice(0, 10);
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    },
    {},
  );

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderColor: "rgba(255,255,255,0.075)",
        borderWidth: 0.5,
        borderRadius: 12,
        padding: 14,
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {days.map((date, index) => {
        const dateStr = date.toISOString().slice(0, 10);
        const count = climbsCountByDate[dateStr] || 0;

        let opacity = 0.2;

        if (count === 0) {
          opacity = 0.05;
        } else if (count <= 5) {
          opacity = 0.25;
        } else {
          opacity = 0.7;
        }

        return <SmartSquare key={index} opacity={opacity} />;
      })}
    </View>
  );
}
