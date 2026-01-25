import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SelectionDialog, languages, currencies } from "@/components/SelectionDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Mock user data - replace with real auth later
const mockUser = {
  firstName: "Cooper",
  lastName: "Al",
  email: "cooper@gmail.com",
  initials: "C"
};

export function ProfileSettings() {
  const [firstName, setFirstName] = useState(mockUser.firstName);
  const [lastName, setLastName] = useState(mockUser.lastName);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false);

  const currentLanguage = languages.find(l => l.code === selectedLanguage);
  const currentCurrency = currencies.find(c => c.code === selectedCurrency);

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log("Account deletion requested");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Section Title */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-foreground">Profile</h1>
        <p className="text-muted-foreground mt-1">Manage your personal information</p>
      </div>

      {/* User Header Card */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
              {mockUser.initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              {firstName} {lastName}
            </h2>
            <p className="text-muted-foreground">{mockUser.email}</p>
          </div>
        </div>
      </div>

      {/* Profile Fields Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* First Name */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <label className="text-foreground font-medium">First Name</label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-48 text-right rounded-full border-border bg-secondary/50"
          />
        </div>

        {/* Last Name */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <label className="text-foreground font-medium">Last Name</label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-48 text-right rounded-full border-border bg-secondary/50"
          />
        </div>

        {/* Email (Read-only) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <label className="text-foreground font-medium">Email</label>
          <span className="text-muted-foreground">{mockUser.email}</span>
        </div>

        {/* Currency Selector */}
        <button
          onClick={() => setCurrencyDialogOpen(true)}
          className="w-full flex items-center justify-between px-6 py-4 border-b border-border hover:bg-secondary/30 transition-colors"
        >
          <span className="text-foreground font-medium">Currency</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {currentCurrency?.icon} {currentCurrency?.name}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </button>

        {/* Language Selector */}
        <button
          onClick={() => setLanguageDialogOpen(true)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-secondary/30 transition-colors"
        >
          <span className="text-foreground font-medium">Language</span>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">
              {currentLanguage?.icon} {currentLanguage?.name}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </button>
      </div>

      {/* Delete Account Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h3 className="text-foreground font-medium">Delete Account</h3>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all data
            </p>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  account and remove all of your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Language Dialog */}
      <SelectionDialog
        open={languageDialogOpen}
        onOpenChange={setLanguageDialogOpen}
        title="Choose language"
        items={languages}
        selectedValue={selectedLanguage}
        onSelect={setSelectedLanguage}
      />

      {/* Currency Dialog */}
      <SelectionDialog
        open={currencyDialogOpen}
        onOpenChange={setCurrencyDialogOpen}
        title="Choose currency"
        items={currencies}
        selectedValue={selectedCurrency}
        onSelect={setSelectedCurrency}
      />
    </motion.div>
  );
}
