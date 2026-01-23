import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, LogIn, Plus, Crown, Settings, HelpCircle, MessageSquare, FileText } from "lucide-react";
import { LoginDialog } from "@/components/auth/LoginDialog";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4 md:px-6 pointer-events-none">
      <div className="container mx-auto flex items-center justify-between pointer-events-auto [&>*]:pointer-events-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-card shadow-lg flex items-center justify-center overflow-hidden">
            <span className="text-lg">🧭</span>
          </div>
          <span className="text-xl font-serif font-bold text-card">Voyager.</span>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2">
          {/* Settings pills */}
          <div className="hidden sm:flex items-center bg-card/90 backdrop-blur-sm rounded-full px-1 py-1 shadow-lg">
            <button className="px-3 py-1.5 text-sm text-foreground hover:bg-secondary rounded-full transition-colors">
              $
            </button>
            <button className="px-3 py-1.5 text-sm bg-secondary text-foreground rounded-full transition-colors">
              🇺🇸
            </button>
            <button className="px-3 py-1.5 text-sm text-foreground hover:bg-secondary rounded-full transition-colors">
              °C
            </button>
          </div>

          {/* User menu */}
          <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="hero-outline" size="icon" className="rounded-full h-10 w-10">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuItem 
                className="gap-3 py-3"
                onClick={() => setLoginDialogOpen(true)}
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3">
                <Plus className="h-4 w-4" />
                <span>New Trip</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3">
                <Crown className="h-4 w-4" />
                <span>Manage Subscription</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Login Dialog */}
      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
    </header>
  );
}
