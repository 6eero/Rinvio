import { exportDatabaseAsCSV, importDatabaseAsCSV } from "@/db/backupRestore";
import { Colors, Radius } from "@/constants/theme";
import i18n from "@/i18n";
import { ReactNode } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import packageJson from "../package.json";

const SettingSection = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>{title.toUpperCase()}</Text>
    <View style={styles.sectionContent}>{children}</View>
  </View>
);

export default function ClimbSettings() {
  return (
    <>
      {/* Preferences */}
      <SettingSection title={i18n.t("settings.preferences")}>
        <View style={styles.listRow}>
          <Text style={styles.listLabel}>{i18n.t("settings.language")}</Text>
          <Text style={styles.listValue}>{i18n.locale.toUpperCase()}</Text>
        </View>

        <View style={styles.listRow}>
          <Text style={styles.listLabel}>{i18n.t("settings.theme")}</Text>
          <Text style={styles.listValue}>{i18n.t("settings.themeDark")}</Text>
        </View>
      </SettingSection>

      {/* Database */}
      <SettingSection title={i18n.t("settings.databaseSettings")}>
        <View style={styles.grid}>
          <TouchableOpacity onPress={exportDatabaseAsCSV} style={styles.button}>
            <Text style={styles.buttonText}>
              {i18n.t("settings.exportAsCSV")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={importDatabaseAsCSV} style={styles.button}>
            <Text style={styles.buttonText}>
              {i18n.t("settings.importAsCSV")}
            </Text>
          </TouchableOpacity>
        </View>
      </SettingSection>

      {/* About */}
      <SettingSection title={i18n.t("settings.about")}>
        <View
          style={[
            styles.listRow,
            { borderBottomWidth: 1, borderBottomColor: Colors.border },
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
                { color: Colors.text, textDecorationLine: "underline" },
              ]}
            >
              6eero
            </Text>
          </TouchableOpacity>
        </View>
      </SettingSection>
    </>
  );
}

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 32 },
  sectionTitle: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    padding: 8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
  },
  button: {
    width: "48.5%",
    paddingVertical: 14,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surfaceAction,
  },
  buttonText: { color: Colors.text, fontSize: 13, fontWeight: "600" },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 8,
  },
  listLabel: { color: Colors.textSecondary, fontSize: 14 },
  listValue: { color: Colors.textMuted, fontSize: 14 },
});
