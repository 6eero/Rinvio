import { Colors, Radius } from "@/constants/theme";
import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";

/** Rounded surface used for KPIs, charts and list groups. */
export default function Card({
  style,
  children,
}: {
  style?: StyleProp<ViewStyle>;
  children: ReactNode;
}) {
  return (
    <View
      style={[
        {
          backgroundColor: Colors.surface,
          borderColor: Colors.borderSubtle,
          borderWidth: 0.5,
          borderRadius: Radius.lg,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
