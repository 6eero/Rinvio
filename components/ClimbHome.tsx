import i18n from "@/i18n";
import { Climb } from "@/types/climb";
import { router } from "expo-router";

import { getAllClimbs } from "@/db/climbsRepository";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await getAllClimbs();
      setClimbs(data);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, []),
  );
  // Raggruppamento e ordinamento per data (dalla più recente)
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
      .sort((a, b) => b.localeCompare(a)) // Ordine decrescente (YYYY-MM-DD)
      .map((date) => ({
        title: date,
        data: grouped[date].sort((a, b) => b.id - a.id), // Ultime inserite per prime nella giornata
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
        renderItem={({ item }) => (
          <ClimbCard climb={item} onDeleted={loadData} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {new Date(title).toLocaleDateString(i18n.locale, {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Text>
          </View>
        )}
        // Questo assicura che l'ultima card sia visibile sopra la navbar
        contentContainerStyle={{ paddingBottom: 100 }}
        // Rimuovi eventuali marginVertical o simili dallo stile della lista
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
  },
  sectionTitle: {
    color: "#e85d04",
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
