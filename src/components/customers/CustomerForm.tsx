"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { customerSchema, CustomerFormValues } from "@/schemas/customerSchema";
import { Loader2 } from "lucide-react";

interface CustomerFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<CustomerFormValues>;
  onSubmit: (values: CustomerFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

export const CustomerForm = React.memo(function CustomerForm({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  onDirtyChange,
}: CustomerFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "active",
      notes: "",
      avatar: "",
      ...defaultValues,
    },
  });

  const notesValue = watch("notes") || "";
  const notesLength = notesValue.length;

  React.useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">

      <div className="space-y-1.5">
        <label htmlFor="form-name" className="text-xs font-semibold text-foreground">
          Full Name <span className="text-destructive">*</span>
        </label>
        <Input
          id="form-name"
          type="text"
          placeholder="e.g. John Doe"
          {...register("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
        />
        {errors.name && (
          <p id="name-error" className="text-[11px] font-semibold text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="form-email" className="text-xs font-semibold text-foreground">
            Email Address <span className="text-destructive">*</span>
          </label>
          <Input
            id="form-email"
            type="email"
            placeholder="e.g. john@company.com"
            {...register("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.email && (
            <p id="email-error" className="text-[11px] font-semibold text-destructive">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="form-phone" className="text-xs font-semibold text-foreground">
            Phone Number <span className="text-destructive">*</span>
          </label>
          <Input
            id="form-phone"
            type="text"
            placeholder="e.g. 5550192834"
            {...register("phone")}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            className={errors.phone ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.phone && (
            <p id="phone-error" className="text-[11px] font-semibold text-destructive">
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="form-company" className="text-xs font-semibold text-foreground">
            Company <span className="text-destructive">*</span>
          </label>
          <Input
            id="form-company"
            type="text"
            placeholder="e.g. Acme Corp"
            {...register("company")}
            aria-invalid={!!errors.company}
            aria-describedby={errors.company ? "company-error" : undefined}
            className={errors.company ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.company && (
            <p id="company-error" className="text-[11px] font-semibold text-destructive">
              {errors.company.message}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="form-status" className="text-xs font-semibold text-foreground">
            Status <span className="text-destructive">*</span>
          </label>
          <select
            id="form-status"
            {...register("status")}
            aria-invalid={!!errors.status}
            aria-describedby={errors.status ? "status-error" : undefined}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          {errors.status && (
            <p id="status-error" className="text-[11px] font-semibold text-destructive">
              {errors.status.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="form-avatar" className="text-xs font-semibold text-foreground">
          Avatar URL (optional)
        </label>
        <Input
          id="form-avatar"
          type="text"
          placeholder="https://example.com/avatar.jpg"
          {...register("avatar")}
        />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label htmlFor="form-notes" className="text-xs font-semibold text-foreground">
            Engagement Notes
          </label>
          <span className={`text-[10px] font-bold ${notesLength > 500 ? "text-destructive" : "text-muted-foreground"}`}>
            {notesLength} / 500
          </span>
        </div>
        <textarea
          id="form-notes"
          placeholder="Write customer feedback, notes, or deal context..."
          {...register("notes")}
          rows={3}
          className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
        />
        {errors.notes && (
          <p className="text-[11px] font-semibold text-destructive">
            {errors.notes.message}
          </p>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-xs"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="text-xs font-semibold min-w-[100px]"
        >
          {isSubmitting ? (
            <span className="flex items-center space-x-1">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Saving...</span>
            </span>
          ) : (
            <span>{mode === "add" ? "Create Customer" : "Save Changes"}</span>
          )}
        </Button>
      </div>
    </form>
  );
});
CustomerForm.displayName = "CustomerForm";
