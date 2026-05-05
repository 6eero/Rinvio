import { View } from "react-native";

const DotRating = ({ value, max = 5 }: { value: number; max?: number }) => {
  return (
    <View style={{ flexDirection: "row", gap: 3 }}>
      {Array.from({ length: max }).map((_, i) => (
        <View
          key={i}
          style={[
            {
              width: 6,
              height: 6,
              borderRadius: 3,
            },
            i < value
              ? {
                  backgroundColor: "#B4B2A9",
                }
              : {
                  backgroundColor: "#2a2a2a",
                },
          ]}
        />
      ))}
    </View>
  );
};

export default DotRating;
