import { Colors, Radius } from "@/constants/theme";
import {
    Locale,
    SUPPORTED_LOCALES,
    useLocaleStore,
} from "@/store/useLocaleStore";
import * as Haptics from "expo-haptics";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export function LanguageSwitcher() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);

  const onPick = (next: Locale) => {
    if (next === locale) return;
    Haptics.selectionAsync();
    setLocale(next);
  };

  return (
    <View style={styles.container}>
      {SUPPORTED_LOCALES.map((code) => {
        const active = code === locale;
        return (
          <TouchableOpacity
            key={code}
            onPress={() => onPick(code)}
            style={[styles.segment, active && styles.segmentActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>
              {code.toUpperCase()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: Radius.md,
    padding: 2,
  },
  segment: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: Radius.md - 2,
  },
  segmentActive: { backgroundColor: Colors.surfaceAction },
  label: { color: Colors.textMuted, fontSize: 13, fontWeight: "600" },
  labelActive: { color: Colors.text },
});
