// Restricts Android Auto Backup to the climbs database, so that reinstalling
// the app with the same Google account brings the climbs back. The backup is
// performed by the OS, so the app itself still needs no INTERNET permission.
//
// expo-sqlite keeps its databases in `filesDir/SQLite` (the .db file plus its
// -wal/-shm journals): the whole directory is backed up, nothing else is.
//
// The agent (modules/backup-status) keeps the default backup behaviour and
// only records when backups and restores happen, so the app can show them.
const fs = require("fs");
const path = require("path");
const {
  AndroidConfig,
  withAndroidManifest,
  withDangerousMod,
} = require("expo/config-plugins");

const INCLUDE = '<include domain="file" path="SQLite/" />';

// Android 11 and lower
const FULL_BACKUP_CONTENT = `<?xml version="1.0" encoding="utf-8"?>
<full-backup-content>
    ${INCLUDE}
</full-backup-content>
`;

// Android 12+: cloud backup and device-to-device transfer
const DATA_EXTRACTION_RULES = `<?xml version="1.0" encoding="utf-8"?>
<data-extraction-rules>
    <cloud-backup>
        ${INCLUDE}
    </cloud-backup>
    <device-transfer>
        ${INCLUDE}
    </device-transfer>
</data-extraction-rules>
`;

const withBackupRules = (config) => {
  config = withDangerousMod(config, [
    "android",
    (config) => {
      const xmlDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/xml",
      );
      fs.mkdirSync(xmlDir, { recursive: true });
      fs.writeFileSync(
        path.join(xmlDir, "backup_rules.xml"),
        FULL_BACKUP_CONTENT,
      );
      fs.writeFileSync(
        path.join(xmlDir, "data_extraction_rules.xml"),
        DATA_EXTRACTION_RULES,
      );
      return config;
    },
  ]);

  return withAndroidManifest(config, (config) => {
    const app = AndroidConfig.Manifest.getMainApplicationOrThrow(
      config.modResults,
    );
    app.$["android:backupAgent"] =
      "expo.modules.backupstatus.RinvioBackupAgent";
    app.$["android:fullBackupOnly"] = "true";
    app.$["android:fullBackupContent"] = "@xml/backup_rules";
    app.$["android:dataExtractionRules"] = "@xml/data_extraction_rules";
    return config;
  });
};

module.exports = withBackupRules;
