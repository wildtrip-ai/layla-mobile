import { Header } from "@/components/Header";
import { SettingsSidebar } from "./SettingsSidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/hooks/useLanguage";
import { User, Bell, Crown } from "lucide-react";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const tabItems = [
  { id: "profile", label: "Profile", icon: User, path: "/settings/profile" },
  { id: "notifications", label: "Notifications", icon: Bell, path: "/settings/notifications" },
  { id: "subscription", label: "Plan", icon: Crown, path: "/settings/subscription" },
];

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useLanguage();

  const getActiveTab = () => {
    if (location.pathname.includes("/settings/profile")) return "profile";
    if (location.pathname.includes("/settings/notifications")) return "notifications";
    if (location.pathname.includes("/settings/subscription")) return "subscription";
    return "profile";
  };

  const activeTab = getActiveTab();

  const handleTabChange = (path: string) => {
    navigate(`/${lang}${path}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4">
          {/* Two Column Layout - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-[340px_1fr] gap-6">
            {/* Settings Sidebar */}
            <SettingsSidebar />

            {/* Content Area */}
            <div>{children}</div>
          </div>

          {/* Mobile Layout - Tabs navigation */}
          <div className="lg:hidden space-y-6">
            {/* Mobile Tab Navigation */}
            <Tabs value={activeTab} onValueChange={(value) => {
              const item = tabItems.find(t => t.id === value);
              if (item) handleTabChange(item.path);
            }}>
              <TabsList className="w-full h-auto p-1 bg-secondary/50 rounded-full">
                {tabItems.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="flex-1 rounded-full py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Content */}
            <div>{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
