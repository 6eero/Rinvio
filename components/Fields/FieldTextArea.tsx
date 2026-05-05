import i18n from "@/i18n";
import { TextInput, View } from "react-native";
import SectionLabel from "../SectionLabel";

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
    <View
      style={{
        marginVertical: 12,
      }}
    >
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
          minHeight: 100,
          textAlignVertical: "top",
        }}
        value={value}
        onChangeText={onChange}
        multiline
        placeholder={i18n.t(placeholder)}
        placeholderTextColor="#555"
      />
    </View>
  );
};

export default FieldTextArea;
