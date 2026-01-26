import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Trash2, Camera, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SelectionDialog, languages, currencies } from "@/components/SelectionDialog";
import { ImageCropDialog } from "./ImageCropDialog";
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
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { updateUserName, updateUserProfile, getStoredToken } from "@/lib/auth";
import type { UserProfile } from "@/lib/auth";
import { updateStoredProfileData } from "@/lib/profileStorage";

interface ProfileSettingsProps {
  profile: UserProfile | null;
  isLoading: boolean;
}

export function ProfileSettings({ profile, isLoading }: ProfileSettingsProps) {
  const { user, refreshUserProfile } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [originalFirstName, setOriginalFirstName] = useState("");
  const [originalLastName, setOriginalLastName] = useState("");
  const [updatingFirstName, setUpdatingFirstName] = useState(false);
  const [updatingLastName, setUpdatingLastName] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [selectedCurrency, setSelectedCurrency] = useState("usd");
  const [languageDialogOpen, setLanguageDialogOpen] = useState(false);
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false);
  const [updatingLanguage, setUpdatingLanguage] = useState(false);
  const [updatingCurrency, setUpdatingCurrency] = useState(false);

  // Profile photo state
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update local state when profile data is loaded
  useEffect(() => {
    if (profile) {
      setSelectedLanguage(profile.language || "en");
      setSelectedCurrency(profile.currency || "usd");
      setProfilePhoto(profile.profile_photo_url);
    }
  }, [profile]);

  // Update name fields from auth user
  useEffect(() => {
    if (user) {
      const firstName = user.first_name || "";
      const lastName = user.last_name || "";
      setFirstName(firstName);
      setLastName(lastName);
      setOriginalFirstName(firstName);
      setOriginalLastName(lastName);
    }
  }, [user]);

  const currentLanguage = languages.find(l => l.code === selectedLanguage);
  const currentCurrency = currencies.find(c => c.code === selectedCurrency);

  const handleDeleteAccount = () => {
    // Handle account deletion
    console.log("Account deletion requested");
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 10MB",
        variant: "destructive",
      });
      return;
    }

    // Read file and open crop dialog
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setCropDialogOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset input so same file can be selected again
    e.target.value = "";
  };

  const handleCropComplete = (croppedImage: string) => {
    setProfilePhoto(croppedImage);
    toast({
      title: "Photo updated",
      description: "Your profile photo has been updated successfully.",
    });
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    toast({
      title: "Photo removed",
      description: "Your profile photo has been removed.",
    });
  };

  const handleFirstNameBlur = async () => {
    // Only update if the value has changed
    if (firstName === originalFirstName) return;

    const token = getStoredToken();
    if (!token) return;

    setUpdatingFirstName(true);
    try {
      await updateUserName(token, { first_name: firstName });
      setOriginalFirstName(firstName);
      await refreshUserProfile();
      toast({
        title: "Success",
        description: "Your first name has been updated.",
      });
    } catch (error) {
      // Revert to original value on error
      setFirstName(originalFirstName);
      toast({
        title: "Error",
        description: "Failed to update your first name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingFirstName(false);
    }
  };

  const handleLastNameBlur = async () => {
    // Only update if the value has changed
    if (lastName === originalLastName) return;

    const token = getStoredToken();
    if (!token) return;

    setUpdatingLastName(true);
    try {
      await updateUserName(token, { last_name: lastName });
      setOriginalLastName(lastName);
      await refreshUserProfile();
      toast({
        title: "Success",
        description: "Your last name has been updated.",
      });
    } catch (error) {
      // Revert to original value on error
      setLastName(originalLastName);
      toast({
        title: "Error",
        description: "Failed to update your last name. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingLastName(false);
    }
  };

  const handleLanguageChange = async (newLanguage: string) => {
    // Only update if the value has changed
    if (newLanguage === selectedLanguage) {
      setLanguageDialogOpen(false);
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    setUpdatingLanguage(true);
    try {
      await updateUserProfile(token, { language: newLanguage });
      setSelectedLanguage(newLanguage);

      // Update session storage with new language
      updateStoredProfileData({ language: newLanguage });

      await refreshUserProfile();
      setLanguageDialogOpen(false);
      toast({
        title: "Success",
        description: "Your language preference has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your language preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingLanguage(false);
    }
  };

  const handleCurrencyChange = async (newCurrency: string) => {
    // Only update if the value has changed
    if (newCurrency === selectedCurrency) {
      setCurrencyDialogOpen(false);
      return;
    }

    const token = getStoredToken();
    if (!token) return;

    setUpdatingCurrency(true);
    try {
      await updateUserProfile(token, { currency: newCurrency });
      setSelectedCurrency(newCurrency);

      // Update session storage with new currency
      updateStoredProfileData({ currency: newCurrency });

      await refreshUserProfile();
      setCurrencyDialogOpen(false);
      toast({
        title: "Success",
        description: "Your currency preference has been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update your currency preference. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingCurrency(false);
    }
  };

  // Get initials from current name
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "U";

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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

      {/* User Header Card with Photo Upload */}
      <div className="bg-card rounded-2xl border border-border p-6">
        <div className="flex items-center gap-4">
          {/* Avatar with upload button */}
          <div className="relative group">
            <Avatar className="h-20 w-20 ring-2 ring-border ring-offset-2 ring-offset-background">
              {profilePhoto ? (
                <AvatarImage src={profilePhoto} alt="Profile photo" />
              ) : null}
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Overlay button */}
            <button
              onClick={handlePhotoClick}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground">
              {firstName} {lastName}
            </h2>
            <p className="text-muted-foreground">{user?.email}</p>
            
            {/* Photo action buttons */}
            <div className="flex gap-2 mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="rounded-full text-xs h-7"
                onClick={handlePhotoClick}
              >
                <Camera className="h-3 w-3 mr-1" />
                {profilePhoto ? "Change photo" : "Add photo"}
              </Button>
              {profilePhoto && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full text-xs h-7 text-muted-foreground hover:text-destructive"
                  onClick={handleRemovePhoto}
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Fields Card */}
      <div className="bg-card rounded-2xl border border-border overflow-hidden">
        {/* First Name */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <label className="text-foreground font-medium">First Name</label>
          <div className="relative">
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={handleFirstNameBlur}
              disabled={updatingFirstName}
              className="w-48 text-right rounded-full border-border bg-secondary/50"
            />
            {updatingFirstName && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Last Name */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <label className="text-foreground font-medium">Last Name</label>
          <div className="relative">
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={handleLastNameBlur}
              disabled={updatingLastName}
              className="w-48 text-right rounded-full border-border bg-secondary/50"
            />
            {updatingLastName && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Email (Read-only) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <label className="text-foreground font-medium">Email</label>
          <span className="text-muted-foreground">{user?.email}</span>
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
        onSelect={handleLanguageChange}
        isLoading={updatingLanguage}
      />

      {/* Currency Dialog */}
      <SelectionDialog
        open={currencyDialogOpen}
        onOpenChange={setCurrencyDialogOpen}
        title="Choose currency"
        items={currencies}
        selectedValue={selectedCurrency}
        onSelect={handleCurrencyChange}
        isLoading={updatingCurrency}
      />

      {/* Image Crop Dialog */}
      {selectedImage && (
        <ImageCropDialog
          open={cropDialogOpen}
          onOpenChange={setCropDialogOpen}
          imageSrc={selectedImage}
          onCropComplete={handleCropComplete}
          aspectRatio={1}
          cropShape="round"
        />
      )}
    </motion.div>
  );
}
