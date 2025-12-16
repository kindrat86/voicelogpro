import { Link, useLocation } from "react-router-dom";
import { Home, Mic, Unlock } from "lucide-react";
import { vibrate } from "@/lib/utils";

export const MobileBottomBar = () => {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isPlans = location.pathname === "/crew-plan";

  const handleMicClick = () => {
    vibrate();
    // Future: navigate to recording flow
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
          <span className="text-xs font-medium mt-1">Home</span>
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
          <span className="text-xs font-medium mt-1">Plans</span>
        </Link>
      </div>
    </nav>
  );
};
