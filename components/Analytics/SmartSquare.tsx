import { View } from "react-native";

export const SmartSquare = ({
  opacity,
  color,
}: {
  opacity: number;
  color: string;
}) => (
  <View
    style={{
      backgroundColor: color,
      opacity,
      width: 12,
      height: 12,
      borderRadius: 3,
      margin: 1,
    }}
  />
);
