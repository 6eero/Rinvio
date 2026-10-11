import { Colors, Radius } from "@/constants/theme";
import { Text, TouchableOpacity } from "react-native";

const OptionButton = ({
  label,
  selected,
  onPress,
  color,
  disabled = false,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: Radius.md + 2,
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
          marginRight: 8,
          opacity: disabled ? 0.4 : 1,
        },
        selected && {
          backgroundColor: color ?? Colors.surfaceSelected,
          borderColor: color ?? Colors.borderSelected,
        },
      ]}
    >
      <Text
        style={{
          color: selected ? Colors.text : Colors.textMuted,
          fontWeight: "600",
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default OptionButton;
