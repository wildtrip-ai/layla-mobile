import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { updateNotificationSettings, getStoredToken } from "@/lib/auth";
import type { UserProfile } from "@/lib/auth";

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface NotificationSettingsProps {
  profile: UserProfile | null;
  isLoading: boolean;
}

export function NotificationSettings({ profile, isLoading }: NotificationSettingsProps) {
  const [settings, setSettings] = useState<NotificationSetting[]>([]);
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(new Set());
  const { refreshUserProfile } = useAuth();

  // Mapping from setting id to API field name
  const settingToApiField: Record<string, keyof typeof updateNotificationSettings> = {
    email: "email_notifications",
    push: "push_notifications",
    reminders: "trip_reminders",
    promo: "marketing_notifications",
  };

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

  const toggleSetting = async (id: string) => {
    const setting = settings.find((s) => s.id === id);
    if (!setting) return;

    // Update local state optimistically
    setSettings((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      )
    );

    // Mark as updating
    setUpdatingIds((prev) => new Set(prev).add(id));

    try {
      const token = getStoredToken();
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        // Revert local state on auth error
        setSettings((prev) =>
          prev.map((s) =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
          )
        );
        return;
      }

      const apiField = settingToApiField[id] as keyof Parameters<typeof updateNotificationSettings>[1];
      const newValue = !setting.enabled;

      await updateNotificationSettings(token, {
        [apiField]: newValue,
      });

      toast.success("Notification settings updated");
      await refreshUserProfile();
    } catch (error) {
      toast.error("Failed to update notification settings");
      // Revert local state on error
      setSettings((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, enabled: !s.enabled } : s
        )
      );
    } finally {
      setUpdatingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
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
              disabled={updatingIds.has(setting.id)}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
