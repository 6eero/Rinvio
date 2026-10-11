import FieldCounter from "@/components/Fields/FieldCounter";
import FieldDatePicker from "@/components/Fields/FieldDatePicker";
import FieldOptionScroll from "@/components/Fields/FieldOptionScroll";
import FieldTextArea from "@/components/Fields/FieldTextArea";
import FieldTextInput from "@/components/Fields/FieldTextInput";
import ModeHint from "@/components/ModeHint";
import { Colors, Radius } from "@/constants/theme";
import {
  CLIMB_STYLES,
  ClimbInput,
  DIFFICULTY_MAX,
  DIFFICULTY_MIN,
  FRENCH_GRADES,
  MODES_BY_STYLE,
  isFirstTryMode,
  normalizeClimbInput,
  validateClimb,
} from "@/domain/climb";
import { useClimbForm } from "@/hooks/useClimbForm";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const GRADE_OPTIONS = FRENCH_GRADES.map((grade) => ({
  label: grade,
  value: grade as string,
}));

const DIFFICULTY_OPTIONS = Array.from(
  { length: DIFFICULTY_MAX - DIFFICULTY_MIN + 1 },
  (_, i) => ({ label: String(DIFFICULTY_MIN + i), value: DIFFICULTY_MIN + i }),
);

export default function ClimbForm({
  initial,
  onSubmit,
  submitLabel,
  onDelete,
  isEdit = false,
}: {
  initial?: ClimbInput;
  onSubmit: (data: ClimbInput) => void;
  submitLabel: string;
  onDelete?: () => void;
  isEdit?: boolean;
}) {
  const { form, updateField } = useClimbForm(initial);
  const [error, setError] = useState("");

  // A day is a single session: when adding a climb on a day that already has
  // one, the crag is taken from it and locked.
  const sameDayCrag = useClimbsStore((s) =>
    isEdit ? undefined : s.climbs.find((c) => c.date === form.date)?.crag,
  );
  const crag = sameDayCrag ?? form.crag;

  const handleSubmit = () => {
    const payload = normalizeClimbInput({ ...form, crag });
    const errorKey = validateClimb(payload);
    if (errorKey) {
      setError(i18n.t(errorKey));
      return;
    }
    setError("");
    onSubmit(payload);
  };

  const styleOptions = CLIMB_STYLES.map((style) => ({
    label: i18n.t(`options.style.${style}`),
    value: style,
  }));

  const modeOptions = MODES_BY_STYLE[form.style].map((mode) => ({
    label: i18n.t(`options.mode.${mode}`),
    value: mode,
    disabled: form.attempts > 1 && isFirstTryMode(mode),
  }));

  return (
    <View>
      <FieldDatePicker
        label={i18n.t("form.date")}
        value={form.date}
        onChange={(d) => updateField("date", d)}
        disabled={isEdit}
      />

      <FieldTextInput
        label={i18n.t("form.crag")}
        placeholder={i18n.t("form.cragPlaceholder")}
        value={crag}
        onChange={(v) => updateField("crag", v)}
        disabled={isEdit || sameDayCrag !== undefined}
      />

      <FieldTextInput
        label={i18n.t("form.route")}
        placeholder={i18n.t("form.routePlaceholder")}
        value={form.route}
        onChange={(v) => updateField("route", v)}
      />

      <FieldOptionScroll
        label={i18n.t("form.grade")}
        value={form.grade}
        onChange={(v) => updateField("grade", v)}
        useScroll
        options={GRADE_OPTIONS}
      />

      <FieldOptionScroll
        label={i18n.t("form.style")}
        value={form.style}
        onChange={(v) => updateField("style", v)}
        options={styleOptions}
      />

      <FieldOptionScroll
        label={i18n.t("form.mode")}
        value={form.mode}
        onChange={(v) => updateField("mode", v)}
        useScroll
        options={modeOptions}
        footer={
          <ModeHint
            mode={form.mode}
            firstTryOnly={form.style === "lead" && form.attempts > 1}
          />
        }
      />

      <FieldCounter
        label={i18n.t("form.attempts")}
        value={form.attempts}
        onChange={(v) => updateField("attempts", v)}
        min={1}
      />

      <FieldOptionScroll
        label={i18n.t("form.difficulty")}
        value={form.difficulty}
        onChange={(v) => updateField("difficulty", v)}
        options={DIFFICULTY_OPTIONS}
      />

      <FieldTextArea
        label={i18n.t("form.notes")}
        placeholder={i18n.t("form.notesPlaceholder")}
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
              {i18n.t("form.deleteClimb")}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.submitBtn, !onDelete && styles.submitBtnFull]}
          onPress={handleSubmit}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>{submitLabel}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  errorText: { color: Colors.danger, textAlign: "center" },
  actionsRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    marginTop: 10,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: Colors.text,
    paddingVertical: 16,
    borderRadius: Radius.xl,
    alignItems: "center",
    justifyContent: "center",
  },
  submitBtnFull: { flex: 1 },
  submitBtnText: {
    color: Colors.textOnLight,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: Colors.surfaceMuted,
    paddingVertical: 16,
    borderRadius: Radius.xl,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.surfaceRaised,
  },
  deleteBtnText: { color: Colors.danger, fontSize: 15, fontWeight: "600" },
});
