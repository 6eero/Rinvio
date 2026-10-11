import ClimbHome from "@/components/ClimbHome";
import Screen from "@/components/Layout/Screen";
import SearchBar from "@/components/SearchBar";
import { Colors, Layout } from "@/constants/theme";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { Search } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const hasClimbs = useClimbsStore((s) => s.climbs.length > 0);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const closeSearch = () => {
    setQuery("");
    setSearchOpen(false);
  };

  // while searching, the field takes the place of the title
  const searchHeader = searchOpen && (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: Layout.padding,
        paddingVertical: Layout.padding - 6,
      }}
    >
      <View style={{ flex: 1 }}>
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder={i18n.t("home.searchPlaceholder")}
          autoFocus
        />
      </View>
      <TouchableOpacity onPress={closeSearch} hitSlop={12}>
        <Text style={{ color: Colors.text, fontSize: 16 }}>
          {i18n.t("common.cancel")}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    // the list scrolls (and virtualizes) by itself
    <Screen
      title={i18n.t("home.title")}
      header={searchHeader || undefined}
      headerRight={
        hasClimbs && (
          <TouchableOpacity onPress={() => setSearchOpen(true)} hitSlop={12}>
            <Search size={22} color={Colors.text} />
          </TouchableOpacity>
        )
      }
      scrollable={false}
    >
      <ClimbHome query={query} />
    </Screen>
  );
}
