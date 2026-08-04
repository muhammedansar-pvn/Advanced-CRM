import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { Customer } from "@/types";

interface DeleteCustomerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  customer: Customer | null;
}

export const DeleteCustomerDialog = React.memo(function DeleteCustomerDialog({
  isOpen,
  onClose,
  onConfirm,
  customer,
}: DeleteCustomerDialogProps) {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
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

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t mt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:order-1 text-xs"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="w-full sm:order-2 text-xs font-semibold"
          >
            Delete Customer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
DeleteCustomerDialog.displayName = "DeleteCustomerDialog";
