import i18n from "@/i18n";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useCallback, useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import SectionLabel from "../SectionLabel";

const FieldDatePicker = ({
  label,
  value,
  onChange,
  editable = true,
}: {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  editable?: boolean;
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = useCallback(
    (_: DateTimePickerEvent, selected?: Date) => {
      if (Platform.OS === "android") setShowPicker(false);
      if (selected) onChange(selected);
    },
    [onChange],
  );

  return (
    <View>
      <SectionLabel text={i18n.t(label)} />
      <TouchableOpacity
        style={{
          backgroundColor: editable ? "#161616" : "#1f1f1f",
          borderRadius: 12,
          padding: 10,
          borderWidth: 1,
          borderColor: "#202020",
          marginBottom: 12,
        }}
        onPress={() => setShowPicker(true)}
        disabled={!editable}
      >
        <Text
          style={{
            color: editable ? "#fff" : "#888",
            fontSize: 16,
          }}
        >
          {value.toLocaleDateString(i18n.locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default FieldDatePicker;
