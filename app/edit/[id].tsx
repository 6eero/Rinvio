import ClimbForm from "@/components/ClimbForm";
import PageTitle from "@/components/Layout/PageTitle";
import { deleteClimb, getClimbById, updateClimb } from "@/db/climbsRepository";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { useLoadData } from "@/store/useLoadData";
import { Climb, ClimbInput } from "@/types/climb";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [climb, setClimb] = useState<Climb | null>(null);
  const { loadData } = useLoadData();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadData(async () => {
      const data = await getClimbById(Number(id));
      setClimb(data);
    });
  }, [id]);

  async function handleSubmit(data: ClimbInput) {
    try {
      await updateClimb(Number(id), data);
      await useClimbsStore.getState().refresh();
      Alert.alert(i18n.t("edit.savedTitle"), i18n.t("edit.savedMessage"), [
        { text: i18n.t("edit.ok"), onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert(i18n.t("edit.errorTitle"), i18n.t("edit.errorMessage"));
    }
  }

  const handleDelete = () => {
    Alert.alert(i18n.t("edit.deleteTitle"), i18n.t("edit.deleteMessage"), [
      { text: i18n.t("edit.cancel"), style: "cancel" },
      {
        text: i18n.t("edit.deleteConfirm"),
        style: "destructive",
        onPress: async () => {
          await deleteClimb(Number(id));
          await useClimbsStore.getState().refresh();
          router.back();
        },
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#151718",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }}
    >
      <PageTitle title={i18n.t("edit.title")} />
      {climb && (
        <ClimbForm
          key={`edit-form-${id}`}
          initial={climb}
          onSubmit={handleSubmit}
          submitLabel={i18n.t("form.updateClimb")}
          onDelete={handleDelete}
          deleteLabel={i18n.t("form.deleteClimb")}
        />
      )}
    </View>
  );
}
