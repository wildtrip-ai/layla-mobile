import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUserProfile } from "@/hooks/useUserProfile";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export function NotificationSettings() {
  const { profile, isLoading } = useUserProfile();
  const [settings, setSettings] = useState<NotificationSetting[]>([]);

  // Update settings when profile data is loaded
  useEffect(() => {
    if (profile) {
      setSettings([
        {
          id: "email",
          label: "Email Notifications",
          description: "Receive updates and alerts via email",
          enabled: profile.email_notifications,
        },
        {
          id: "push",
          label: "Push Notifications",
          description: "Receive push notifications on your device",
          enabled: profile.push_notifications,
        },
        {
          id: "reminders",
          label: "Trip Reminders",
          description: "Get reminded about upcoming trips",
          enabled: profile.trip_reminders,
        },
        {
          id: "promo",
          label: "Promotional Offers",
          description: "Receive special deals and offers",
          enabled: profile.marketing_notifications,
        },
      ]);
    }
  }, [profile]);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Section Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-1">Manage how you receive notifications</p>
      </div>

      {/* Notification Settings Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {settings.map((setting, index) => (
          <div
            key={setting.id}
            className={`flex items-center justify-between px-6 py-4 ${
              index < settings.length - 1 ? "border-b border-border" : ""
            }`}
          >
            <div className="flex-1">
              <h3 className="text-foreground font-medium">{setting.label}</h3>
              <p className="text-sm text-muted-foreground">{setting.description}</p>
            </div>
            <Switch
              checked={setting.enabled}
              onCheckedChange={() => toggleSetting(setting.id)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
