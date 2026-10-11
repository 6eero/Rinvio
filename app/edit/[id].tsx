import ClimbForm from "@/components/ClimbForm";
import Screen from "@/components/Layout/Screen";
import { ClimbInput } from "@/domain/climb";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { router, useLocalSearchParams } from "expo-router";
import { Alert } from "react-native";

export default function EditScreen() {
  const id = Number(useLocalSearchParams<{ id: string }>().id);
  const climb = useClimbsStore((s) => s.climbs.find((c) => c.id === id));
  const updateClimb = useClimbsStore((s) => s.updateClimb);
  const deleteClimb = useClimbsStore((s) => s.deleteClimb);

  async function handleSubmit(data: ClimbInput) {
    try {
      await updateClimb(id, data);
      Alert.alert(i18n.t("edit.savedTitle"), i18n.t("edit.savedMessage"), [
        { text: i18n.t("common.ok"), onPress: () => router.back() },
      ]);
    } catch (e) {
      console.error("[EditScreen] update failed", e);
      Alert.alert(i18n.t("common.errorTitle"), i18n.t("edit.errorMessage"));
    }
  }

  const handleDelete = () => {
    Alert.alert(i18n.t("edit.deleteTitle"), i18n.t("edit.deleteMessage"), [
      { text: i18n.t("common.cancel"), style: "cancel" },
      {
        text: i18n.t("edit.deleteConfirm"),
        style: "destructive",
        onPress: async () => {
          try {
            router.back();
            await deleteClimb(id);
          } catch (e) {
            console.error("[EditScreen] delete failed", e);
            Alert.alert(
              i18n.t("common.errorTitle"),
              i18n.t("edit.deleteErrorMessage"),
            );
          }
        },
      },
    ]);
  };

  return (
    <Screen title={i18n.t("edit.title")}>
      {/* climbs are loaded at startup; the form appears as soon as they are */}
      {climb && (
        <ClimbForm
          key={climb.id}
          initial={climb}
          onSubmit={handleSubmit}
          submitLabel={i18n.t("form.updateClimb")}
          onDelete={handleDelete}
          isEdit
        />
      )}
    </Screen>
  );
}
