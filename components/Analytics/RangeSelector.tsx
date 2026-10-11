import { Colors, Radius } from "@/constants/theme";
import { TIME_RANGES, TimeRange } from "@/domain/analytics";
import i18n from "@/i18n";
import { Text, TouchableOpacity, View } from "react-native";

/** Segmented control for the period the analytics look at. */
export default function RangeSelector({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: Colors.surface,
        borderColor: Colors.borderSubtle,
        borderWidth: 0.5,
        borderRadius: Radius.lg,
        padding: 3,
        marginBottom: 24,
      }}
    >
      {TIME_RANGES.map((range) => {
        const selected = range === value;
        return (
          <TouchableOpacity
            key={range}
            onPress={() => onChange(range)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            style={{
              flex: 1,
              paddingVertical: 8,
              borderRadius: Radius.md + 1,
              alignItems: "center",
              backgroundColor: selected ? Colors.surfaceSelected : undefined,
            }}
          >
            <Text
              style={{
                color: selected ? Colors.text : Colors.textMuted,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              {i18n.t(`analytics.range.${range}`)}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
