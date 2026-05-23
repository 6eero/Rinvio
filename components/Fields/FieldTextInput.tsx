import i18n from "@/i18n";
import { TextInput, View } from "react-native";
import SectionLabel from "../SectionLabel";

const FieldTextInput = ({
  label,
  placeholder,
  value,
  setValue,
  disabled = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
  disabled?: boolean;
}) => {
  return (
    <View
      style={{
        marginVertical: 12,
      }}
    >
      <SectionLabel text={i18n.t(label)} />
      <TextInput
        style={{
          backgroundColor: disabled ? "#1f1f1f" : "#161616",
          color: disabled ? "#888" : "#fff",
          borderRadius: 12,
          padding: 10,
          fontSize: 16,
          borderWidth: 1,
          borderColor: "#202020",
        }}
        value={value}
        onChangeText={setValue}
        placeholder={i18n.t(placeholder)}
        placeholderTextColor="#555"
        editable={!disabled}
      />
    </View>
  );
};

export default FieldTextInput;
