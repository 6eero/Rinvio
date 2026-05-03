import { exportDatabase, importDatabase } from "@/db/backupRestore";
import { getDatabase } from "@/db/database";
import i18n from "@/i18n";
import { Climb } from "@/types/climb";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import packageJson from "../package.json";

const SettingSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

export default function ClimbSettings() {
  const [rows, setRows] = useState<Climb[]>([]);
  const [count, setCount] = useState(0);

  const COLUMNS: { key: keyof Climb; label: string; width: number }[] = [
    { key: "id", label: "ID", width: 40 },
    { key: "date", label: "Data", width: 90 },
    { key: "crag", label: "Falesia", width: 110 },
    { key: "routeName", label: "Via", width: 110 },
    { key: "grade", label: "Grado", width: 50 },
    { key: "outcome", label: "Esito", width: 70 },
    { key: "attempts", label: "Tent.", width: 45 },
    { key: "mode", label: "Modo", width: 70 },
  ];

  async function load() {
    const db = await getDatabase();
    const data = await db.getAllAsync<Climb>(
      "SELECT * FROM climbs ORDER BY id DESC LIMIT 50",
    );
    setRows(data);
    setCount(data.length);
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, []),
  );

  async function clearAll() {
    Alert.alert(
      i18n.t("settings.clearTitle"),
      i18n.t("settings.clearMessage"),
      [
        { text: i18n.t("settings.cancel"), style: "cancel" },
        {
          text: i18n.t("settings.clearConfirm"),
          style: "destructive",
          onPress: async () => {
            const db = await getDatabase();
            await db.runAsync("DELETE FROM climbs");
            load();
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- SEZIONE 1: DATABASE & BACKUP --- */}
        <SettingSection title={i18n.t("settings.databaseSettings", { count })}>
          <View style={styles.tableWrapper}>
            {rows.length === 0 ? (
              <Text style={styles.emptyText}>
                {i18n.t("settings.noRecords")}
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View>
                  {/* HEADER (Resta fisso in alto rispetto allo scroll verticale) */}
                  <View style={styles.tableHeader}>
                    {COLUMNS.map((col) => (
                      <Text
                        key={col.key}
                        style={[styles.headerCell, { width: col.width }]}
                      >
                        {col.label}
                      </Text>
                    ))}
                  </View>

                  {/* BODY SCROLLABILE (Altezza limitata) */}
                  <View style={{ height: 200 }}>
                    <ScrollView
                      nestedScrollEnabled={true} // Fondamentale per Android
                      style={styles.tableBody}
                    >
                      {rows.map((row, i) => (
                        <View
                          key={row.id}
                          style={[styles.row, i === 0 && { borderTopWidth: 0 }]}
                        >
                          {COLUMNS.map((col) => (
                            <Text
                              key={col.key}
                              style={[styles.cell, { width: col.width }]}
                              numberOfLines={1}
                            >
                              {row[col.key]?.toString() ?? "—"}
                            </Text>
                          ))}
                        </View>
                      ))}
                    </ScrollView>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>

          {/* Pulsanti Azione */}
          <View style={styles.grid}>
            {[
              {
                label: i18n.t("settings.export"),
                onPress: exportDatabase,
                color: "#2c2c2c",
              },
              {
                label: i18n.t("settings.import"),
                onPress: () => importDatabase().then(load),
                color: "#2c2c2c",
              },
              {
                label: i18n.t("settings.refresh"),
                onPress: load,
                color: "#2c2c2c",
              },
              {
                label: i18n.t("settings.clear"),
                onPress: clearAll,
                color: "#441a1a",
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={item.onPress}
                style={[styles.button, { backgroundColor: item.color }]}
              >
                <Text style={styles.buttonText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </SettingSection>

        {/* --- SEZIONE 2: PREFERENZE --- */}
        <SettingSection title={i18n.t("settings.preferences")}>
          <View style={styles.listRow}>
            <Text style={styles.listLabel}>{i18n.t("settings.language")}</Text>
            <Text style={styles.listValue}>{i18n.locale.toUpperCase()}</Text>
          </View>

          <View style={styles.listRow}>
            <Text style={styles.listLabel}>{i18n.t("settings.theme")}</Text>
            <Text style={styles.listValue}>Dark</Text>
          </View>
        </SettingSection>

        {/* --- SEZIONE 3: INFO APP --- */}
        <SettingSection title={i18n.t("settings.about")}>
          <View
            style={[
              styles.listRow,
              { borderBottomWidth: 1, borderBottomColor: "#222" },
            ]}
          >
            <Text style={styles.listLabel}>{i18n.t("settings.version")}</Text>
            <Text style={styles.listValue}>{packageJson.version}</Text>
          </View>
          <View style={styles.listRow}>
            <Text style={styles.listLabel}>
              {i18n.t("settings.developed_by")}
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL("https://github.com/6eero")}
            >
              <Text
                style={[
                  styles.listValue,
                  { color: "#e85d04", textDecorationLine: "underline" },
                ]}
              >
                6eero
              </Text>
            </TouchableOpacity>
          </View>
        </SettingSection>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d", paddingTop: 16 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  mainTitle: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },

  // Sezioni
  sectionContainer: { marginBottom: 32 },
  sectionTitle: {
    color: "#e85d04",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 12,
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: "#161616",
    borderRadius: 12,
    overflow: "hidden",
    padding: 8,
  },

  // Tabella
  tableWrapper: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: "#0d0d0d",
    padding: 4,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingVertical: 8,
  },
  headerCell: {
    color: "#888",
    fontSize: 10,
    fontWeight: "bold",
    paddingHorizontal: 4,
  },
  tableBody: { maxHeight: 250 },

  row: {
    flexDirection: "row",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  cell: { color: "#eee", fontSize: 11, paddingHorizontal: 4 },
  emptyText: { color: "#555", padding: 20, textAlign: "center" },

  // Grid bottoni
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    width: "48.5%",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  // Liste semplici
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  listLabel: { color: "#ccc", fontSize: 14 },
  listValue: { color: "#888", fontSize: 14 },

  footerNote: {
    color: "#444",
    textAlign: "center",
    marginTop: 20,
    fontSize: 12,
  },
});
