import FieldCounter from "@/components/Fields/FieldCounter";
import FieldDatePicker from "@/components/Fields/FieldDatePicker";
import FieldOptionScroll from "@/components/Fields/FieldOptionScroll";
import FieldTextArea from "@/components/Fields/FieldTextArea";
import FieldTextInput from "@/components/Fields/FieldTextInput";
import { FRENCH_GRADES, MODES, STYLES } from "@/constants/constants";
import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { ClimbInput } from "@/types/climb";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
  const isEdit = !!initial?.id;
  const climbs = useClimbsStore((s) => s.climbs);

  const [form, setForm] = useState<ClimbInput>({
    date: initial?.date ?? new Date().toISOString().split("T")[0],
    crag: initial?.crag ?? "",
    routeName: initial?.routeName ?? "",
    grade: initial?.grade ?? "5a",
    outcome: initial?.outcome ?? "success",
    attempts: initial?.attempts ?? 1,
    difficulty: initial?.difficulty ?? 1,
    mode: initial?.mode ?? "redpoint",
    style: initial?.style ?? "lead",
    notes: initial?.notes ?? "",
  });
  const [error, setError] = useState("");

  const updateField = useCallback((field: keyof ClimbInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const existingCragForDate = useMemo(() => {
    if (isEdit) return null;
    const climbOnSameDate = climbs.find((c) => c.date === form.date);
    return climbOnSameDate ? climbOnSameDate.crag : null;
  }, [form.date, climbs, isEdit]);

  useEffect(() => {
    if (existingCragForDate) {
      updateField("crag", existingCragForDate);
    }
  }, [existingCragForDate, updateField]);

  const isCragEditable = !isEdit && !existingCragForDate;

  // Variabile d'appoggio per capire se la salita è fallita
  const isFailure = form.outcome === "failure";

  const modeOptions = useMemo(
    () =>
      MODES.map((m) => ({
        label: `options.mode.${m}`,
        value: m,
        isKey: true,
      })),
    [],
  );

  const styleOptions = useMemo(
    () =>
      STYLES.map((s) => ({
        label: `options.style.${s}`,
        value: s,
        isKey: true,
      })),
    [],
  );

  const difficultyOptions = useMemo(
    () =>
      [1, 2, 3, 4, 5].map((n) => ({
        label: String(n),
        value: String(n),
      })),
    [],
  );

  const validate = (): boolean => {
    if (!form.crag.trim()) {
      setError(i18n.t("form.errorCrag"));
      return false;
    }
    if (!form.routeName.trim()) {
      setError(i18n.t("form.errorRoute"));
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setError("");

    const cleanForm: ClimbInput = {
      ...form,
      crag: form.crag.trim(),
      routeName: form.routeName.trim(),
      notes: form.notes?.trim() || "",
      ...(isFailure && {
        mode: "redpoint" as const,
        difficulty: 5,
      }),
    };

    onSubmit(cleanForm);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <ScrollView
        style={styles.container}
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
          editable={!isEdit}
        />

        <FieldTextInput
          label="form.crag"
          placeholder="form.cragPlaceholder"
          value={form.crag}
          setValue={(value) => updateField("crag", value)}
          editable={isCragEditable}
        />

        <FieldTextInput
          label="form.routeName"
          placeholder="form.routeNamePlaceholder"
          value={form.routeName}
          setValue={(value) => updateField("routeName", value)}
        />

        <FieldOptionScroll
          label="form.grade"
          value={form.grade}
          onChange={(value) => updateField("grade", value)}
          useScroll
          options={FRENCH_GRADES.map((g) => ({ label: g, value: g }))}
        />

        <FieldOptionScroll
          label="form.style"
          value={form.style}
          onChange={(v) => updateField("style", v)}
          options={styleOptions}
        />

        <FieldCounter
          label="form.attempts"
          value={form.attempts}
          onChange={(v) => updateField("attempts", v)}
          min={1}
        />

        <FieldOptionScroll
          label="form.outcome"
          value={form.outcome}
          onChange={(value) => updateField("outcome", value)}
          options={[
            {
              label: "options.outcome.success",
              value: "success",
              isKey: true,
              color: "#22c55e",
            },
            {
              label: "options.outcome.failure",
              value: "failure",
              isKey: true,
              color: "#ef4444",
            },
          ]}
        />

        {!isFailure && (
          <>
            <FieldOptionScroll
              label="form.mode"
              value={form.mode}
              onChange={(v) => updateField("mode", v)}
              options={modeOptions}
            />

            <FieldOptionScroll
              label="form.difficulty"
              value={String(form.difficulty)}
              onChange={(v) => updateField("difficulty", Number(v))}
              options={difficultyOptions}
            />
          </>
        )}

        <FieldTextArea
          label="form.notes"
          placeholder="form.notesPlaceholder"
          value={form.notes}
          onChange={(value) => updateField("notes", value)}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.actionsRow}>
          {onDelete && (
            <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
              <Text style={styles.deleteBtnText}>
                {deleteLabel ?? i18n.t("form.deleteClimb")}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
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
  actionsRow: { flexDirection: "row", gap: 15 },
  submitBtn: {
    flex: 1,
    backgroundColor: "#e85d04",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
  },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  deleteBtn: {
    flex: 1,
    backgroundColor: "#ef4444",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
  },
  deleteBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "#ef4444", textAlign: "center", marginTop: 15 },
});
