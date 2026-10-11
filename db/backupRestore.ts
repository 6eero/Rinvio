import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { todayISO } from "@/utilities/date";
import { CSVImportError, climbsToCSV, parseClimbsCSV } from "@/utilities/CSV";
import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Alert, Platform } from "react-native";
import { getAllClimbs } from "./climbsRepository";

export async function exportDatabaseAsCSV(): Promise<void> {
  try {
    const climbs = await getAllClimbs();

    if (climbs.length === 0) {
      Alert.alert(
        i18n.t("settings.alert.export.noDataTitle"),
        i18n.t("settings.alert.export.noDataMsg"),
      );
      return;
    }

    const exportFile = new File(Paths.cache, `rinvio_export_${todayISO()}.csv`);
    exportFile.write(climbsToCSV(climbs));

    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert(
        i18n.t("settings.alert.export.errorSharingTitle"),
        i18n.t("settings.alert.export.errorSharingMsg"),
      );
      return;
    }

    await Sharing.shareAsync(exportFile.uri, {
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
      // On Android read the content:// URI directly: the copy in
      // cache/DocumentPicker isn't readable from Expo Go's scoped storage.
      copyToCacheDirectory: Platform.OS !== "android",
    });
    if (result.canceled) return;

    const confirmed = await confirmImport();
    if (!confirmed) return;

    const text = await new File(result.assets[0].uri).text();
    const climbs = parseClimbsCSV(text);
    await useClimbsStore.getState().replaceAll(climbs);

    Alert.alert(
      i18n.t("settings.alert.import.successTitle"),
      i18n.t("settings.alert.import.successMsg", { count: climbs.length }),
    );
  } catch (e) {
    console.error("[importDatabaseAsCSV]", e);
    Alert.alert(
      i18n.t("settings.alert.import.errorTitle"),
      e instanceof CSVImportError
        ? translateImportError(e)
        : i18n.t("settings.alert.import.errorDefaultMsg"),
    );
  }
}

function translateImportError({ key, params }: CSVImportError): string {
  const { errorKey, ...rest } = params;
  return i18n.t(key, {
    ...rest,
    error: typeof errorKey === "string" ? i18n.t(errorKey) : "",
  });
}

function confirmImport(): Promise<boolean> {
  return new Promise((resolve) => {
    Alert.alert(
      i18n.t("settings.alert.import.confirmTitle"),
      i18n.t("settings.alert.import.confirmMsg"),
      [
        {
          text: i18n.t("settings.alert.import.btnCancel"),
          style: "cancel",
          onPress: () => resolve(false),
        },
        {
          text: i18n.t("settings.alert.import.btnImport"),
          style: "destructive",
          onPress: () => resolve(true),
        },
      ],
      // Android: dismissing the dialog by tapping outside counts as cancel
      { cancelable: true, onDismiss: () => resolve(false) },
    );
  });
}
