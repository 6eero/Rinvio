import { requireOptionalNativeModule } from "expo";

export type BackupNotice = { type: "backup" | "restore"; time: number };

interface BackupStatusModule {
  getLastBackupTime(): number | null;
  consumeNotice(): BackupNotice | null;
}

// Android only: elsewhere (iOS, web, Expo Go) there is no Auto Backup to
// report on, and every function below returns null
const BackupStatus =
  requireOptionalNativeModule<BackupStatusModule>("BackupStatus");

export const isBackupStatusAvailable = BackupStatus !== null;

/** When Android Auto Backup last saved the climbs, in epoch ms. */
export const getLastBackupTime = (): number | null =>
  BackupStatus?.getLastBackupTime() ?? null;

/**
 * The backup or restore that happened since the previous call, if any. Each
 * event is returned only once.
 */
export const consumeBackupNotice = (): BackupNotice | null =>
  BackupStatus?.consumeNotice() ?? null;
