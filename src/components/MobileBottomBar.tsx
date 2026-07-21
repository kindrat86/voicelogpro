import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Mic, Unlock, Globe } from "lucide-react";
import { vibrate } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export const MobileBottomBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isPlans = location.pathname === "/crew-plan";
  const { t } = useTranslation();

  const handleMicClick = () => {
    vibrate();
    // Navigate to home and scroll to demo section
    if (location.pathname !== "/") {
      navigate("/#demo");
    } else {
      document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t border-border"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-end justify-around px-4 py-2">
        {/* Home */}
        <Link
          to="/"
          onClick={vibrate}
          className={`flex flex-col items-center justify-center min-h-[60px] min-w-[60px] px-2 py-2 transition-colors touch-manipulation ${
            isHome 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium mt-1">{t("nav.home", "Home")}</span>
        </Link>

        {/* Center Mic FAB */}
        <button
          onClick={handleMicClick}
          className="flex items-center justify-center w-16 h-16 -mt-6 bg-primary text-primary-foreground rounded-full shadow-lg active:scale-95 transition-transform duration-100 touch-manipulation"
          aria-label="Record voice log"
        >
          <Mic className="w-7 h-7" />
        </button>

        {/* Plans */}
        <Link
          to="/crew-plan"
          onClick={vibrate}
          className={`flex flex-col items-center justify-center min-h-[60px] min-w-[60px] px-2 py-2 transition-colors touch-manipulation ${
            isPlans 
              ? "text-primary" 
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Unlock className="w-6 h-6" />
          <span className="text-xs font-medium mt-1">{t("nav.plans", "Plans")}</span>
        </Link>

        {/* Language Switcher (compact on mobile) */}
        <div className="flex flex-col items-center justify-center min-h-[60px] min-w-[60px] px-1 py-2">
          <LanguageSwitcher compact />
        </div>
      </div>
    </nav>
  );
};
