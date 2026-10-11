import OptionButton from "@/components/Buttons/OptionButton";
import SectionLabel from "@/components/SectionLabel";
import { ReactNode } from "react";
import { ScrollView, View } from "react-native";

export interface Option<T> {
  label: string;
  value: T;
  color?: string;
  disabled?: boolean;
}

const FieldOptionScroll = <T extends string | number>({
  label,
  options,
  value,
  onChange,
  useScroll = false,
  disabled = false,
  footer,
}: {
  label: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  useScroll?: boolean;
  disabled?: boolean;
  /** Content shown below the options, e.g. an explanation of the selection. */
  footer?: ReactNode;
}) => {
  const content = options.map((opt) => (
    <OptionButton
      key={opt.value}
      label={opt.label}
      selected={value === opt.value}
      onPress={() => onChange(opt.value)}
      color={opt.color}
      disabled={disabled || !!opt.disabled}
    />
  ));

  return (
    <View style={{ marginVertical: 12 }}>
      <SectionLabel text={label} />
      {useScroll ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {content}
        </ScrollView>
      ) : (
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {content}
        </View>
      )}
      {footer}
    </View>
  );
};

export default FieldOptionScroll;
