import { HapticTab } from "@/components/haptic-tab";
import { useColorScheme } from "@/hooks/use-color-scheme";
import i18n from "@/i18n";
import { Tabs } from "expo-router";
import { Database, List, PlusCircle } from "lucide-react-native";
import { Colors } from "../../constants/theme";

export default function NavBar() {
  const colorScheme = useColorScheme();
  const activeColor = Colors[colorScheme ?? "light"].tint;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: activeColor,
        tabBarInactiveTintColor: "#555555",
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#121414",
          borderTopColor: "#2a2a2a",
          height: 90,
          paddingBottom: 12,
          paddingTop: 8,
          elevation: 8,
          zIndex: 100,
        },
        tabBarLabelStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: i18n.t("tabs.climbs"),
          tabBarIcon: ({ color }) => (
            <List size={24} color={color} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="add"
        options={{
          title: i18n.t("tabs.add"),
          tabBarIcon: ({ color }) => (
            <PlusCircle size={24} color={color} strokeWidth={2} />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: i18n.t("tabs.settings"),
          tabBarIcon: ({ color }) => (
            <Database size={24} color={color} strokeWidth={2} />
          ),
        }}
      />

      {/* Hidden */}
      <Tabs.Screen
        name="edit/[id]"
        options={{
          href: null,
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
