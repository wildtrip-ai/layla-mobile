import { createContext, useContext, useState, ReactNode } from "react";

interface SelectionDialogsContextType {
  languageDialogOpen: boolean;
  setLanguageDialogOpen: (open: boolean) => void;
  currencyDialogOpen: boolean;
  setCurrencyDialogOpen: (open: boolean) => void;
  selectedCurrency: string;
  setSelectedCurrency: (currency: string) => void;
}

const SelectionDialogsContext = createContext<SelectionDialogsContextType | undefined>(undefined);

export function SelectionDialogsProvider({ children }: { children: ReactNode }) {
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("usd");

  return (
    <SelectionDialogsContext.Provider
      value={{
        languageDialogOpen,
        setLanguageDialogOpen,
        currencyDialogOpen,
        setCurrencyDialogOpen,
        selectedCurrency,
        setSelectedCurrency,
      }}
    >
      {children}
    </SelectionDialogsContext.Provider>
  );
}

export function useSelectionDialogs() {
  const context = useContext(SelectionDialogsContext);
  if (!context) {
    throw new Error("useSelectionDialogs must be used within SelectionDialogsProvider");
  }
  return context;
}
