import { DEFAULT_FORM } from "@/constants/constants";
import i18n from "@/i18n";
import { ClimbInput, ClimbStyle } from "@/types/climb";
import { useCallback, useRef, useState } from "react";

// ─── Validation & Payload ─────────────────────────────────────────────────────

function validate(form: ClimbInput): string | null {
  // Check required text fields and prevent empty/whitespace strings
  if (!form.crag.trim()) return i18n.t("form.errorCrag");
  if (!form.route.trim()) return i18n.t("form.errorRoute");
  if (!form.grade.trim()) return i18n.t("form.errorGrade");

  // Constraint 1: Alignment between Style and Mode
  if (form.style === "lead") {
    const validLeadModes = [
      "lead_onsight",
      "lead_flash",
      "lead_redpoint",
      "lead_hangdog",
      "lead_failure",
    ];
    if (!validLeadModes.includes(form.mode))
      return i18n.t("form.errorInvalidLeadMode");
  }

  if (form.style === "follow") {
    const validFollowModes = ["follow_success", "follow_failure"];
    if (!validFollowModes.includes(form.mode))
      return i18n.t("form.errorInvalidFollowMode");
  }

  // Constraint 2: Perfect ascents (Onsight/Flash) mathematical logic
  if (
    (form.mode === "lead_onsight" || form.mode === "lead_flash") &&
    form.attempts !== 1
  ) {
    return i18n.t("form.errorPerfectAscentAttempts");
  }

  return null;
}

function buildPayload(form: ClimbInput): ClimbInput {
  return {
    ...form,
    crag: form.crag.trim(),
    route: form.route.trim(),
    notes: form.notes?.trim() ?? "",
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useClimbForm(initial?: Partial<ClimbInput> & { id?: number }) {
  const [form, setForm] = useState<ClimbInput>({
    ...DEFAULT_FORM,
    ...initial,
  });

  // ← ref sempre aggiornata al form corrente
  const formRef = useRef(form);
  formRef.current = form;

  const updateField = useCallback(
    <K extends keyof ClimbInput>(field: K, value: ClimbInput[K]) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value };

        // on style change
        if (field === "style") {
          const style = value as ClimbStyle;
          if (style === "lead") {
            next.mode = "lead_onsight";
            next.attempts = 1;
          } else {
            next.mode = "follow_success";
            next.attempts = 1;
          }
        }

        // on attempt change
        if (field === "attempts" && (value as number) > 1) {
          if (next.mode === "lead_onsight" || next.mode === "lead_flash") {
            next.mode = "lead_redpoint";
          }
        }
        return next;
      });
    },
    [],
  );

  return {
    form,
    updateField,
    validate: () => validate(formRef.current),
    buildPayload: () => buildPayload(formRef.current),
  };
}
