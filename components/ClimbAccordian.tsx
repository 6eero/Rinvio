import i18n from "@/i18n";
import { Climb } from "@/types/climb";
import { ChevronDown, MapPin } from "lucide-react-native";
import { useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import Badge from "./Badge/Badge";
import ClimbCard from "./ClimbCard";

export default function ClimbAccordian({
  date,
  crag,
  climbs,
}: {
  date: string;
  crag: string;
  climbs: Climb[];
}) {
  const [expanded, setExpanded] = useState(false);
  const rotation = useRef(new Animated.Value(0)).current;

  const toggle = () => {
    Animated.timing(rotation, {
      toValue: expanded ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setExpanded((prev) => !prev);
  };

  const chevronRotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      style={{
        backgroundColor: "#161616",
        borderColor: "rgba(255,255,255,0.07)",
        borderRadius: 12,
        borderWidth: 0.5,
        overflow: "hidden",
      }}
    >
      {/* Header row */}
      <TouchableOpacity
        onPress={toggle}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 20,
        }}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 12,
              fontWeight: "bold",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            {new Date(date).toLocaleDateString(i18n.locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Badge fontSize={12} text={String(climbs.length)} rounded />
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Badge
            fontSize={10}
            text={crag}
            icon={<MapPin />}
            badgeColor="#202020"
          />
          <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
            <ChevronDown size={16} color="rgba(255,255,255,0.4)" />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Expanded climb list */}
      {expanded && (
        <View
          style={{
            gap: 0,
          }}
        >
          {climbs.map((climb) => (
            <View key={climb.id}>
              <View
                style={{
                  height: 0.5,
                  backgroundColor: "rgba(255,255,255,0.07)",
                }}
              ></View>
              <ClimbCard climb={climb} />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
