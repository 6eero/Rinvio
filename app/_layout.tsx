import { Colors } from "@/constants/theme";
import { useClimbsStore } from "@/store/useClimbsStore";
import { DarkTheme, Stack, ThemeProvider } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { KeyboardProvider } from "react-native-keyboard-controller";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const refresh = useClimbsStore((s) => s.refresh);

  // Initial load; afterwards the store refreshes itself on every write
  useEffect(() => {
    refresh();
  }, [refresh]);

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
