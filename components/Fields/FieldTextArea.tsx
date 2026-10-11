import { Colors } from "@/constants/theme";
import { TextInput, View } from "react-native";
import SectionLabel from "../SectionLabel";
import { inputBoxStyle, inputTextStyle } from "./inputStyle";

const FieldTextArea = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (text: string) => void;
}) => {
  return (
    <View style={{ marginVertical: 12 }}>
      <SectionLabel text={label} />
      <TextInput
        style={[
          inputBoxStyle(),
          inputTextStyle(),
          { minHeight: 100, textAlignVertical: "top" },
        ]}
        value={value}
        onChangeText={onChange}
        multiline
        placeholder={placeholder}
        placeholderTextColor={Colors.textFaint}
      />
    </View>
  );
};

export default FieldTextArea;
