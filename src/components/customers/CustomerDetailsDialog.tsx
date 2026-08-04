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
  if (!customer) return null;

  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const formattedDate = (() => {
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
  })();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[92%] sm:max-w-[480px] rounded-xl overflow-hidden p-6">
        <DialogHeader className="text-left pb-4 border-b">
          <DialogTitle className="text-lg font-bold">Customer Details</DialogTitle>
        </DialogHeader>

        {/* Profile Card Header */}
        <div className="flex items-center space-x-4 py-4">
          <Avatar className="h-14 w-14 border shadow-sm shrink-0">
            <AvatarImage src={customer.avatar} alt={customer.name} />
            <AvatarFallback className="bg-primary/5 text-primary text-base font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1 truncate">
            <h3 className="font-bold text-base text-foreground leading-tight truncate">
              {customer.name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-muted-foreground flex items-center">
                <Building2 className="h-3.5 w-3.5 mr-1" />
                {customer.company}
              </span>
              <span>•</span>
              <CustomerStatusBadge status={customer.status} />
            </div>
          </div>
        </div>

        {/* Contact Details List */}
        <div className="space-y-3.5 py-4 border-t border-b bg-muted/5 px-2 rounded-lg">
          <div className="flex items-center space-x-3 text-xs sm:text-sm">
            <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
            <div className="truncate">
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wider">Email</span>
              <span className="text-foreground font-medium truncate block">{customer.email}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs sm:text-sm">
            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wider">Phone</span>
              <span className="text-foreground font-medium block">{customer.phone}</span>
            </div>
          </div>

          <div className="flex items-center space-x-3 text-xs sm:text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
            <div>
              <span className="text-[10px] text-muted-foreground block font-semibold uppercase tracking-wider">Last Contacted</span>
              <span className="text-foreground font-medium block">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Notes Segment */}
        <div className="space-y-2 py-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center">
            <Notebook className="h-3.5 w-3.5 mr-1.5 text-primary" />
            <span>Internal Notes</span>
          </h4>
          <div className="text-xs sm:text-sm text-foreground bg-muted/20 border border-muted/50 rounded-lg p-3 min-h-[70px] leading-relaxed whitespace-pre-wrap">
            {customer.notes ? customer.notes : <span className="text-muted-foreground italic">No notes recorded for this customer.</span>}
          </div>
        </div>

        {/* Close Button footer */}
        <div className="flex justify-end pt-3">
          <Button onClick={onClose} className="text-xs px-5">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
});
CustomerDetailsDialog.displayName = "CustomerDetailsDialog";
