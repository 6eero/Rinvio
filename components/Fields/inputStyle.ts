import { Colors, Radius } from "@/constants/theme";

// Shared look of text-like inputs (text, textarea, date). Plain objects
// without a style type annotation, so they fit both View and Text styles.

export const inputBoxStyle = (disabled = false) => ({
  backgroundColor: disabled ? Colors.surfaceMuted : Colors.surface,
  borderRadius: Radius.lg,
  padding: 10,
  borderWidth: 1,
  borderColor: Colors.border,
});

export const inputTextStyle = (disabled = false) => ({
  color: disabled ? Colors.textMuted : Colors.text,
  fontSize: 16,
});
