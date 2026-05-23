import React from "react";
import { Text, View } from "react-native";

type BadgeProps = {
  text: string;
  fontSize?: number;
  icon?: React.ReactNode;
  badgeColor?: string;
  textColor?: string;
  rounded?: boolean;
};

const Badge = ({
  text,
  fontSize = 8,
  icon,
  badgeColor = "#252525",
  textColor = "#c4c4c4",
  rounded = false,
}: BadgeProps) => {
  return (
    <View
      style={{
        paddingHorizontal: rounded ? 0 : 6,
        paddingVertical: rounded ? 0 : 3,
        borderRadius: rounded ? "100%" : 4,
        aspectRatio: rounded ? 1 : undefined,
        height: rounded ? 20 : undefined,
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
