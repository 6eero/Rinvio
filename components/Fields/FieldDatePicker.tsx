import i18n from "@/i18n";
import { formatLongDate, fromISODate, toISODate } from "@/utilities/date";
import DateTimePicker, {
  DateTimePickerChangeEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import SectionLabel from "../SectionLabel";
import { inputBoxStyle, inputTextStyle } from "./inputStyle";

/** Date field; `value` and `onChange` use "yyyy-MM-dd" strings. */
const FieldDatePicker = ({
  label,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (date: string) => void;
  disabled?: boolean;
}) => {
  const [showPicker, setShowPicker] = useState(false);

  // Android shows a dialog that closes on its own after a pick or a cancel
  const closeOnAndroid = () => {
    if (Platform.OS === "android") setShowPicker(false);
  };

  const handleValueChange = (_: DateTimePickerChangeEvent, selected: Date) => {
    closeOnAndroid();
    onChange(toISODate(selected));
  };

  return (
    <View style={{ marginVertical: 12 }}>
      <SectionLabel text={label} />
      <TouchableOpacity
        style={inputBoxStyle(disabled)}
        onPress={() => setShowPicker(true)}
        disabled={disabled}
      >
        <Text style={inputTextStyle(disabled)}>
          {formatLongDate(value, i18n.locale)}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={fromISODate(value)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onValueChange={handleValueChange}
          onDismiss={closeOnAndroid}
          maximumDate={new Date()}
        />
      )}
    </View>
  );
};

export default FieldDatePicker;
