import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface SelectionItem {
  code: string;
  name: string;
  icon: string;
}

interface SelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: SelectionItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

export function SelectionDialog({
  open,
  onOpenChange,
  title,
  items,
  selectedValue,
  onSelect,
}: SelectionDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSelect = (code: string) => {
    onSelect(code);
    onOpenChange(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/60"
            onClick={handleClose}
          />

          {/* Dialog - centered horizontally and vertically */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-lg bg-card rounded-3xl shadow-2xl p-8">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-10 h-10 rounded-lg border border-border flex items-center justify-center hover:bg-secondary transition-colors"
              >
                <X className="h-5 w-5 text-foreground" />
              </button>

              {/* Title */}
              <h2 className="font-serif text-2xl font-bold mb-8">
                {title}
              </h2>

              {/* Items grid */}
              <div className="grid grid-cols-2 gap-4">
                {items.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleSelect(item.code)}
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                      selectedValue === item.code
                        ? "border-2 border-foreground bg-secondary/50"
                        : "border border-transparent hover:bg-secondary/50"
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium text-foreground">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Language data
export const languages = [
  { code: "en", name: "English", icon: "🇺🇸" },
  { code: "es", name: "Spanish", icon: "🇪🇸" },
  { code: "fr", name: "French", icon: "🇫🇷" },
  { code: "it", name: "Italian", icon: "🇮🇹" },
  { code: "zh", name: "Chinese", icon: "🇨🇳" },
  { code: "de", name: "German", icon: "🇩🇪" },
  { code: "pt", name: "Portuguese", icon: "🇵🇹" },
  { code: "ru", name: "Russian", icon: "🇷🇺" },
  { code: "ar", name: "Arabic", icon: "🇦🇪" },
  { code: "pl", name: "Polish", icon: "🇵🇱" },
];

// Currency data
export const currencies = [
  { code: "usd", name: "US Dollar", icon: "$" },
  { code: "eur", name: "Euro", icon: "€" },
  { code: "gbp", name: "British Pound", icon: "£" },
  { code: "jpy", name: "Japanese Yen", icon: "¥" },
  { code: "cad", name: "Canadian Dollar", icon: "C$" },
  { code: "aud", name: "Australian Dollar", icon: "A$" },
  { code: "chf", name: "Swiss Franc", icon: "Fr" },
  { code: "cny", name: "Chinese Yuan", icon: "¥" },
  { code: "inr", name: "Indian Rupee", icon: "₹" },
  { code: "krw", name: "Korean Won", icon: "₩" },
];
