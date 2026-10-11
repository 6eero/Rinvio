import { Colors, Radius } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SectionLabel from "../SectionLabel";

const FieldCounter = ({
  label,
  value,
  onChange,
  min = 1,
  disabled = false,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  disabled?: boolean;
}) => {
  return (
    <View style={{ marginVertical: 12 }}>
      <SectionLabel text={label} />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TouchableOpacity
          style={[styles.btn, disabled && styles.btnDisabled]}
          onPress={() => onChange(Math.max(min, value - 1))}
          disabled={disabled}
        >
          <Text style={[styles.btnText, disabled && styles.textDisabled]}>
            −
          </Text>
        </TouchableOpacity>

        <Text style={[styles.value, disabled && styles.textDisabled]}>
          {value}
        </Text>

        <TouchableOpacity
          style={[styles.btn, disabled && styles.btnDisabled]}
          onPress={() => onChange(value + 1)}
          disabled={disabled}
        >
          <Text style={[styles.btnText, disabled && styles.textDisabled]}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 40,
    height: 40,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md + 2,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    backgroundColor: Colors.surfaceMuted,
    borderColor: Colors.border,
  },
  btnText: {
    color: Colors.text,
    fontSize: 16,
  },
  textDisabled: {
    color: Colors.textFaint,
  },
  value: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
});

export default FieldCounter;
