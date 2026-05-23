import { CSV_COLUMNS } from "@/constants/constants";
import i18n from "@/i18n";
import { ClimbRow } from "@/types/climb";
import { parseCSV, rowsToCSV } from "@/utilities/CSV";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { getDatabase, getDbPath, resetDatabase } from "./database";

export async function exportDatabaseAsCSV(): Promise<void> {
  try {
    const db = await getDatabase();

    const rows = await db.getAllAsync<ClimbRow>(
      `SELECT ${CSV_COLUMNS.join(", ")} FROM climbs ORDER BY date DESC`,
    );

    if (rows.length === 0) {
      Alert.alert(
        i18n.t("settings.alert.export.noDataTitle"),
        i18n.t("settings.alert.export.noDataMsg"),
      );
      return;
    }

    const csvContent = rowsToCSV(rows);
    const date = new Date().toISOString().split("T")[0];
    const exportPath = `${FileSystem.cacheDirectory}rinvio_export_${date}.csv`;

    await FileSystem.writeAsStringAsync(exportPath, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert(
        i18n.t("settings.alert.export.errorSharingTitle"),
        i18n.t("settings.alert.export.errorSharingMsg"),
      );
      return;
    }

    await Sharing.shareAsync(exportPath, {
      mimeType: "text/csv",
      dialogTitle: i18n.t("settings.alert.export.dialogTitle"),
      UTI: "public.comma-separated-values-text",
    });
  } catch (e) {
    console.error("[exportDatabaseAsCSV]", e);
    Alert.alert(
      i18n.t("settings.alert.export.errorTitle"),
      i18n.t("settings.alert.export.errorMsg"),
    );
  }
}

export async function importDatabaseAsCSV(): Promise<void> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["text/csv", "text/comma-separated-values", "text/plain", "*/*"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    await new Promise<void>((resolve, reject) => {
      Alert.alert(
        i18n.t("settings.alert.import.confirmTitle"),
        i18n.t("settings.alert.import.confirmMsg"),
        [
          {
            text: i18n.t("settings.alert.import.btnCancel"),
            style: "cancel",
            onPress: () => reject(new Error("cancelled")),
          },
          {
            text: i18n.t("settings.alert.import.btnImport"),
            style: "destructive",
            onPress: () => resolve(),
          },
        ],
      );
    });

    const rawText = await FileSystem.readAsStringAsync(file.uri, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    const rows = parseCSV(rawText);
    const db = await getDatabase();

    await db.withTransactionAsync(async () => {
      await db.runAsync("DELETE FROM climbs");

      const stmt = await db.prepareAsync(
        `INSERT INTO climbs (${CSV_COLUMNS.join(", ")})
         VALUES (${CSV_COLUMNS.map(() => "?").join(", ")})`,
      );

      try {
        for (const row of rows) {
          await stmt.executeAsync(CSV_COLUMNS.map((col) => (row as any)[col]));
        }
      } finally {
        await stmt.finalizeAsync();
      }
    });

    Alert.alert(
      i18n.t("settings.alert.import.successTitle"),
      i18n.t("settings.alert.import.successMsgSingular", {
        count: rows.length,
      }),
    );
  } catch (e: any) {
    if (e?.message === "cancelled") return;
    console.error("[importDatabaseAsCSV]", e);
    Alert.alert(
      i18n.t("settings.alert.import.errorTitle"),
      e?.message ?? i18n.t("settings.alert.import.errorDefaultMsg"),
    );
  }
}

export async function clearDatabase(): Promise<void> {
  const confirmed = await new Promise<boolean>((resolve) => {
    Alert.alert(
      i18n.t("settings.alert.clear.confirmTitle"),
      i18n.t("settings.alert.clear.confirmMsg"),
      [
        {
          text: i18n.t("settings.alert.clear.btnCancel"),
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: i18n.t("settings.alert.clear.btnDelete"),
          style: "destructive",
          onPress: () => resolve(true),
        },
      ],
    );
  });

  if (!confirmed) return;

  const db = await getDatabase();
  await db.closeAsync();
  resetDatabase();
  await FileSystem.deleteAsync(getDbPath(), { idempotent: true });

  Alert.alert(
    i18n.t("settings.alert.clear.successTitle"),
    i18n.t("settings.alert.clear.successMsg"),
  );
}
