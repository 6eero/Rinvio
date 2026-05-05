import { Text, TouchableOpacity } from "react-native";

const OptionButton = ({ label, selected, onPress, color }: any) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 10,
          backgroundColor: "#161616",
          borderWidth: 1,
          borderColor: "#202020",
          marginRight: 8,
          marginBottom: 12,
        },
        selected && {
          backgroundColor: color ?? "#474747",
          borderColor: color ?? "#505050",
        },
      ]}
    >
      <Text
        style={[
          { color: "#888", fontWeight: "600" },
          selected && { color: "#fff" },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default OptionButton;
