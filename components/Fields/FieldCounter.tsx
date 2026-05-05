import i18n from "@/i18n";
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
      <SectionLabel text={i18n.t(label)} />
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <TouchableOpacity
          style={[styles.btn, disabled && styles.btnDisabled]}
          onPress={() => !disabled && onChange(Math.max(min, value - 1))}
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
          onPress={() => !disabled && onChange(value + 1)}
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
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#202020",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: {
    backgroundColor: "#1f1f1f",
    borderColor: "#1a1a1a",
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
  },
  textDisabled: {
    color: "#555",
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
});

export default FieldCounter;
