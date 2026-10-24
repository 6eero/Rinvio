import { Colors } from "@/constants/theme";
import i18n from "@/i18n";
import { consumeBackupNotice } from "@/modules/backup-status";
import { useClimbsStore } from "@/store/useClimbsStore";
import { useLocaleStore } from "@/store/useLocaleStore";
import { formatDateTime } from "@/utilities/date";
import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ToastAndroid } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const refresh = useClimbsStore((s) => s.refresh);
  const locale = useLocaleStore((s) => s.locale);

  // Initial load; afterwards the store refreshes itself on every write
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Tell the user about an Auto Backup or restore since the last launch
  useEffect(() => {
    const notice = consumeBackupNotice();
    if (!notice) return;
    ToastAndroid.show(
      i18n.t(`settings.backupNotice.${notice.type}`, {
        time: formatDateTime(notice.time, i18n.locale),
      }),
      ToastAndroid.LONG,
    );
  }, []);

  return (
    <SafeAreaProvider>
      {/* Expo SDK 57 is edge-to-edge: keep both system bars transparent so the
          app background shows through instead of the white window behind */}
      <KeyboardProvider
        statusBarTranslucent
        navigationBarTranslucent
        preserveEdgeToEdge
      >
        {/* the UI is dark-only */}
        <ThemeProvider value={DarkTheme}>
          <Stack
            key={locale}
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: Colors.background },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="edit/[id]" />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
