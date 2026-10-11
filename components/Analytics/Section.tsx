import { Colors } from "@/constants/theme";
import { ReactNode } from "react";
import { Text, View } from "react-native";

const AnalyticSection = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  /** What the section counts, when the title alone could mislead. */
  subtitle?: string;
  children: ReactNode;
}) => {
  return (
    <View style={{ marginBottom: 28 }}>
      <Text
        style={{
          color: Colors.text,
          fontSize: 16,
          fontWeight: "700",
          letterSpacing: 0.3,
          marginBottom: subtitle ? 2 : 12,
        }}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          style={{ color: Colors.textMuted, fontSize: 12, marginBottom: 12 }}
        >
          {subtitle}
        </Text>
      )}
      {children}
    </View>
  );
};

export default AnalyticSection;
