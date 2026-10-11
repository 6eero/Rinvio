// Extends app.json. Release builds (EAS "preview" and "production" profiles)
// drop the INTERNET permission: the app works fully offline, so the OS itself
// guarantees that no data can leave the device. Development builds keep it,
// because they load the JS bundle from Metro over the network.
const RELEASE_PROFILES = ["preview", "production"];

module.exports = ({ config }) => {
  if (!RELEASE_PROFILES.includes(process.env.EAS_BUILD_PROFILE)) return config;

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
