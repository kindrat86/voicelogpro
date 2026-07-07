import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES } from "@/i18n/languages";
import { loadLocale } from "@/i18n";

/**
 * Language switcher dropdown.
 * Changes language by updating the URL path to /<lang>/... and loading the locale.
 */
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef<HTMLDivElement>(null);
  const currentLang = i18n.language || "en";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = async (code: string) => {
    if (code === currentLang) {
      setOpen(false);
      return;
    }

    // Load the locale
    if (code !== "en") {
      const locale = await loadLocale(code);
      if (locale) {
        i18n.addResourceBundle(code, "translation", locale, true, true);
      }
    }

    await i18n.changeLanguage(code);
    localStorage.setItem("i18nextLng", code);
    setOpen(false);

    // Update URL: strip or add language prefix
    const path = location.pathname;
    // Check if current path has a language prefix
    const langMatch = path.match(/^\/([a-z]{2}|zh-CN|yue|pa-PK)(?:\/|$)/i);

    if (code === "en") {
      // Remove language prefix for English
      if (langMatch) {
        const newPath = path.replace(/^\/[a-z]{2}|^\/zh-CN|^\/yue|^\/pa-PK/i, "") || "/";
        navigate(newPath === "/" ? "/" : newPath);
      }
    } else {
      // Add/replace language prefix
      let restPath = path;
      if (langMatch) {
        restPath = path.replace(/^\/[a-z]{2}|^\/zh-CN|^\/yue|^\/pa-PK/i, "") || "/";
      }
      const newPath = `/${code}${restPath === "/" ? "" : restPath}`;
      navigate(newPath);
    }

    // Reload page to ensure clean state for locale rendering
    window.location.reload();
  };

  const filteredLanguages = LANGUAGES.filter(
    (l) =>
      l.englishName.toLowerCase().includes(search.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
        aria-label={t("nav.language") || "Language"}
      >
        <Globe className="w-4 h-4" />
        {!compact && (
          <span className="hidden sm:inline">
            {LANGUAGES.find((l) => l.code === currentLang)?.nativeName || "English"}
          </span>
        )}
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-background border-2 border-border rounded-lg shadow-xl z-[100] overflow-hidden">
          {/* Search */}
          <div className="p-2 border-b border-border">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search language..."
              className="w-full px-3 py-2 text-sm bg-input border border-border rounded focus:outline-none focus:border-primary"
              autoFocus
            />
          </div>

          {/* Language list */}
          <div className="max-h-72 overflow-y-auto">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-secondary/50 transition-colors ${
                  currentLang === lang.code ? "bg-primary/10" : ""
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-foreground">{lang.nativeName}</span>
                  <span className="text-xs text-muted-foreground">{lang.englishName}</span>
                </div>
                {currentLang === lang.code && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
              </button>
            ))}
            {filteredLanguages.length === 0 && (
              <div className="px-3 py-4 text-sm text-muted-foreground text-center">No languages found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
