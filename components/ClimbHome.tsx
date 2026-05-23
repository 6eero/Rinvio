import { useClimbsStore } from "@/store/useClimbsStore";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ClimbAccordian from "./ClimbAccordian";

export default function ClimbHome() {
  const climbs = useClimbsStore((s) => s.climbs);
  const groupedClimbsByDate = Object.values(
    climbs.reduce(
      (acc, climb) => {
        (acc[climb.date] ??= []).push(climb);
        return acc;
      },
      {} as Record<string, typeof climbs>,
    ),
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["left", "right", "bottom"]}>
      <ScrollView
        contentContainerStyle={{
          padding: 12,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: "#0d0d0d" }}
      >
        {groupedClimbsByDate.map((group) => (
          <ClimbAccordian
            key={group[0].date}
            date={group[0].date}
            crag={group[0].crag}
            climbs={group}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
