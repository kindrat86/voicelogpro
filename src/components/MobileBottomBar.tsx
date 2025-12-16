import { Link, useLocation } from "react-router-dom";
import { Home, FileText, BookOpen, Users, Unlock } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/solutions/texas-mechanics-lien-compliance", label: "Solutions", icon: FileText },
  { path: "/blog", label: "Blog", icon: BookOpen },
  { path: "/crew-plan", label: "Get Started", icon: Unlock, primary: true },
];

export const MobileBottomBar = () => {
  const location = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-background/95 backdrop-blur-sm border-t border-border pb-[env(safe-area-inset-bottom)]"
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path !== "/" && location.pathname.startsWith(item.path.split("/").slice(0, 2).join("/")));
          const Icon = item.icon;

          if (item.primary) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center justify-center min-h-[60px] px-4 py-2 bg-primary text-primary-foreground rounded-t-xl -mt-2 shadow-lg"
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center min-h-[60px] px-4 py-2 transition-colors ${
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
