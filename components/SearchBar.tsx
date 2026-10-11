import { Colors } from "@/constants/theme";
import { Search, X } from "lucide-react-native";
import { TextInput, TouchableOpacity, View } from "react-native";
import { inputBoxStyle, inputTextStyle } from "./Fields/inputStyle";

export default function SearchBar({
  value,
  onChange,
  placeholder,
  autoFocus,
}: {
  value: string;
  onChange: (text: string) => void;
  placeholder: string;
  autoFocus?: boolean;
}) {
  return (
    <View
      style={[
        inputBoxStyle(),
        { flexDirection: "row", alignItems: "center", gap: 8 },
      ]}
    >
      <Search size={18} color={Colors.textMuted} />
      <TextInput
        style={[inputTextStyle(), { flex: 1, padding: 0 }]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textFaint}
        autoCorrect={false}
        returnKeyType="search"
        autoFocus={autoFocus}
      />
      {value !== "" && (
        <TouchableOpacity onPress={() => onChange("")} hitSlop={12}>
          <X size={18} color={Colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );
}
