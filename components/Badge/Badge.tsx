import React from "react";
import { Text, View } from "react-native";

type BadgeProps = {
  text: string;
  fontSize?: number;
  icon?: React.ReactNode;
  badgeColor?: string;
  textColor?: string;
};

const Badge = ({
  text,
  fontSize = 8,
  icon,
  badgeColor = "#222222",
  textColor = "#a3a3a3",
}: BadgeProps) => {
  return (
    <View
      style={{
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: badgeColor,
        flexDirection: "row",
      }}
    >
      <Text
        style={{
          color: textColor,
          fontSize: fontSize,
          fontWeight: "700",
          letterSpacing: 0.5,
        }}
      >
        {text}
      </Text>
      {icon && React.isValidElement(icon)
        ? React.cloneElement(icon, {
            // @ts-ignore
            size: fontSize + 2,
            color: textColor,
            marginLeft: 4,
          })
        : icon}
    </View>
  );
};

export default Badge;
