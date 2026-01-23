import { useState } from "react";
import { Star, Check, ChevronDown, ChevronUp } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PremiumUpgradeDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const benefits = [
  "Know your trip works - before you go",
  "Exclusive member-only prices",
];

type PlanType = "trial" | "annual" | "monthly";

interface PlanOption {
  id: PlanType;
  title: string;
  subtitle?: string;
  price?: string;
  originalPrice?: string;
}

const mainPlans: PlanOption[] = [
  {
    id: "trial",
    title: "Start with a free 3-day trial",
    subtitle: "Cancel anytime",
  },
  {
    id: "annual",
    title: "Annual",
    price: "83.29",
    originalPrice: "166.58",
  },
];

const otherPlan: PlanOption = {
  id: "monthly",
  title: "Monthly",
  price: "166.58",
};

export function PremiumUpgradeDrawer({
  open,
  onOpenChange,
}: PremiumUpgradeDrawerProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>("trial");
  const [showOtherOption, setShowOtherOption] = useState(false);

  const handleUnlock = () => {
    // Future: Handle subscription logic
    console.log("Unlocking with plan:", selectedPlan);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-md px-6 pb-8">
          <DrawerHeader className="text-center px-0 pt-6">
            <DrawerTitle className="text-2xl font-serif text-foreground">
              Unlock Your Full Trip
            </DrawerTitle>
            <DrawerDescription className="text-muted-foreground mt-2">
              Continue with Premium for unlimited planning and exclusive savings.
            </DrawerDescription>
          </DrawerHeader>

          {/* Benefits Section */}
          <div className="lavender-surface rounded-xl p-4 mt-4 space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <Star className="h-5 w-5 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          {/* Plan Selection */}
          <RadioGroup
            value={selectedPlan}
            onValueChange={(value) => setSelectedPlan(value as PlanType)}
            className="mt-6 space-y-3"
          >
            {mainPlans.map((plan) => (
              <label
                key={plan.id}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors",
                  selectedPlan === plan.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="relative mt-0.5">
                  <RadioGroupItem value={plan.id} className="sr-only" />
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedPlan === plan.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {selectedPlan === plan.id && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {plan.title}
                    </span>
                    {plan.price && (
                      <div className="text-right">
                        <span className="font-semibold text-foreground">
                          ${plan.price}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {" "}
                          /month
                        </span>
                      </div>
                    )}
                  </div>
                  {plan.subtitle && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {plan.subtitle}
                    </p>
                  )}
                  {plan.originalPrice && (
                    <p className="text-sm text-muted-foreground mt-0.5">
                      <span className="line-through">${plan.originalPrice}</span>
                      <span className="text-green-600 ml-2">Save 50%</span>
                    </p>
                  )}
                </div>
              </label>
            ))}

            {/* Show Other Option Toggle */}
            <button
              type="button"
              onClick={() => setShowOtherOption(!showOtherOption)}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-full justify-center py-2"
            >
              <span>Show other option</span>
              {showOtherOption ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {/* Monthly Plan (Collapsible) */}
            {showOtherOption && (
              <label
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors animate-fade-in",
                  selectedPlan === otherPlan.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="relative mt-0.5">
                  <RadioGroupItem value={otherPlan.id} className="sr-only" />
                  <div
                    className={cn(
                      "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                      selectedPlan === otherPlan.id
                        ? "border-primary bg-primary"
                        : "border-muted-foreground"
                    )}
                  >
                    {selectedPlan === otherPlan.id && (
                      <Check className="h-3 w-3 text-primary-foreground" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {otherPlan.title}
                    </span>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">
                        ${otherPlan.price}
                      </span>
                      <span className="text-muted-foreground text-sm">
                        {" "}
                        /month
                      </span>
                    </div>
                  </div>
                </div>
              </label>
            )}
          </RadioGroup>

          {/* CTA Button */}
          <Button
            variant="hero"
            size="lg"
            className="w-full mt-6"
            onClick={handleUnlock}
          >
            Unlock now
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
