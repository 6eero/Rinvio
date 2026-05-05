import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { Climb } from "@/types/climb";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
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
        crag: grouped[date][0]?.crag ?? "—",
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
        renderSectionHeader={({ section: { title, crag } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {new Date(title).toLocaleDateString(i18n.locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
            <View style={styles.cragBadge}>
              <MapPin size={10} color="#888780" />
              <Text style={styles.cragText} numberOfLines={1}>
                {crag}
              </Text>
            </View>
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
  cragBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.05)",
    maxWidth: "50%",
    gap: 4,
  },
  cragText: {
    color: "#B4B2A9",
    fontSize: 10,
    fontWeight: "600",
  },
});
