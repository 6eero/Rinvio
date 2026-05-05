import { Text, View } from "react-native";

interface KPIProps {
  label: string;
  value: string;
  accent?: string;
  singleLine?: boolean;
}

const KPI = ({ label, value, accent, singleLine }: KPIProps) => {
  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderColor: "rgba(255,255,255,0.05)",
        borderWidth: 0.5,
        borderRadius: 12,
        padding: 14,
        width: "48.5%",
        minHeight: 80,
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          color: "#5F5E5A",
          fontSize: 11,
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          marginBottom: 4,
        }}
      >
        {label}
      </Text>
      <Text
        style={[
          {
            color: "#ffffff",
            fontSize: 20,
            fontWeight: "700",
          },
          accent ? { color: accent } : undefined,
        ]}
        numberOfLines={singleLine ? 1 : undefined}
        adjustsFontSizeToFit={singleLine}
      >
        {value}
      </Text>
    </View>
  );
};

export default KPI;
