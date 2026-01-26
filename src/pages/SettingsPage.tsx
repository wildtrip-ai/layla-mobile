import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { SettingsSidebar, type SettingsSection } from "@/components/settings/SettingsSidebar";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SubscriptionSettings } from "@/components/settings/SubscriptionSettings";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Crown } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

const tabItems: Array<{ id: SettingsSection; label: string; icon: React.ElementType }> = [
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "subscription", label: "Plan", icon: Crown },
];

export default function SettingsPage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<SettingsSection>("profile");
  const { profile, isLoading } = useUserProfile();

  useEffect(() => {
    // Determine active tab based on URL path
    if (location.pathname.includes("/settings/notifications")) {
      setActiveTab("notifications");
    } else if (location.pathname.includes("/settings/subscription")) {
      setActiveTab("subscription");
    } else {
      setActiveTab("profile");
    }
  }, [location.pathname]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings profile={profile} isLoading={isLoading} />;
      case "notifications":
        return <NotificationSettings profile={profile} isLoading={isLoading} />;
      case "subscription":
        return <SubscriptionSettings profile={profile} isLoading={isLoading} />;
      default:
        return <ProfileSettings profile={profile} isLoading={isLoading} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-24">
        <div className="container mx-auto px-4">
          {/* Two Column Layout - Desktop */}
          <div className="hidden lg:grid lg:grid-cols-[340px_1fr] gap-6">
            {/* Settings Sidebar */}
            <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Content Area */}
            <div>{renderContent()}</div>
          </div>

          {/* Mobile Layout - Tabs navigation */}
          <div className="lg:hidden space-y-6">
            {/* Mobile Tab Navigation */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
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
            <div>{renderContent()}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
