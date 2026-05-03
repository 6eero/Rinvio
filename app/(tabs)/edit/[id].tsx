import ClimbForm from "@/components/ClimbForm";
import PageTitle from "@/components/Layout/PageTitle";
import { deleteClimb, getClimbById, updateClimb } from "@/db/climbsRepository";
import i18n from "@/i18n";
import { Climb, ClimbInput } from "@/types/climb";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [climb, setClimb] = useState<Climb | null>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    getClimbById(Number(id)).then((data) => {
      setClimb(data);
      setLoading(false);
    });
  }, [id]);

  async function handleSubmit(data: ClimbInput) {
    try {
      await updateClimb(Number(id), data);
      Alert.alert(i18n.t("edit.savedTitle"), i18n.t("edit.savedMessage"), [
        { text: i18n.t("edit.ok"), onPress: () => router.back() },
      ]);
    } catch (e) {
      Alert.alert(i18n.t("edit.errorTitle"), i18n.t("edit.errorMessage"));
    }
  }

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#151718",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#888" }}>{i18n.t("edit.loading")}</Text>
      </View>
    );
  }

  if (!climb) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#151718",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#ef4444" }}>{i18n.t("edit.notFound")}</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(i18n.t("edit.deleteTitle"), i18n.t("edit.deleteMessage"), [
      { text: i18n.t("edit.cancel"), style: "cancel" },
      {
        text: i18n.t("edit.deleteConfirm"),
        style: "destructive",
        onPress: async () => {
          await deleteClimb(Number(id));
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
      <ClimbForm
        initial={climb}
        onSubmit={handleSubmit}
        submitLabel={i18n.t("form.updateClimb")}
        onDelete={handleDelete}
        deleteLabel={i18n.t("form.deleteClimb")}
      />
    </View>
  );
}
