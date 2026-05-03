import { FRENCH_GRADES } from "@/constants/grades";
import i18n from "@/i18n";
import { ClimbInput, ClimbMode, ClimbOutcome, ClimbStyle } from "@/types/climb";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  initial?: Partial<ClimbInput>;
  onSubmit: (data: ClimbInput) => void;
  submitLabel?: string;
  onDelete?: () => void;
  deleteLabel?: string;
};

// --- Componenti UI Interni ---

function OptionButton({ label, selected, onPress, color }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.optionButton,
        selected && {
          backgroundColor: color ?? "#e85d04",
          borderColor: color ?? "#e85d04",
        },
      ]}
    >
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const SectionLabel = ({ text }: { text: string }) => (
  <Text style={styles.sectionLabel}>{text.toUpperCase()}</Text>
);

// --- Componente Principale ---

export default function ClimbForm({
  initial,
  onSubmit,
  submitLabel,
  onDelete,
  deleteLabel,
}: Props) {
  // Gestione Data (Oggetto Date per il picker + Stringa per il DB)
  const initialDate = initial?.date ? new Date(initial.date) : new Date();
  const [dateObj, setDateObj] = useState(initialDate);
  const [dateString, setDateString] = useState(
    initial?.date ?? initialDate.toISOString().split("T")[0],
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Altri stati
  const [crag, setCrag] = useState(initial?.crag ?? "");
  const [routeName, setRouteName] = useState(initial?.routeName ?? "");
  const [grade, setGrade] = useState(initial?.grade ?? "5a");
  const [length, setLength] = useState(initial?.length?.toString() ?? "");
  const [outcome, setOutcome] = useState<ClimbOutcome>(
    initial?.outcome ?? "success",
  );
  const [attempts, setAttempts] = useState(
    initial?.attempts?.toString() ?? "1",
  );
  const [mode, setMode] = useState<ClimbMode>(initial?.mode ?? "redpoint");
  const [style, setStyle] = useState<ClimbStyle>(initial?.style ?? "lead");
  const [difficulty, setDifficulty] = useState(initial?.difficulty ?? 5);
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState("");

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowDatePicker(false);

    if (selectedDate) {
      setDateObj(selectedDate);
      const formatted = selectedDate.toISOString().split("T")[0];
      setDateString(formatted);
    }
  };

  const validate = (): boolean => {
    if (!crag.trim()) {
      setError(i18n.t("form.errorCrag"));
      return false;
    }
    if (!routeName.trim()) {
      setError(i18n.t("form.errorRoute"));
      return false;
    }
    const att = parseInt(attempts);
    if (isNaN(att) || att < 1) {
      setError(i18n.t("form.errorAttempts"));
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      date: dateString,
      crag: crag.trim(),
      routeName: routeName.trim(),
      grade,
      length: length ? parseFloat(length) : null,
      outcome,
      attempts: parseInt(attempts),
      mode,
      style,
      difficulty,
      notes: notes.trim() || null,
    });
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
        {/* Data Picker */}
        <SectionLabel text={i18n.t("form.date")} />
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={{ color: "#fff", fontSize: 16 }}>
            {dateObj.toLocaleDateString(i18n.locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dateObj}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onDateChange}
            maximumDate={new Date()}
          />
        )}

        {/* Falesia e Via */}
        <SectionLabel text={i18n.t("form.crag")} />
        <TextInput
          style={styles.input}
          value={crag}
          onChangeText={setCrag}
          placeholder={i18n.t("form.cragPlaceholder")}
          placeholderTextColor="#555"
        />

        <SectionLabel text={i18n.t("form.routeName")} />
        <TextInput
          style={styles.input}
          value={routeName}
          onChangeText={setRouteName}
          placeholder={i18n.t("form.routeNamePlaceholder")}
          placeholderTextColor="#555"
        />

        {/* Grado (Scrollable) */}
        <SectionLabel text={i18n.t("form.grade")} />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.horizontalScroll}
        >
          {FRENCH_GRADES.map((g) => (
            <OptionButton
              key={g}
              label={g}
              selected={grade === g}
              onPress={() => setGrade(g)}
            />
          ))}
        </ScrollView>

        {/* Esito */}
        <SectionLabel text={i18n.t("form.outcome")} />
        <View style={styles.row}>
          <OptionButton
            label={i18n.t("options.outcome.success")}
            selected={outcome === "success"}
            onPress={() => setOutcome("success")}
            color="#22c55e"
          />
          <OptionButton
            label={i18n.t("options.outcome.failure")}
            selected={outcome === "failure"}
            onPress={() => setOutcome("failure")}
            color="#ef4444"
          />
        </View>

        {/* Tentativi (Counter) */}
        <SectionLabel text={i18n.t("form.attempts")} />
        <View style={[styles.row, { alignItems: "center", gap: 20 }]}>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() =>
              setAttempts(Math.max(1, parseInt(attempts) - 1).toString())
            }
          >
            <Text style={styles.counterBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{attempts}</Text>
          <TouchableOpacity
            style={styles.counterBtn}
            onPress={() => setAttempts((parseInt(attempts) + 1).toString())}
          >
            <Text style={styles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Mode e Style */}
        <SectionLabel text={i18n.t("form.mode")} />
        <View style={styles.rowWrap}>
          {["onsight", "flash", "redpoint"].map((m) => (
            <OptionButton
              key={m}
              label={i18n.t(`options.mode.${m}`)}
              selected={mode === m}
              onPress={() => setMode(m as ClimbMode)}
            />
          ))}
        </View>

        <SectionLabel text={i18n.t("form.style")} />
        <View style={styles.row}>
          {["lead", "follow"].map((s) => (
            <OptionButton
              key={s}
              label={i18n.t(`options.style.${s}`)}
              selected={style === s}
              onPress={() => setStyle(s as ClimbStyle)}
            />
          ))}
        </View>

        {/* Note */}
        <SectionLabel text={i18n.t("form.notes")} />
        <TextInput
          style={[styles.input, styles.textArea]}
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholder={i18n.t("form.notesPlaceholder")}
          placeholderTextColor="#555"
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={{ display: "flex", flexDirection: "row", gap: 15 }}>
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
            <Text style={styles.submitBtnText}>
              {submitLabel ?? i18n.t("form.save")}
            </Text>
          </TouchableOpacity>
          {onDelete && (
            <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
              <Text style={styles.deleteBtnText}>
                {deleteLabel ?? i18n.t("form.deleteClimb")}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  sectionLabel: {
    color: "#aaa",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
    marginTop: 20,
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#161616",
    borderRadius: 12,
    padding: 10,
    color: "#fff",
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#202020",
    marginBottom: 12,
  },
  textArea: { minHeight: 100, textAlignVertical: "top" },
  horizontalScroll: { flexDirection: "row" },
  row: { flexDirection: "row", gap: 2, marginBottom: 12 },
  rowWrap: { flexDirection: "row", flexWrap: "wrap", gap: 2 },
  optionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#161616",
    borderWidth: 1,
    borderColor: "#202020",
    marginRight: 8,
    marginBottom: 12,
  },
  optionText: { color: "#888", fontWeight: "600" },
  optionTextSelected: { color: "#fff" },
  counterBtn: {
    width: 40,
    height: 40,
    backgroundColor: "#161616",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnText: { color: "#fff", fontSize: 16 },
  counterValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    minWidth: 30,
    textAlign: "center",
  },
  submitBtn: {
    backgroundColor: "#e85d04",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
    flex: 1,
  },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 30,
    flex: 1,
  },
  deleteBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  errorText: { color: "#ef4444", textAlign: "center", marginTop: 15 },
});
