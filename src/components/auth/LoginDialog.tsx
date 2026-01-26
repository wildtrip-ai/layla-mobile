import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getGoogleAuthUrl } from "@/lib/auth";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Social login icons as inline SVGs
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [email, setEmail] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleClose = () => {
    onOpenChange(false);
    // Reset state when closing
    setTimeout(() => {
      setIsSuccess(false);
      setEmail("");
    }, 300);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("https://internal-api.emiratesescape.com/v1.0/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (response.status === 201) {
        setIsSuccess(true);
        toast.success("Magic link sent! Check your email.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.message || "Failed to send magic link. Please try again.");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);

    try {
      const authUrl = await getGoogleAuthUrl();
      // Redirect to Google OAuth consent screen
      window.location.href = authUrl;
    } catch (error) {
      console.error("Google sign in error:", error);
      toast.error("Failed to initiate Google sign-in. Please try again.");
      setIsGoogleLoading(false);
    }
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
            <div className="flex overflow-hidden rounded-3xl bg-card shadow-2xl max-h-[90vh] max-w-4xl w-full">
              {/* Left Panel - Form */}
              <div className="flex-1 p-8 md:p-10 overflow-y-auto">
                <div className="mx-auto max-w-sm">
                  <h2 className="text-center font-serif text-3xl font-bold mb-2">
                    {isSignUp ? "Sign Up" : "Sign In"}
                  </h2>
                  
                  <p className="text-center text-muted-foreground mb-6">
                    {isSignUp ? "Already have an account? " : "New to Voyager? "}
                    <button
                      type="button"
                      onClick={() => setIsSignUp(!isSignUp)}
                      className="underline text-foreground hover:text-primary transition-colors"
                    >
                      {isSignUp ? "Sign in" : "Sign up"}
                    </button>
                  </p>

                  {isSuccess ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="flex justify-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                      </div>
                      <h3 className="text-xl font-medium">Check your email</h3>
                      <p className="text-muted-foreground">
                        We've sent a magic link to <strong>{email}</strong>
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => {
                          setIsSuccess(false);
                          setEmail("");
                        }}
                      >
                        Use a different email
                      </Button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="rounded-full px-5 py-6 border-border"
                        disabled={isLoading}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full rounded-full py-6"
                        variant="hero"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          "Send Magic Link"
                        )}
                      </Button>
                    </form>
                  )}

                  {!isSuccess && (
                    <>
                      {/* Divider */}
                      <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-card px-2 text-muted-foreground">or</span>
                        </div>
                      </div>

                      {/* Social Login Buttons */}
                      <div className="space-y-3">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full rounded-full py-6 gap-3 justify-start px-5"
                          disabled={isLoading || isGoogleLoading}
                          onClick={handleGoogleSignIn}
                        >
                          {isGoogleLoading ? (
                            <>
                              <Loader2 className="h-5 w-5 animate-spin" />
                              <span>Connecting...</span>
                            </>
                          ) : (
                            <>
                              <GoogleIcon />
                              <span>Continue with Google</span>
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full rounded-full py-6 gap-3 justify-start px-5"
                          disabled={isLoading}
                        >
                          <AppleIcon />
                          <span>Continue with Apple</span>
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full rounded-full py-6 gap-3 justify-start px-5"
                          disabled={isLoading}
                        >
                          <FacebookIcon />
                          <span>Continue with Facebook</span>
                        </Button>
                      </div>

                      {/* Terms */}
                      <p className="text-center text-xs text-muted-foreground mt-6">
                        By signing up, you agree to our{" "}
                        <a href="#" className="underline hover:text-foreground">Terms of service</a>
                        {" "}and{" "}
                        <a href="#" className="underline hover:text-foreground">Privacy Policy</a>.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Right Panel - Image/Character */}
              <div className="hidden md:flex relative w-80 bg-sky-400 flex-col items-center justify-end p-6">
                {/* Close button */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                >
                  <X className="h-5 w-5 text-foreground" />
                </button>

                {/* Speech bubble */}
                <div className="relative bg-white rounded-2xl p-4 mb-6 shadow-lg max-w-[200px]">
                  <p className="text-sm text-foreground">
                    Here's the tea, sign up for a free account and, voilà, we'll continue chatting.
                  </p>
                  {/* Speech bubble tail */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45" />
                </div>

                {/* Character placeholder - using emoji for now */}
                <div className="text-8xl mb-4">👩‍💻</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
