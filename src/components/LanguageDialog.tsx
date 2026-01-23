import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface LanguageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", flag: "🇦🇪" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
];

export function LanguageDialog({
  open,
  onOpenChange,
  selectedLanguage,
  onSelectLanguage,
}: LanguageDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  const handleSelectLanguage = (code: string) => {
    onSelectLanguage(code);
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
            className="fixed inset-0 z-50 bg-black/60"
            onClick={handleClose}
          />

          {/* Dialog - centered horizontally and vertically */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
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
                Choose language
              </h2>

              {/* Languages grid */}
              <div className="grid grid-cols-2 gap-4">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                      selectedLanguage === lang.code
                        ? "border-2 border-foreground bg-secondary/50"
                        : "border border-transparent hover:bg-secondary/50"
                    }`}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium text-foreground">{lang.name}</span>
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
