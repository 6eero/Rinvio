package expo.modules.backupstatus

import android.app.backup.BackupAgent
import android.app.backup.BackupDataInput
import android.app.backup.BackupDataOutput
import android.app.backup.FullBackupDataOutput
import android.os.Build
import android.os.ParcelFileDescriptor

/**
 * Auto Backup agent: the backup itself is still the default one (driven by the
 * backup rules in the manifest), this only records when it happens so the app
 * can show it. Registered with `fullBackupOnly`, so only the full-backup
 * callbacks are ever invoked.
 */
class RinvioBackupAgent : BackupAgent() {
  override fun onFullBackup(data: FullBackupDataOutput) {
    super.onFullBackup(data)

    // A device-to-device transfer isn't a backup in the user's Google account
    val isDeviceTransfer = Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
      (data.transportFlags and FLAG_DEVICE_TO_DEVICE_TRANSFER) != 0
    if (!isDeviceTransfer) {
      BackupStatusStore(this).recordBackup(System.currentTimeMillis())
    }
  }

  override fun onRestoreFinished() {
    super.onRestoreFinished()
    BackupStatusStore(this).recordRestore(System.currentTimeMillis())
  }

  // Key/value backup: unused with fullBackupOnly
  override fun onBackup(
    oldState: ParcelFileDescriptor?,
    data: BackupDataOutput?,
    newState: ParcelFileDescriptor?,
  ) = Unit

  override fun onRestore(
    data: BackupDataInput?,
    appVersionCode: Int,
    newState: ParcelFileDescriptor?,
  ) = Unit
}
