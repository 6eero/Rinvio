import { Colors, Layout, Radius } from "@/constants/theme";
import { matchesQuery } from "@/domain/climb";
import { groupByMonth, groupBySession, sessionKey } from "@/domain/stats";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { formatMonth } from "@/utilities/date";
import { router } from "expo-router";
import { Mountain } from "lucide-react-native";
import { useMemo, useState } from "react";
import { SectionList, Text, TouchableOpacity, View } from "react-native";
import ClimbAccordion from "./ClimbAccordion";

const Separator = () => <View style={{ height: 12 }} />;

export default function ClimbHome({ query }: { query: string }) {
  const climbs = useClimbsStore((s) => s.climbs);
  // sessions the user opened or closed; the others follow the default below
  const [toggled, setToggled] = useState<Record<string, boolean>>({});
  // a new search starts again from the default expansion
  const [prevQuery, setPrevQuery] = useState(query);
  if (query !== prevQuery) {
    setPrevQuery(query);
    setToggled({});
  }

  const sections = useMemo(
    () =>
      groupByMonth(
        groupBySession(climbs.filter((c) => matchesQuery(c, query))),
      ).map(({ month, sessions }) => ({ month, data: sessions })),
    [climbs, query],
  );

  if (!climbs.length) return <EmptyState />;

  // By default only the latest session is open; while searching, every match is
  const searching = query.trim() !== "";
  const latestKey = sessionKey(climbs[0]);
  const isExpanded = (key: string) =>
    toggled[key] ?? (searching || key === latestKey);

  return (
    <SectionList
      sections={sections}
      keyExtractor={(session) => sessionKey(session[0])}
      renderItem={({ item: session }) => {
        const key = sessionKey(session[0]);
        return (
          <ClimbAccordion
            date={session[0].date}
            crag={session[0].crag}
            climbs={session}
            expanded={isExpanded(key)}
            onToggle={() =>
              setToggled((prev) => ({ ...prev, [key]: !isExpanded(key) }))
            }
          />
        );
      }}
      renderSectionHeader={({ section }) => (
        <Text
          style={{
            color: Colors.textLabel,
            fontSize: 12,
            fontWeight: "700",
            letterSpacing: 1,
            textTransform: "uppercase",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          {formatMonth(section.month, i18n.locale)}
        </Text>
      )}
      ItemSeparatorComponent={Separator}
      ListEmptyComponent={
        <Text
          style={{
            color: Colors.textMuted,
            textAlign: "center",
            marginTop: 32,
          }}
        >
          {i18n.t("home.noResults")}
        </Text>
      }
      stickySectionHeadersEnabled={false}
      contentContainerStyle={{ padding: Layout.padding, paddingTop: 4 }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      showsVerticalScrollIndicator={false}
    />
  );
}

function EmptyState() {
  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: Layout.padding * 2,
        gap: 12,
      }}
    >
      <Mountain size={48} color={Colors.textFaint} />
      <Text style={{ color: Colors.text, fontSize: 18, fontWeight: "700" }}>
        {i18n.t("home.emptyTitle")}
      </Text>
      <Text
        style={{ color: Colors.textMuted, fontSize: 14, textAlign: "center" }}
      >
        {i18n.t("home.emptyMessage")}
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/add")}
        activeOpacity={0.8}
        style={{
          marginTop: 8,
          backgroundColor: Colors.text,
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: Radius.xl,
        }}
      >
        <Text
          style={{ color: Colors.textOnLight, fontSize: 15, fontWeight: "700" }}
        >
          {i18n.t("home.emptyAction")}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
