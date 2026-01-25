import { useState } from "react";
import { Header } from "@/components/Header";
import { SettingsSidebar, SettingsSection } from "@/components/settings/SettingsSidebar";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SubscriptionSettings } from "@/components/settings/SubscriptionSettings";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Bell, Crown } from "lucide-react";

export default function Settings() {
  const [activeSection, setActiveSection] = useState<SettingsSection>("profile");

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return <ProfileSettings />;
      case "notifications":
        return <NotificationSettings />;
      case "subscription":
        return <SubscriptionSettings />;
      default:
        return <ProfileSettings />;
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
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
            />

            {/* Content Area */}
            <div>{renderContent()}</div>
          </div>

          {/* Mobile Layout - Tabs navigation */}
          <div className="lg:hidden space-y-6">
            {/* Mobile Tab Navigation */}
            <Tabs
              value={activeSection}
              onValueChange={(value) => setActiveSection(value as SettingsSection)}
              className="w-full"
            >
              <TabsList className="w-full h-auto p-1 bg-secondary/50 rounded-full">
                <TabsTrigger
                  value="profile"
                  className="flex-1 rounded-full py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="notifications"
                  className="flex-1 rounded-full py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger
                  value="subscription"
                  className="flex-1 rounded-full py-2.5 data-[state=active]:bg-card data-[state=active]:shadow-sm"
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Plan
                </TabsTrigger>
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
