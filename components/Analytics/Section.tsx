import { Text, View } from "react-native";

const AnalyticSection = ({
  title,
  children,
}: {
  title: string;
  children: any;
}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <Text
          style={{
            color: "#ffffff",
            fontSize: 16,
            fontWeight: "700",
            letterSpacing: 0.3,
          }}
        >
          {title}
        </Text>
      </View>
      <View style={{ marginBottom: 28 }}>{children}</View>
    </View>
  );
};

export default AnalyticSection;
