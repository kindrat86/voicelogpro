import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en";
import { LANGUAGES, isRTL } from "./languages";

/**
 * Dynamically import locale files on demand.
 * Each locale file is at src/i18n/locales/<code>.ts and exports a default object.
 * We use a Vite glob to lazy-load only the needed locale.
 */

// Vite glob: eagerly import English + load others lazily
const localeModules = import.meta.glob("./locales/*.ts", { eager: false });

/**
 * Get the initial language from URL path, localStorage, or browser.
 * URL pattern: /<lang>/path — e.g. /es/, /fr/crew-plan
 */
function getInitialLanguage(): string {
  if (typeof window === "undefined") return "en";

  // 1. Check URL path — /<lang>/...
  const path = window.location.pathname;
  const match = path.match(/^\/([a-z]{2}|zh-CN|yue|pa-PK)(?:\/|$)/i);
  if (match) {
    const code = match[1].toLowerCase();
    if (LANGUAGES.some(l => l.code.toLowerCase() === code)) {
      return code;
    }
  }

  // 2. Check localStorage
  const stored = localStorage.getItem("i18nextLng");
  if (stored && LANGUAGES.some(l => l.code === stored)) {
    return stored;
  }

  // 3. Browser language
  const browserLang = navigator.language;
  const matched = LANGUAGES.find(l =>
    browserLang.toLowerCase().startsWith(l.code.toLowerCase())
  );
  if (matched) return matched.code;

  return "en";
}

// Resources object — English is loaded eagerly
const resources: Record<string, { translation: Record<string, unknown> }> = {
  en: { translation: en },
};

// Dynamically load a locale file
export async function loadLocale(code: string): Promise<Record<string, unknown> | null> {
  if (code === "en") return en;

  const path = `./locales/${code}.ts`;
  const loader = localeModules[path];
  if (!loader) {
    console.warn(`[i18n] No locale file found for: ${code}`);
    return null;
  }

  try {
    const mod = await (loader as () => Promise<{ default: Record<string, unknown> }>)();
    return mod.default;
  } catch (err) {
    console.error(`[i18n] Failed to load locale ${code}:`, err);
    return null;
  }
}

const initialLang = typeof window !== "undefined" ? getInitialLanguage() : "en";

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: initialLang,
    fallbackLng: "en",
    supportedLngs: LANGUAGES.map(l => l.code),
    ns: ["translation"],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    detection: {
      order: ["path", "localStorage", "navigator"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
  });

// Load initial locale if not English
if (initialLang !== "en") {
  loadLocale(initialLang).then((locale) => {
    if (locale) {
      i18n.addResourceBundle(initialLang, "translation", locale, true, true);
    }
  });
}

// Update <html> dir and lang attributes when language changes
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
    document.documentElement.dir = isRTL(lng) ? "rtl" : "ltr";
  }
});

// Set initial dir/lang
if (typeof document !== "undefined") {
  document.documentElement.lang = initialLang;
  document.documentElement.dir = isRTL(initialLang) ? "rtl" : "ltr";
}

export { LANGUAGES };
export default i18n;
