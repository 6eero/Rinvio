// Extends app.json. Release builds (EAS "preview" and "production" profiles,
// or any build with RINVIO_RELEASE=1, e.g. F-Droid) drop the INTERNET
// permission: the app works fully offline, so the OS itself guarantees that
// no data can leave the device. Development builds keep it, because they
// load the JS bundle from Metro over the network.
const RELEASE_PROFILES = ["preview", "production"];

const isRelease =
  RELEASE_PROFILES.includes(process.env.EAS_BUILD_PROFILE) ||
  process.env.RINVIO_RELEASE === "1";

module.exports = ({ config }) => {
  if (!isRelease) return config;

  return {
    ...config,
    android: {
      ...config.android,
      blockedPermissions: [
        ...(config.android?.blockedPermissions ?? []),
        "android.permission.INTERNET",
      ],
    },
  };
};