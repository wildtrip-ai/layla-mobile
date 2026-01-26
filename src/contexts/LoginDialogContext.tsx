import { createContext, useContext, useState, ReactNode } from "react";

interface LoginDialogContextType {
  loginDialogOpen: boolean;
  setLoginDialogOpen: (open: boolean) => void;
  openLoginDialog: () => void;
  closeLoginDialog: () => void;
}

const LoginDialogContext = createContext<LoginDialogContextType | undefined>(undefined);

export function LoginDialogProvider({ children }: { children: ReactNode }) {
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  const openLoginDialog = () => setLoginDialogOpen(true);
  const closeLoginDialog = () => setLoginDialogOpen(false);

  return (
    <LoginDialogContext.Provider
      value={{
        loginDialogOpen,
        setLoginDialogOpen,
        openLoginDialog,
        closeLoginDialog,
      }}
    >
      {children}
    </LoginDialogContext.Provider>
  );
}

export function useLoginDialog() {
  const context = useContext(LoginDialogContext);
  if (context === undefined) {
    throw new Error("useLoginDialog must be used within a LoginDialogProvider");
  }
  return context;
}
