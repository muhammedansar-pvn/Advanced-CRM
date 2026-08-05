import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { CustomerForm } from "./CustomerForm";
import { CustomerFormValues } from "@/schemas/customerSchema";

type DialogPointerDownOutsideEvent = NonNullable<
  React.ComponentPropsWithoutRef<typeof DialogContent>["onPointerDownOutside"]
> extends (e: infer E) => void ? E : never;

interface CustomerFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: CustomerFormValues) => void;
  defaultValues?: Partial<CustomerFormValues>;
  mode: "add" | "edit";
  isSubmitting?: boolean;
}

export const CustomerFormDialog = React.memo(function CustomerFormDialog({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
  mode,
  isSubmitting = false,
}: CustomerFormDialogProps) {
  const [isDirty, setIsDirty] = React.useState(false);

  const handleCloseAttempt = React.useCallback(() => {
    if (isSubmitting) return;

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
  }, [isDirty, onClose, isSubmitting]);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!open) {
        handleCloseAttempt();
      }
    },
    [handleCloseAttempt]
  );

  const handlePointerDownOutside = React.useCallback(
    (e: DialogPointerDownOutsideEvent) => {
      if (isDirty || isSubmitting) {
        e.preventDefault();
        handleCloseAttempt();
      }
    },
    [isDirty, isSubmitting, handleCloseAttempt]
  );

  const handleEscapeKeyDown = React.useCallback(
    (e: KeyboardEvent) => {
      if (isDirty || isSubmitting) {
        e.preventDefault();
        handleCloseAttempt();
      }
    },
    [isDirty, isSubmitting, handleCloseAttempt]
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-[92%] sm:max-w-[500px] rounded-xl overflow-y-auto max-h-[90vh]"
        onPointerDownOutside={handlePointerDownOutside}
        onEscapeKeyDown={handleEscapeKeyDown}
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
          <CustomerForm
            key={isOpen ? `${mode}_open` : "closed"}
            mode={mode}
            defaultValues={defaultValues}
            onSubmit={onSubmit}
            onCancel={handleCloseAttempt}
            onDirtyChange={setIsDirty}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
});
CustomerFormDialog.displayName = "CustomerFormDialog";
