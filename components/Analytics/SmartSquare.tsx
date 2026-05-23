import React from "react";
import { View } from "react-native";

interface SmartSquareProps {
  opacity: number;
  color?: string;
}

export const SmartSquare: React.FC<SmartSquareProps> = ({
  opacity,
  color = "#ffffff",
}) => {
  return (
    <View
      style={{
        backgroundColor: color,
        opacity: opacity,
        width: 12,
        height: 12,
        borderRadius: 3,
        margin: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    />
  );
};
