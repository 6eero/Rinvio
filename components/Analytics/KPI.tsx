import Card from "@/components/Layout/Card";
import { Colors } from "@/constants/theme";
import { Text, TouchableOpacity } from "react-native";

interface KPIProps {
  label: string;
  value: string;
  /** Small line under the value, e.g. the route a record was set on. */
  caption?: string;
  accent?: string;
  singleLine?: boolean;
  onPress?: () => void;
}

const KPI = ({
  label,
  value,
  caption,
  accent,
  singleLine,
  onPress,
}: KPIProps) => {
  return (
    <TouchableOpacity
      disabled={!onPress}
      onPress={onPress}
      activeOpacity={0.7}
      style={{ width: "48.5%" }}
    >
      <Card style={{ padding: 14, flex: 1, justifyContent: "center" }}>
        <Text
          style={{
            color: Colors.textFaint,
            fontSize: 11,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 4,
          }}
          numberOfLines={1}
        >
          {label}
        </Text>
        <Text
          style={{
            color: accent ?? Colors.text,
            fontSize: 20,
            fontWeight: "700",
          }}
          numberOfLines={singleLine ? 1 : undefined}
          adjustsFontSizeToFit={singleLine}
        >
          {value}
        </Text>
        {caption ? (
          <Text
            style={{ color: Colors.textMuted, fontSize: 12, marginTop: 2 }}
            numberOfLines={1}
          >
            {caption}
          </Text>
        ) : null}
      </Card>
    </TouchableOpacity>
  );
};

export default KPI;
