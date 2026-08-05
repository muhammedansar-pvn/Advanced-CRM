import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CustomerStatusBadge } from "./customer-status-badge";
import { Customer } from "@/types";
import { Building2, Mail, Phone, Calendar, Notebook } from "lucide-react";

interface CustomerDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

export const CustomerDetailsDialog = React.memo(function CustomerDetailsDialog({
  isOpen,
  onClose,
  customer,
}: CustomerDetailsDialogProps) {
  const initials = React.useMemo(() => {
    if (!customer) return "";
    return customer.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, [customer]);

  const formattedDate = React.useMemo(() => {
    if (!customer) return "";
    try {
      const date = new Date(customer.lastContact);
      if (isNaN(date.getTime())) return customer.lastContact;
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return customer.lastContact;
    }
  }, [customer]);

  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-[92%] sm:max-w-[480px] rounded-xl overflow-hidden p-6"
        aria-label={`Details for ${customer.name}`}
      >
        <DialogHeader className="text-left pb-4 border-b">
          <DialogTitle className="text-base font-bold">Customer Details</DialogTitle>
        </DialogHeader>

        {/* Identity */}
        <div className="flex items-center gap-4 py-4">
          <Avatar className="h-14 w-14 border shadow-sm shrink-0">
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback className="bg-primary/5 text-primary text-base font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 min-w-0">
            <h3 className="font-bold text-base text-foreground leading-tight truncate">
              {customer.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                {customer.company}
              </span>
              <span aria-hidden="true" className="text-muted-foreground/40">•</span>
              <CustomerStatusBadge status={customer.status} />
            </div>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-3 py-4 border-t border-b bg-muted/5 px-3 rounded-lg">
          <div className="flex items-start gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
            <div className="min-w-0">
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wider mb-0.5">
                Email
              </span>
              <span className="text-foreground font-medium text-sm truncate block">
                {customer.email}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wider mb-0.5">
                Phone
              </span>
              <span className="text-foreground font-medium text-sm">{customer.phone}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wider mb-0.5">
                Last Contacted
              </span>
              <span className="text-foreground font-medium text-sm">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2 py-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Notebook className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Internal Notes
          </h4>
          <div className="text-sm text-foreground bg-muted/20 border border-muted/50 rounded-lg p-3 min-h-[70px] leading-relaxed whitespace-pre-wrap">
            {customer.notes ? (
              customer.notes
            ) : (
              <span className="text-muted-foreground italic text-xs">
                No notes recorded for this customer.
              </span>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <Button onClick={onClose} className="text-xs px-5" aria-label="Close customer details">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
CustomerDetailsDialog.displayName = "CustomerDetailsDialog";
