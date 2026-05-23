import FieldCounter from "@/components/Fields/FieldCounter";
import FieldDatePicker from "@/components/Fields/FieldDatePicker";
import FieldOptionScroll from "@/components/Fields/FieldOptionScroll";
import FieldTextArea from "@/components/Fields/FieldTextArea";
import FieldTextInput from "@/components/Fields/FieldTextInput";
import { FRENCH_GRADES, MODES, STYLES } from "@/constants/constants";
import { useClimbForm } from "@/hooks/useClimbForm";
import i18n from "@/i18n";
import { ClimbInput, ClimbMode, ClimbStyle } from "@/types/climb";

import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const GRADE_OPTIONS = FRENCH_GRADES.map((grade) => ({
  label: grade,
  value: grade,
}));

const STYLE_OPTIONS = STYLES.map((style) => ({
  label: `options.style.${style}`,
  value: style,
  isKey: true as const,
}));

const DIFFICULTY_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  label: String(n),
  value: String(n),
}));

export default function ClimbForm({
  initial,
  onSubmit,
  submitLabel,
  onDelete,
  deleteLabel,
}: {
  initial?: Partial<ClimbInput> & { id?: number };
  onSubmit: (data: ClimbInput) => void;
  submitLabel?: string;
  onDelete?: () => void;
  deleteLabel?: string;
}) {
  const { form, updateField, buildPayload, validate } = useClimbForm(initial);

  const [error, setError] = useState("");

  const handleSubmit = () => {
    console.log("form state:", JSON.stringify(form, null, 2));
    const errorMsg = validate();
    if (errorMsg) {
      setError(errorMsg);
      return;
    }
    setError("");
    onSubmit(buildPayload());
  };

  const filteredModeOptions = MODES.filter((mode) =>
    mode.startsWith(form.style),
  ).map((mode) => ({
    label: `options.mode.${mode}`,
    value: mode,
    isKey: true as const,
    disabled:
      form.attempts > 1 && (mode === "lead_onsight" || mode === "lead_flash"),
  }));

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingTop: 0,
          paddingBottom: onDelete ? 20 : 90,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <FieldDatePicker
          label="form.date"
          value={new Date(form.date)}
          onChange={(d) => updateField("date", d.toISOString().split("T")[0])}
        />

        <FieldTextInput
          label="form.crag"
          placeholder="form.cragPlaceholder"
          value={form.crag}
          setValue={(v) => updateField("crag", v)}
        />

        <FieldTextInput
          label="form.route"
          placeholder="form.routePlaceholder"
          value={form.route}
          setValue={(v) => updateField("route", v)}
        />

        <FieldOptionScroll
          label="form.grade"
          value={form.grade}
          onChange={(v) => updateField("grade", v)}
          useScroll
          options={GRADE_OPTIONS}
        />

        <FieldOptionScroll
          label="form.style"
          value={form.style}
          onChange={(v) => updateField("style", v as ClimbStyle)}
          options={STYLE_OPTIONS}
        />

        <FieldOptionScroll
          label="form.mode"
          value={form.mode}
          onChange={(v) => updateField("mode", v as ClimbMode)}
          useScroll
          options={filteredModeOptions}
        />

        <FieldCounter
          label="form.attempts"
          value={form.attempts}
          onChange={(v) => updateField("attempts", v)}
          min={1}
        />

        <FieldOptionScroll
          label="form.difficulty"
          value={String(form.difficulty)}
          onChange={(v) => updateField("difficulty", Number(v))}
          options={DIFFICULTY_OPTIONS}
        />

        <FieldTextArea
          label="form.notes"
          placeholder="form.notesPlaceholder"
          value={form.notes}
          onChange={(v) => updateField("notes", v)}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actionsRow}>
          {onDelete && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={onDelete}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteBtnText}>
                {deleteLabel ?? i18n.t("form.deleteClimb")}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.submitBtn, !onDelete && styles.submitBtnFull]}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitBtnText}>
              {submitLabel ?? i18n.t("form.save")}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  errorText: { color: "#ef4444", textAlign: "center" },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnFull: { flex: 1 },
  submitBtnText: {
    color: "#0d0d0d",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#262626",
  },
  deleteBtnText: { color: "#ef4444", fontSize: 15, fontWeight: "600" },
});
