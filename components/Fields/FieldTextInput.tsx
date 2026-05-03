import i18n from "@/i18n";
import { TextInput, View } from "react-native";
import SectionLabel from "../SectionLabel";

const FieldTextInput = ({
  label,
  placeholder,
  value,
  setValue,
}: {
  label: string;
  placeholder: string;
  value: string;
  setValue: (text: string) => void;
}) => {
  return (
    <View>
      <SectionLabel text={i18n.t(label)} />
      <TextInput
        style={{
          backgroundColor: "#161616",
          borderRadius: 12,
          padding: 10,
          color: "#fff",
          fontSize: 16,
          borderWidth: 1,
          borderColor: "#202020",
          marginBottom: 12,
        }}
        value={value}
        onChangeText={setValue}
        placeholder={i18n.t(placeholder)}
        placeholderTextColor="#555"
      />
    </View>
  );
};

export default FieldTextInput;
