import i18n from "@/i18n";
import Storage from "expo-sqlite/kv-store";
import { create } from "zustand";

export type Locale = "it" | "en";
export const SUPPORTED_LOCALES: Locale[] = ["it", "en"];

const STORAGE_KEY = "app.locale";

const saved = Storage.getItemSync(STORAGE_KEY);
if (saved === "it" || saved === "en") {
  i18n.locale = saved;
}

type LocaleState = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: i18n.locale as Locale,
  setLocale: (locale) => {
    i18n.locale = locale;
    Storage.setItemSync(STORAGE_KEY, locale);
    set({ locale });
  },
}));
