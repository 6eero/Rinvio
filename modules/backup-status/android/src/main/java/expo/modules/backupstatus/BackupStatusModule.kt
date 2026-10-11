package expo.modules.backupstatus

import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class BackupStatusModule : Module() {
  private val store
    get() = BackupStatusStore(
      appContext.reactContext ?: throw Exceptions.ReactContextLost(),
    )

  override fun definition() = ModuleDefinition {
    Name("BackupStatus")

    Function("getLastBackupTime") { store.lastBackup?.toDouble() }

    Function("consumeNotice") {
      store.consumeNotice()?.let { (type, time) ->
        mapOf("type" to type, "time" to time.toDouble())
      }
    }
  }
}
