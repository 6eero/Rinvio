package expo.modules.backupstatus

import android.content.Context

/**
 * Timestamps of the Auto Backup events, kept in SharedPreferences. These live
 * outside `files/SQLite`, so they are not part of the backup themselves: after
 * a restore the new install starts with no "last backup" until the next one.
 */
internal class BackupStatusStore(context: Context) {
  private val prefs = context.getSharedPreferences("backup_status", Context.MODE_PRIVATE)

  val lastBackup: Long? get() = read(LAST_BACKUP)

  // commit(), not apply(): the agent's process may be killed right after the
  // callback returns
  fun recordBackup(time: Long) = prefs.edit().putLong(LAST_BACKUP, time).commit()

  fun recordRestore(time: Long) = prefs.edit().putLong(LAST_RESTORE, time).commit()

  /**
   * The event the user hasn't been told about yet, marking it as notified. A
   * restore wins over a backup: it's the one that changed the data.
   */
  fun consumeNotice(): Pair<String, Long>? {
    val restore = read(LAST_RESTORE)
    if (restore != null && restore > (read(NOTIFIED_RESTORE) ?: 0)) {
      prefs.edit()
        .putLong(NOTIFIED_RESTORE, restore)
        .putLong(NOTIFIED_BACKUP, lastBackup ?: 0)
        .commit()
      return "restore" to restore
    }

    val backup = lastBackup
    if (backup != null && backup > (read(NOTIFIED_BACKUP) ?: 0)) {
      prefs.edit().putLong(NOTIFIED_BACKUP, backup).commit()
      return "backup" to backup
    }

    return null
  }

  private fun read(key: String): Long? =
    if (prefs.contains(key)) prefs.getLong(key, 0) else null

  private companion object {
    const val LAST_BACKUP = "lastBackup"
    const val LAST_RESTORE = "lastRestore"
    const val NOTIFIED_BACKUP = "notifiedBackup"
    const val NOTIFIED_RESTORE = "notifiedRestore"
  }
}
