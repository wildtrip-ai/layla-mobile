import { useEffect } from "react";
import { onUnauthorized } from "@/lib/apiClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLoginDialog } from "@/contexts/LoginDialogContext";

/**
 * Hook that listens for 401 unauthorized responses and handles them
 * by logging out the user and opening the login dialog
 */
export function useAuthInterceptor() {
  const { logout, isAuthenticated } = useAuth();
  const { setLoginDialogOpen } = useLoginDialog();

  useEffect(() => {
    const unsubscribe = onUnauthorized(() => {
      // Only logout if user was authenticated
      if (isAuthenticated) {
        logout();
      }
      // Open the login dialog
      setLoginDialogOpen(true);
    });

    return unsubscribe;
  }, [logout, isAuthenticated, setLoginDialogOpen]);
}
