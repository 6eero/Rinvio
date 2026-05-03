import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";

import en from "./locales/en.json";
import it from "./locales/it.json";

const translations = { it, en };
const i18n = new I18n(translations);

const deviceLanguage = getLocales()[0]?.languageCode ?? "";
const isDeviceLanguageSupported = deviceLanguage in translations;

i18n.locale = isDeviceLanguageSupported ? deviceLanguage : "en";
i18n.enableFallback = true;
i18n.defaultLocale = "en";

export default i18n;
