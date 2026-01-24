import { motion } from "framer-motion";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

interface DeleteTripDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tripTitle: string;
  onConfirm: () => void;
}

export function DeleteTripDialog({
  open,
  onOpenChange,
  tripTitle,
  onConfirm,
}: DeleteTripDialogProps) {
  const { toast } = useToast();

  const handleConfirm = () => {
    onConfirm();
    toast({
      title: "Trip deleted",
      description: `"${tripTitle}" has been removed from your trips.`,
    });
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <motion.div
            className="mx-auto w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-2"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </motion.div>
          <AlertDialogTitle className="text-center font-serif">
            Delete Trip
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Are you sure you want to delete "
            <span className="font-medium text-foreground">{tripTitle}</span>"?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center gap-2">
          <AlertDialogCancel className="sm:w-32">Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="sm:w-32 bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
