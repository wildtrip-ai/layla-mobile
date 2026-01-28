import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogIn, Plus, Crown, Settings, HelpCircle, MessageSquare, FileText, MapPin, LogOut, ChevronDown, Heart } from "lucide-react";
import { languages, currencies } from "@/components/SelectionDialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LocalizedLink } from "@/components/LocalizedLink";
import { useLanguage, SUPPORTED_LANGUAGES, SupportedLanguage } from "@/hooks/useLanguage";
import { useLoginDialog } from "@/contexts/LoginDialogContext";
import { useSelectionDialogs } from "@/contexts/SelectionDialogsContext";
import { useAuth } from "@/contexts/AuthContext";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const { effectiveLanguage, setLanguage } = useLanguage();
  const { openLoginDialog } = useLoginDialog();
  const { setCurrencyDialogOpen, setLanguageDialogOpen, selectedCurrency } = useSelectionDialogs();
  const { user, isAuthenticated, isProfileLoading, logout } = useAuth();

  // Derive display name and initials from auth user
  const displayName = user?.first_name || user?.name || user?.email?.split("@")[0] || "User";
  const userEmail = user?.email || "";
  const initials = displayName.charAt(0).toUpperCase();

  const currentLanguage = languages.find(l => l.code === effectiveLanguage);
  const currentCurrency = currencies.find(c => c.code === selectedCurrency);
  
  const handleSignOut = () => {
    logout();
    setIsOpen(false);
  };

  const handleLogin = () => {
    openLoginDialog();
    setIsOpen(false);
  };

  const handleNewTrip = () => {
    if (isAuthenticated) {
      navigate("/new-trip-planner");
    } else {
      openLoginDialog();
    }
    setIsOpen(false);
  };

  const handleLanguageSelect = (langCode: string) => {
    if (SUPPORTED_LANGUAGES.includes(langCode as SupportedLanguage)) {
      setLanguage(langCode as SupportedLanguage);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 pointer-events-none">
      <div className="container mx-auto flex items-center justify-between pointer-events-auto [&>*]:pointer-events-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <LocalizedLink to="/">
            <img src="/apple-touch-icon.png" alt="Emirates Escape Logo" className="h-10 object-contain" />
            <img src="/logo5.png" alt="Emirates Escape" className="h-10 object-contain" />
          </LocalizedLink>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Settings pills */}
          <div className="hidden sm:flex items-center bg-card/90 backdrop-blur-sm rounded-full px-1 py-1 shadow-lg">
            {isAuthenticated && isProfileLoading ? (
              <>
                <Skeleton className="w-10 h-8 rounded-full" />
                <Skeleton className="w-10 h-8 rounded-full" />
              </>
            ) : (
              <>
                <button
                  className="px-3 py-1.5 text-sm text-foreground hover:bg-secondary rounded-full transition-colors"
                  onClick={() => setCurrencyDialogOpen(true)}
                >
                  {currentCurrency?.icon || "$"}
                </button>
                <button
                  className="px-3 py-1.5 text-sm bg-secondary text-foreground rounded-full transition-colors"
                  onClick={() => setLanguageDialogOpen(true)}
                >
                  {currentLanguage?.icon || "🇺🇸"}
                </button>
              </>
            )}
          </div>

          {/* User menu */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              {isAuthenticated ? (
                <Button variant="ghost" className="rounded-full h-10 px-1 gap-1 bg-primary hover:bg-primary/90">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 text-primary-foreground" />
                </Button>
              ) : (
                <Button variant="hero-outline" size="icon" className="rounded-full h-10 w-10">
                  <User className="h-5 w-5" />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 mt-2">
              {isAuthenticated ? (
                <>
                  {/* User info header */}
                  <div className="flex items-center gap-3 px-3 py-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-medium">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{displayName}</span>
                      <span className="text-sm text-muted-foreground">{userEmail}</span>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <LocalizedLink to="/new-trip-planner">
                    <DropdownMenuItem className="gap-3 py-3">
                      <Plus className="h-4 w-4" />
                      <span>New Trip</span>
                    </DropdownMenuItem>
                  </LocalizedLink>
                  <LocalizedLink to="/my-trips">
                    <DropdownMenuItem className="gap-3 py-3">
                      <MapPin className="h-4 w-4" />
                      <span>My Trips</span>
                    </DropdownMenuItem>
                  </LocalizedLink>
                  <LocalizedLink to="/my-favorites">
                    <DropdownMenuItem className="gap-3 py-3">
                      <Heart className="h-4 w-4" />
                      <span>My Favorites</span>
                    </DropdownMenuItem>
                  </LocalizedLink>
                  <LocalizedLink to="/settings/subscription">
                    <DropdownMenuItem className="gap-3 py-3">
                      <Crown className="h-4 w-4" />
                      <span>Manage Subscription</span>
                    </DropdownMenuItem>
                  </LocalizedLink>
                  <LocalizedLink to="/settings/profile">
                    <DropdownMenuItem className="gap-3 py-3">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                  </LocalizedLink>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-3 py-3">
                    <HelpCircle className="h-4 w-4" />
                    <span>About</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 py-3">
                    <MessageSquare className="h-4 w-4" />
                    <span>Contact</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 py-3">
                    <FileText className="h-4 w-4" />
                    <span>Terms of service</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-3 py-3 text-destructive focus:text-destructive" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem className="gap-3 py-3" onClick={handleLogin}>
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 py-3" onClick={handleNewTrip}>
                    <Plus className="h-4 w-4" />
                    <span>New Trip</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-3 py-3">
                    <HelpCircle className="h-4 w-4" />
                    <span>About</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 py-3">
                    <MessageSquare className="h-4 w-4" />
                    <span>Contact</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-3 py-3">
                    <FileText className="h-4 w-4" />
                    <span>Terms of service</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
