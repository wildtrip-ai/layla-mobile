// Haptic feedback utility for mobile devices
// Uses the Web Vibration API for cross-platform support

type HapticStyle = "light" | "medium" | "heavy" | "success" | "warning" | "error" | "selection";

const hapticPatterns: Record<HapticStyle, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 30,
  success: [10, 50, 10],
  warning: [20, 50, 20],
  error: [30, 50, 30, 50, 30],
  selection: 5,
};

export function useHapticFeedback() {
  const isSupported = typeof navigator !== "undefined" && "vibrate" in navigator;

  const trigger = (style: HapticStyle = "light") => {
    if (!isSupported) return;
    
    try {
      const pattern = hapticPatterns[style];
      navigator.vibrate(pattern);
    } catch (error) {
      // Silently fail if vibration is not allowed
      console.debug("Haptic feedback not available:", error);
    }
  };

  const light = () => trigger("light");
  const medium = () => trigger("medium");
  const heavy = () => trigger("heavy");
  const success = () => trigger("success");
  const warning = () => trigger("warning");
  const error = () => trigger("error");
  const selection = () => trigger("selection");

  return {
    isSupported,
    trigger,
    light,
    medium,
    heavy,
    success,
    warning,
    error,
    selection,
  };
}
