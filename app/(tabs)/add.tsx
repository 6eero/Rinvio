import ClimbForm from "@/components/ClimbForm";
import Screen from "@/components/Layout/Screen";
import { Colors } from "@/constants/theme";
import { createMockClimbs } from "@/db/devSeed";
import { ClimbInput, createClimbInput } from "@/domain/climb";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import { useCallback } from "react";
import { Alert, Text, TouchableOpacity } from "react-native";

export default function AddScreen() {
  const addClimb = useClimbsStore((s) => s.addClimb);
  const addClimbs = useClimbsStore((s) => s.addClimbs);
  // Set by "add route" on a session. Dropped when leaving the tab, so the
  // next visit starts from a blank form instead of that session.
  const { date } = useLocalSearchParams<{ date?: string }>();
  const navigation =
    useNavigation<{ setParams: (params: { date?: string }) => void }>();

  useFocusEffect(
    useCallback(
      () => () => navigation.setParams({ date: undefined }),
      [navigation],
    ),
  );

  async function handleSubmit(data: ClimbInput) {
    try {
      await addClimb(data);
      Alert.alert(i18n.t("add.savedTitle"), i18n.t("add.savedMessage"), [
        { text: i18n.t("common.ok"), onPress: () => router.push("/(tabs)") },
      ]);
    } catch (e) {
      console.error("[AddScreen] insert failed", e);
      Alert.alert(i18n.t("common.errorTitle"), i18n.t("add.errorMessage"));
    }
  }

  return (
    <Screen title={i18n.t("add.title")}>
      {__DEV__ && (
        <TouchableOpacity
          onPress={async () => {
            await addClimbs(createMockClimbs());
            Alert.alert("Done", "Mock data inserted");
          }}
          style={{ padding: 16, alignItems: "center" }}
        >
          <Text style={{ color: Colors.textFaint }}>🌱 Seed mock data</Text>
        </TouchableOpacity>
      )}
      <ClimbForm
        key={date ?? "new"}
        initial={date ? { ...createClimbInput(), date } : undefined}
        onSubmit={handleSubmit}
        submitLabel={i18n.t("form.addClimb")}
      />
    </Screen>
  );
}
