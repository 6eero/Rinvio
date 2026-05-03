import { Text, View } from "react-native";

const PageTitle: React.FC<{ title: string; children?: React.ReactNode }> = ({
  title,
  children,
}) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
      }}
    >
      <Text style={{ color: "#fff", fontSize: 24, fontWeight: "bold" }}>
        {title}
      </Text>
    </View>
  );
};

export default PageTitle;
