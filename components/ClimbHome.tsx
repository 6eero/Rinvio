import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { Climb } from "@/types/climb";
import { MapPin, Mountain } from "lucide-react-native";
import React, { useMemo } from "react";
import { SectionList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Badge from "./Badge/Badge";
import ClimbCard from "./ClimbCard";

export default function ClimbHome() {
  const climbs = useClimbsStore((s) => s.climbs);

  const sections = useMemo(() => {
    const grouped = climbs.reduce(
      (acc, climb) => {
        const date = climb.date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(climb);
        return acc;
      },
      {} as Record<string, Climb[]>,
    );

    return Object.keys(grouped)
      .sort((a, b) => b.localeCompare(a))
      .map((date) => ({
        title: date,
        crag: grouped[date][0]?.crag ?? "—",
        data: grouped[date].sort((a, b) => b.id - a.id),
      }));
  }, [climbs]);

  if (climbs.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 40,
          backgroundColor: "#0d0d0d",
        }}
      >
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 36,
            backgroundColor: "rgba(226, 226, 226, 0.03)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}
        >
          <Mountain size={36} color="#ffffff" strokeWidth={1.5} />
        </View>

        {/* Sottotitolo descrittivo più morbido */}
        <Text
          style={{
            color: "#6b6a65",
            fontSize: 14,
            fontWeight: "400",
            textAlign: "center",
            lineHeight: 20,
          }}
        >
          {i18n.t("home.empty")}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        stickySectionHeadersEnabled={true}
        renderItem={({ item }) => <ClimbCard climb={item} />}
        renderSectionHeader={({ section: { title, crag } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {new Date(title).toLocaleDateString(i18n.locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <Badge
              fontSize={10}
              text={crag}
              icon={<MapPin />}
              badgeColor="#161616"
            />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12 },
  addButton: {
    backgroundColor: "#e85d04",
    borderRadius: 10,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 8,
  },
  sectionHeader: {
    backgroundColor: "#0d0d0d",
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
