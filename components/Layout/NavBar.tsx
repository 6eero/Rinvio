import { HapticTab } from "@/components/HapticTab";
import i18n from "@/i18n";
import { Tabs } from "expo-router";
import { ChartSpline, Database, List, PlusCircle } from "lucide-react-native";
import { Colors } from "@/constants/theme";

export default function NavBar() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.tint,
        tabBarInactiveTintColor: Colors.textFaint,
        headerShown: false,
        tabBarButton: HapticTab,
        sceneStyle: { backgroundColor: Colors.background },
        // height and bottom safe area are handled by the navigator: the tab bar
        // stays in the layout flow, so screens never end up underneath it
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.divider,
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
        name="analytics"
        options={{
          title: i18n.t("tabs.analytics"),
          tabBarIcon: ({ color }) => (
            <ChartSpline size={24} color={color} strokeWidth={2} />
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
    </Tabs>
  );
}
