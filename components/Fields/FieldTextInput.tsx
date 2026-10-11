import { Colors } from "@/constants/theme";
import { TextInput, View } from "react-native";
import SectionLabel from "../SectionLabel";
import { inputBoxStyle, inputTextStyle } from "./inputStyle";

const FieldTextInput = ({
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
  disabled?: boolean;
}) => {
  return (
    <View style={{ marginVertical: 12 }}>
      <SectionLabel text={label} />
      <TextInput
        style={[inputBoxStyle(disabled), inputTextStyle(disabled)]}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textFaint}
        editable={!disabled}
      />
    </View>
  );
};

export default FieldTextInput;
