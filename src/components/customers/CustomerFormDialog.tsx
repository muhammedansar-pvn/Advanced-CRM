import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CustomerForm, CustomerFormValues } from "./CustomerForm";

interface CustomerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CustomerFormValues) => void;
  defaultValues?: Partial<CustomerFormValues>;
  mode: "add" | "edit";
}

export const CustomerFormDialog = React.memo(function CustomerFormDialog({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  mode,
}: CustomerFormDialogProps) {
  const [isDirty, setIsDirty] = React.useState(false);

  const handleCloseAttempt = React.useCallback(() => {
    if (isDirty) {
      const confirmDiscard = window.confirm(
        "You have unsaved changes. Are you sure you want to discard them?"
      );
      if (confirmDiscard) {
        onClose();
      }
    } else {
      onClose();
    }
  }, [isDirty, onClose]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        handleCloseAttempt();
      }
    },
    [handleCloseAttempt]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[92%] sm:max-w-[500px] rounded-xl overflow-y-auto max-h-[90vh]"
        onPointerDownOutside={(e) => {
          if (isDirty) {
            e.preventDefault();
            handleCloseAttempt();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (isDirty) {
            e.preventDefault();
            handleCloseAttempt();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {mode === "add" ? "Add Customer" : "Edit Customer Details"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {mode === "add"
              ? "Create a new customer profile. All fields marked with * are required."
              : "Update this customer profile. Click save changes when you are done."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          {/* Key key={isOpen} resets form state when dialog opens/closes */}
          <CustomerForm
            key={isOpen ? `${mode}_open` : "closed"}
            mode={mode}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onCancel={handleCloseAttempt}
            onDirtyChange={setIsDirty}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});
CustomerFormDialog.displayName = "CustomerFormDialog";
