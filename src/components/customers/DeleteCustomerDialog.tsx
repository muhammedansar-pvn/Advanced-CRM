import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Customer } from "@/types";

interface DeleteCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customer: Customer | null;
  isDeleting?: boolean;
}

export const DeleteCustomerDialog = React.memo(function DeleteCustomerDialog({
  isOpen,
  onClose,
  onConfirm,
  customer,
  isDeleting = false,
}: DeleteCustomerDialogProps) {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <DialogContent className="max-w-[92%] sm:max-w-[400px] rounded-xl p-6">
        <DialogHeader className="flex flex-col items-center text-center space-y-3 pb-2">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive shrink-0">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle className="text-base font-bold">Delete Customer</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
            Are you sure you want to delete <span className="font-semibold text-foreground">{customer.name}</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:order-1 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:order-2 text-xs font-semibold min-h-[36px]"
          >
            {isDeleting ? (
              <span className="flex items-center justify-center space-x-1.5">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Deleting...</span>
              </span>
            ) : (
              <span>Delete Customer</span>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
DeleteCustomerDialog.displayName = "DeleteCustomerDialog";
