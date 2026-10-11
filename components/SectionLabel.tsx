import { Colors } from "@/constants/theme";
import { Text } from "react-native";

const SectionLabel = ({ text }: { text: string }) => (
  <Text
    style={{
      color: Colors.textLabel,
      fontSize: 12,
      fontWeight: "700",
      marginBottom: 10,
      letterSpacing: 1,
    }}
  >
    {text.toUpperCase()}
  </Text>
);

export default SectionLabel;
