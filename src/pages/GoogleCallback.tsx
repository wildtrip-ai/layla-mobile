import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Loader2, XCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { handleGoogleCallback, fetchCurrentUser, AuthUser } from "@/lib/auth";
import { toast } from "@/hooks/use-toast";

type CallbackStatus = "loading" | "success" | "error";

export default function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  useEffect(() => {
    async function handleGoogleAuth() {
      // Check for OAuth error
      if (error) {
        setStatus("error");
        setErrorMessage("Google authentication was cancelled or failed.");
        return;
      }

      if (!code) {
        setStatus("error");
        setErrorMessage("Invalid callback. Missing authorization code.");
        return;
      }

      try {
        // Exchange code for access token
        const callbackResponse = await handleGoogleCallback(code, state);

        // Fetch the full user profile
        const profileResponse = await fetchCurrentUser(callbackResponse.access_token);

        // Combine user data from both responses
        const combinedUser: AuthUser = {
          id: callbackResponse.user.id,
          email: callbackResponse.user.email,
          name: callbackResponse.user.name,
          first_name: profileResponse.first_name,
          last_name: profileResponse.last_name,
          default_account_id: profileResponse.default_account_id,
        };

        // Store token and user in auth context
        login(callbackResponse.access_token, combinedUser);

        setStatus("success");

        toast({
          title: "Welcome!",
          description: `Signed in as ${combinedUser.first_name || combinedUser.email}`,
        });

        // Redirect to home after a brief delay
        setTimeout(() => {
          // Detect browser language for redirect
          const browserLang = navigator.language.split("-")[0];
          const supportedLangs = ["en", "ar"];
          const lang = supportedLangs.includes(browserLang) ? browserLang : "en";
          navigate(`/${lang}/`, { replace: true });
        }, 1500);

      } catch (error) {
        setStatus("error");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again."
        );
      }
    }

    handleGoogleAuth();
  }, [code, state, error, login, navigate]);

  const handleTryAgain = () => {
    const browserLang = navigator.language.split("-")[0];
    const supportedLangs = ["en", "ar"];
    const lang = supportedLangs.includes(browserLang) ? browserLang : "en";
    navigate(`/${lang}/`, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md mx-auto">
        {status === "loading" && (
          <div className="space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <h1 className="text-xl font-semibold text-foreground">
              Signing you in with Google...
            </h1>
            <p className="text-muted-foreground">
              Please wait while we complete the authentication.
            </p>
          </div>
        )}

        {status === "success" && (
          <div className="space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h1 className="text-xl font-semibold text-foreground">
              Successfully signed in!
            </h1>
            <p className="text-muted-foreground">
              Redirecting you to the app...
            </p>
          </div>
        )}

        {status === "error" && (
          <div className="space-y-6">
            <XCircle className="h-12 w-12 text-destructive mx-auto" />
            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-foreground">
                Unable to sign in
              </h1>
              <p className="text-muted-foreground">
                {errorMessage}
              </p>
            </div>
            <Button onClick={handleTryAgain} className="mt-4">
              Try signing in again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
