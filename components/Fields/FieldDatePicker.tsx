import i18n from "@/i18n";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useCallback, useState } from "react";
import {
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import SectionLabel from "../ui/SectionLabel";

const FieldDatePicker = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
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
          backgroundColor: "#161616",
          borderRadius: 12,
          padding: 10,
          borderWidth: 1,
          borderColor: "#202020",
          marginBottom: 12,
        }}
        onPress={() => setShowPicker(true)}
      >
        <Text
          style={{
            color: "#fff",
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
