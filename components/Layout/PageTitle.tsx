import { Colors, Layout } from "@/constants/theme";
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
        alignItems: "center",
        padding: Layout.padding,
      }}
    >
      <Text style={{ color: Colors.text, fontSize: 24, fontWeight: "bold" }}>
        {title}
      </Text>
      {children}
    </View>
  );
};

export default PageTitle;
