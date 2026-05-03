import ClimbForm from "@/components/ClimbForm";
import PageTitle from "@/components/Layout/PageTitle";
import { insertClimb } from "@/db/climbsRepository";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { ClimbInput } from "@/types/climb";
import { router } from "expo-router";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddScreen() {
  const insets = useSafeAreaInsets();

  async function handleSubmit(data: ClimbInput) {
    try {
      await insertClimb(data);
      await useClimbsStore.getState().refresh();
      Alert.alert(i18n.t("add.savedTitle"), i18n.t("add.savedMessage"), [
        { text: i18n.t("add.ok"), onPress: () => router.push("/(tabs)") },
      ]);
    } catch (e) {
      Alert.alert(i18n.t("add.errorTitle"), i18n.t("add.errorMessage"));
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#151718",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <PageTitle title={i18n.t("add.title")} />
      <ClimbForm
        key="add-form"
        onSubmit={handleSubmit}
        submitLabel={i18n.t("form.addClimb")}
      />
    </View>
  );
}
