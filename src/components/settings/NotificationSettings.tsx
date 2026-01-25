import { useState } from "react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const defaultSettings: NotificationSetting[] = [
  {
    id: "email",
    label: "Email Notifications",
    description: "Receive updates and alerts via email",
    enabled: true,
  },
  {
    id: "push",
    label: "Push Notifications",
    description: "Receive push notifications on your device",
    enabled: true,
  },
  {
    id: "reminders",
    label: "Trip Reminders",
    description: "Get reminded about upcoming trips",
    enabled: true,
  },
  {
    id: "promo",
    label: "Promotional Offers",
    description: "Receive special deals and offers",
    enabled: false,
  },
];

export function NotificationSettings() {
  const [settings, setSettings] = useState(defaultSettings);

  const toggleSetting = (id: string) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
      )
    );
  };

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
