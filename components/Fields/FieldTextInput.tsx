import i18n from "@/i18n";
import { TextInput, View } from "react-native";
import SectionLabel from "../SectionLabel";

const FieldTextInput = ({
  label,
  placeholder,
  value,
  setValue,
  editable = true,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
  editable?: boolean;
}) => {
  return (
    <View>
      <SectionLabel text={i18n.t(label)} />
      <TextInput
        style={{
          backgroundColor: editable ? "#161616" : "#1f1f1f",
          color: editable ? "#fff" : "#888",
          borderRadius: 12,
          padding: 10,
          fontSize: 16,
          borderWidth: 1,
          borderColor: "#202020",
          marginBottom: 12,
        }}
        value={value}
        onChangeText={setValue}
        placeholder={i18n.t(placeholder)}
        placeholderTextColor="#555"
        editable={editable}
      />
    </View>
  );
};

export default FieldTextInput;
