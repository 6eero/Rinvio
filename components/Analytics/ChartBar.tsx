import { Text, View } from "react-native";

const BAR_MAX_HEIGHT = 120;

const ChartBar = ({
  label,
  value,
  maxValue,
}: {
  label: string;
  value: number;
  maxValue: number;
}) => {
  const barHeight = (value / maxValue) * BAR_MAX_HEIGHT;

  return (
    <View style={{ alignItems: "center", gap: 8, flex: 1 }}>
      <Text style={{ color: "#a8a8a8", fontSize: 8 }}>{value}</Text>
      <View
        style={{
          backgroundColor: "#b3b3b3",
          height: barHeight,
          width: "100%",
          borderRadius: 6,
        }}
      />
      <Text style={{ color: "#fff", fontSize: 12 }}>{label}</Text>
    </View>
  );
};

export default ChartBar;
