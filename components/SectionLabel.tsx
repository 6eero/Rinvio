import { Text } from "react-native";

const SectionLabel = ({ text }: { text: string }) => (
  <Text
    style={{
      color: "#aaa",
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
