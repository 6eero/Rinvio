import { useColorScheme } from "@/hooks/use-color-scheme";
import { useClimbsStore } from "@/store/useClimbsStore";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  // const isLoading = useAppStore((s) => s.isLoading);
  const refresh = useClimbsStore((s) => s.refresh);

  useEffect(() => {
    refresh();
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="modal"
            options={{ presentation: "modal", title: "Modal" }}
          />
          <Stack.Screen name="edit/[id]" options={{ headerShown: false }} />
        </Stack>

        {/* {isLoading && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: "rgba(13,13,13,0.75)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <ActivityIndicator size="large" color="#e85d04" />
          </View>
        )} */}

        <StatusBar style="auto" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
