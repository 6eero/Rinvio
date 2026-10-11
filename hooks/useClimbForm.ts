import {
  ClimbInput,
  DEFAULT_MODE_BY_STYLE,
  createClimbInput,
  isFirstTryMode,
} from "@/domain/climb";
import { useState } from "react";

/**
 * Form state for a climb. Keeps style, mode and attempts consistent:
 * - changing style resets the mode to that style's default
 * - more than one attempt rules out onsight / flash
 */
export function useClimbForm(initial?: ClimbInput) {
  const [form, setForm] = useState<ClimbInput>(
    () => initial ?? createClimbInput(),
  );

  const updateField = <K extends keyof ClimbInput>(
    field: K,
    value: ClimbInput[K],
  ) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };

      if (field === "style") {
        next.mode = DEFAULT_MODE_BY_STYLE[next.style];
        next.attempts = 1;
      }

      if (field === "attempts" && next.attempts > 1 && isFirstTryMode(next.mode)) {
        next.mode = "lead_redpoint";
      }

      return next;
    });
  };

  return { form, updateField };
}
