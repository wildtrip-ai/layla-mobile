import { motion } from "framer-motion";
import { Crown, CreditCard, Receipt, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/lib/auth";

interface SubscriptionSettingsProps {
  profile: UserProfile | null;
  isLoading: boolean;
}

export function SubscriptionSettings({ profile, isLoading }: SubscriptionSettingsProps) {

  // Format subscription tier for display
  const formatTier = (tier: string) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  // Check if subscription is premium
  const isPremium = profile?.subscription_tier !== "free";

  // Format expiration date
  const formatExpirationDate = (date: string | null) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
        <h1 className="font-serif text-2xl font-bold text-foreground">Manage Subscription</h1>
        <p className="text-muted-foreground mt-1">View and manage your subscription plan</p>
      </div>

      {/* Current Plan Card */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${isPremium ? "bg-gradient-to-br from-amber-400 to-amber-600" : "bg-primary/10"} flex items-center justify-center`}>
              <Crown className={`h-6 w-6 ${isPremium ? "text-white" : "text-primary"}`} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {profile ? formatTier(profile.subscription_tier) : "Free"} Plan
              </h2>
              <p className="text-muted-foreground">
                {isPremium ? "Premium features unlocked" : "Basic features included"}
              </p>
              {isPremium && profile?.subscription_expires_at && (
                <p className="text-sm text-muted-foreground mt-1">
                  Expires {formatExpirationDate(profile.subscription_expires_at)}
                </p>
              )}
            </div>
          </div>
          {!isPremium && (
            <Button className="rounded-full">
              Upgrade to Premium
            </Button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">What's included:</h3>
          <ul className="space-y-2 text-foreground">
            {isPremium ? (
              <>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Unlimited trips
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Advanced AI trip planning
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Priority support
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Exclusive deals and offers
                </li>
              </>
            ) : (
              <>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Up to 3 trips per month
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Basic AI trip suggestions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Email support
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0 px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-foreground font-medium">Payment Method</h3>
              <p className="text-sm text-muted-foreground">No payment method added</p>
            </div>
          </div>
          <Button variant="outline" className="rounded-full">
            Add Payment Method
          </Button>
        </div>
      </div>

      {/* Billing History Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-foreground font-medium">Billing History</h3>
          </div>
        </div>
        <div className="px-6 py-8 text-center">
          <p className="text-muted-foreground">No billing history available</p>
        </div>
      </div>
    </motion.div>
  );
}
