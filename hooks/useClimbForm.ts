import i18n from "@/i18n";
import { useClimbsStore } from "@/store/useClimbsStore";
import { ClimbInput } from "@/types/climb";
import { useCallback, useEffect, useMemo, useState } from "react";

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_FORM: Omit<ClimbInput, "date"> = {
  crag: "",
  routeName: "",
  grade: "5a",
  outcome: "success",
  attempts: 1,
  difficulty: 1,
  mode: "redpoint",
  style: "lead",
  notes: "",
};

const getTodayString = () => new Date().toISOString().split("T")[0];

// ─── Constraint derivations ───────────────────────────────────────────────────

function deriveConstraints(form: ClimbInput) {
  const isFailure = form.outcome === "failure";
  const isHangdog = form.outcome === "hangdog";

  // Vincolo 2: style=follow o attempts>1 forza mode=redpoint e disabilita success
  const isModeForced = form.style === "follow" || form.attempts > 1;

  // Vincolo 5: success + onsight/flash forza attempts=1
  const isAttemptsForced =
    form.outcome === "success" &&
    (form.mode === "onsight" || form.mode === "flash");

  return {
    isFailure,
    isHangdog,
    isModeForced,
    isAttemptsForced,
    // Vincolo 3 & 4: failure e hangdog nascondono mode
    showMode: !isFailure && !isHangdog,
    isModeDisabled: isModeForced,
    // Vincolo 3: failure disabilita difficulty
    isDifficultyDisabled: isFailure,
    isAttemptsDisabled: isAttemptsForced,
    // Vincolo 2: se mode forzato, success non è selezionabile
    isOutcomeSuccessDisabled: isModeForced,
  };
}

function buildPayload(
  form: ClimbInput,
  constraints: ReturnType<typeof deriveConstraints>,
): ClimbInput {
  const { showMode, isModeForced, isFailure, isAttemptsForced } = constraints;

  return {
    ...form,
    crag: form.crag.trim(),
    routeName: form.routeName.trim(),
    notes: form.notes?.trim() ?? "",
    mode: showMode && !isModeForced ? form.mode : "redpoint",
    difficulty: isFailure ? 5 : form.difficulty,
    attempts: isAttemptsForced ? 1 : form.attempts,
  };
}

function validate(form: ClimbInput): string | null {
  if (!form.crag.trim()) return i18n.t("form.errorCrag");
  if (!form.routeName.trim()) return i18n.t("form.errorRoute");
  return null;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useClimbForm(initial?: Partial<ClimbInput> & { id?: number }) {
  const isEdit = !!initial?.id;
  const climbs = useClimbsStore((s) => s.climbs);
  const initialCrag = initial?.crag ?? "";

  const [form, setForm] = useState<ClimbInput>({
    date: getTodayString(),
    ...DEFAULT_FORM,
    ...initial,
  });

  const updateField = useCallback(
    <K extends keyof ClimbInput>(field: K, value: ClimbInput[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  // Vincolo 1: auto-fill crag dalla data, reset se non c'è match
  const existingCragForDate = useMemo(() => {
    if (isEdit) return null;
    return climbs.find((c) => c.date === form.date)?.crag ?? null;
  }, [isEdit, form.date, climbs]);

  useEffect(() => {
    if (isEdit) return;
    updateField("crag", existingCragForDate ?? initialCrag);
  }, [existingCragForDate, updateField]);

  const constraints = useMemo(() => deriveConstraints(form), [form]);

  // Vincolo 2: forza mode=redpoint nello stato visibile
  useEffect(() => {
    if (constraints.isModeForced) {
      updateField("mode", "redpoint");
    }
  }, [constraints.isModeForced]);

  // Vincolo 2: resetta outcome a hangdog se success non è più selezionabile
  useEffect(() => {
    if (constraints.isOutcomeSuccessDisabled && form.outcome === "success") {
      updateField("outcome", "hangdog");
    }
  }, [constraints.isOutcomeSuccessDisabled]);

  // Vincolo 3: forza difficulty=5 nello stato visibile
  useEffect(() => {
    if (constraints.isFailure) {
      updateField("difficulty", 5);
    }
  }, [constraints.isFailure]);

  return {
    form,
    updateField,
    // field disability flags
    isDateDisabled: isEdit,
    isCragDisabled: isEdit || !!existingCragForDate,
    isModeDisabled: constraints.isModeDisabled,
    isDifficultyDisabled: constraints.isDifficultyDisabled,
    isAttemptsDisabled: constraints.isAttemptsDisabled,
    isOutcomeSuccessDisabled: constraints.isOutcomeSuccessDisabled,
    // visibility flags
    showMode: constraints.showMode,
    // helpers
    buildPayload: () => buildPayload(form, constraints),
    validate: () => validate(form),
  };
}
