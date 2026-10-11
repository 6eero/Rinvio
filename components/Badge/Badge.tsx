import { Colors, Radius } from "@/constants/theme";
import { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

type BadgeProps = {
  text: string;
  fontSize?: number;
  icon?: LucideIcon;
  badgeColor?: string;
  textColor?: string;
};

const Badge = ({
  text,
  fontSize = 10,
  icon: Icon,
  badgeColor = Colors.surfaceRaised,
  textColor = Colors.textSecondary,
}: BadgeProps) => {
  return (
    <View
      style={{
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: Radius.sm,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: badgeColor,
        flexDirection: "row",
        gap: 4,
      }}
    >
      {Icon && <Icon size={fontSize + 2} color={textColor} />}
      <Text
        style={{
          color: textColor,
          fontSize,
          fontWeight: "700",
          letterSpacing: 0.5,
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default Badge;
