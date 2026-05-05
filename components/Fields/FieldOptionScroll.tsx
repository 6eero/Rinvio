import OptionButton from "@/components/Buttons/OptionButton";
import SectionLabel from "@/components/SectionLabel";
import i18n from "@/i18n";
import { ScrollView, View } from "react-native";

interface Option<T> {
  label: string;
  value: T;
  isKey?: boolean;
  color?: string;
}

const FieldOptionScroll = <T extends string>({
  label,
  options,
  value,
  onChange,
  useScroll = false,
  disabled = false,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  useScroll?: boolean;
  disabled?: boolean;
}) => {
  const content = options.map((opt) => (
    <OptionButton
      key={opt.value}
      label={opt.isKey ? i18n.t(opt.label) : opt.label}
      selected={value === opt.value}
      onPress={() => !disabled && onChange(opt.value)}
      color={opt.color}
      disabled={disabled}
    />
  ));

  return (
    <View style={{ marginVertical: 12 }}>
      <SectionLabel text={i18n.t(label)} />
      {useScroll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {content}
        </View>
      )}
    </View>
  );
};

export default FieldOptionScroll;
