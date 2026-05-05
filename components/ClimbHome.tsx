import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { Climb } from "@/types/climb";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
        data: grouped[date].sort((a, b) => b.id - a.id),
      }));
  }, [climbs]);

  if (climbs.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 48 }}>🧗</Text>
        <Text style={{ color: "#888", fontSize: 16 }}>
          {i18n.t("home.empty")}
        </Text>
        <TouchableOpacity
          onPress={() => router.push("/add")}
          style={styles.addButton}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            {i18n.t("home.addFirst")}
          </Text>
        </TouchableOpacity>
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
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionTitle}>
            {new Date(title).toLocaleDateString(i18n.locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", paddingTop: 16 },
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
    paddingVertical: 12,
    marginTop: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: "rgba(232,93,4,0.3)",
  },
  sectionTitle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 0,
    color: "#e85d04",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
