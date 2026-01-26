import { motion } from "framer-motion";
import { User, Bell, Crown, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";

export type SettingsSection = "profile" | "notifications" | "subscription";

const menuItems: { id: SettingsSection; label: string; icon: React.ElementType; path: string }[] = [
  { id: "profile", label: "Profile", icon: User, path: "/settings/profile" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/settings/notifications" },
  { id: "subscription", label: "Manage Subscription", icon: Crown, path: "/settings/subscription" },
];

export function SettingsSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  const getActiveSection = (): SettingsSection => {
    if (location.pathname.includes("/settings/profile")) return "profile";
    if (location.pathname.includes("/settings/notifications")) return "notifications";
    if (location.pathname.includes("/settings/subscription")) return "subscription";
    return "profile";
  };

  const activeSection = getActiveSection();

  const handleNavigate = (path: string) => {
    navigate(`/${lang}${path}`);
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card rounded-2xl border border-border shadow-lg h-[calc(100vh-180px)] sticky top-24 overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-foreground">Settings</h2>
            <p className="text-xs text-muted-foreground">Manage your account</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </motion.aside>
  );
}
