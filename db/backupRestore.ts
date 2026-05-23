import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";
import { getDatabase, resetDatabase } from "./database";

const DB_NAME = "climbing.db";

function getDbPath(): string {
  return `${FileSystem.documentDirectory}SQLite/${DB_NAME}`;
}

function getExportPath(): string {
  const date = new Date().toISOString().split("T")[0];
  return `${FileSystem.cacheDirectory}rinvio_backup_${date}.db`;
}

export async function exportDatabase(): Promise<void> {
  try {
    const dbPath = getDbPath();
    const exportPath = getExportPath();

    // Verifica che il DB esista
    const info = await FileSystem.getInfoAsync(dbPath);
    if (!info.exists) {
      Alert.alert("Errore", "Database non trovato");
      return;
    }

    // Copia il DB nella cache
    await FileSystem.copyAsync({ from: dbPath, to: exportPath });

    // Condividi il file
    const canShare = await Sharing.isAvailableAsync();
    if (!canShare) {
      Alert.alert(
        "Errore",
        "La condivisione non è disponibile su questo dispositivo",
      );
      return;
    }

    await Sharing.shareAsync(exportPath, {
      mimeType: "application/octet-stream",
      dialogTitle: "Esporta backup Rinvio",
      UTI: "public.database",
    });
  } catch (e) {
    console.error(e);
    Alert.alert("Errore", "Impossibile esportare il database");
  }
}

export async function importDatabase(): Promise<void> {
  try {
    // Scegli il file
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (result.canceled) return;

    const file = result.assets[0];

    // Conferma
    await new Promise<void>((resolve, reject) => {
      Alert.alert(
        "Importa backup",
        "Attenzione: tutti i dati attuali verranno sostituiti con quelli del backup. Continuare?",
        [
          {
            text: "Annulla",
            style: "cancel",
            onPress: () => reject(new Error("cancelled")),
          },
          { text: "Importa", style: "destructive", onPress: () => resolve() },
        ],
      );
    });

    const dbPath = getDbPath();

    // Assicurati che la cartella SQLite esista
    const sqliteDir = `${FileSystem.documentDirectory}SQLite`;
    const dirInfo = await FileSystem.getInfoAsync(sqliteDir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(sqliteDir, { intermediates: true });
    }

    // Chiudi il DB prima di sovrascriverlo
    const db = await getDatabase();
    await db.closeAsync();
    resetDatabase();

    // Sovrascrivi il DB con il backup
    await FileSystem.copyAsync({ from: file.uri, to: dbPath });

    Alert.alert(
      "Importazione completata",
      "Il backup è stato ripristinato. Riavvia l'app per applicare le modifiche.",
    );
  } catch (e: any) {
    if (e?.message === "cancelled") return;
    console.error(e);
    Alert.alert("Errore", "Impossibile importare il database");
  }
}

export async function clearDatabase(): Promise<void> {
  const confirmed = await new Promise<boolean>((resolve) => {
    Alert.alert(
      "Elimina database",
      "Tutti i dati verranno eliminati definitivamente. Continuare?",
      [
        { text: "Annulla", style: "cancel", onPress: () => resolve(false) },
        { text: "Elimina", style: "destructive", onPress: () => resolve(true) },
      ],
    );
  });

  if (!confirmed) return;

  const db = await getDatabase();
  await db.closeAsync();
  resetDatabase();
  await FileSystem.deleteAsync(getDbPath(), { idempotent: true });

  Alert.alert(
    "Database eliminato",
    "Riavvia l'app per applicare le modifiche.",
  );
}
