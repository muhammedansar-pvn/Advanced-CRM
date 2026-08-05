import * as React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { CustomerStatusBadge } from "./customer-status-badge";
import { CustomerActions } from "./customer-actions";
import { Customer } from "@/types";
import { Building2, Mail, Phone, Calendar } from "lucide-react";

interface CustomerRowProps {
  customer: Customer;
  layout: "table" | "card";
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const CustomerRow = React.memo(function CustomerRow({
  customer,
  layout,
  onView,
  onEdit,
  onDelete,
}: CustomerRowProps) {

  const formatDate = React.useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  }, []);

  const initials = React.useMemo(() => {
    return customer.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }, [customer.name]);

  const handleView = React.useCallback(() => onView(customer), [customer, onView]);
  const handleEdit = React.useCallback(() => onEdit(customer), [customer, onEdit]);
  const handleDelete = React.useCallback(() => onDelete(customer), [customer, onDelete]);

  if (layout === "card") {
    return (
      <Card className="overflow-hidden border-muted/60 relative group">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardContent className="p-5">

          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border shadow-sm">
                <AvatarImage src={customer.avatar} alt={customer.name} />
                <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm leading-tight text-foreground truncate max-w-[150px]">
                  {customer.name}
                </h3>
                <div className="mt-1">
                  <CustomerStatusBadge status={customer.status} />
                </div>
              </div>
            </div>
            <CustomerActions
              customerId={customer.id}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          <div className="space-y-2.5 text-xs text-muted-foreground border-t pt-3.5">
            <div className="flex items-center space-x-2">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
              <span className="truncate text-foreground font-medium">{customer.company}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] bg-muted/40 rounded px-2.5 py-1.5 border border-muted/50">
              <span className="flex items-center text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1 text-muted-foreground/85" />
                Last Contact:
              </span>
              <span className="font-semibold text-foreground">{formatDate(customer.lastContact)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <TableRow className="group">
      <TableCell className="w-[80px]">
        <Avatar className="h-9 w-9 border shadow-sm group-hover:scale-105 transition-transform duration-200">
          <AvatarImage src={customer.avatar} alt={customer.name} />
          <AvatarFallback className="bg-primary/5 text-primary text-[11px] font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-semibold text-foreground">{customer.name}</TableCell>
      <TableCell className="text-muted-foreground">{customer.email}</TableCell>
      <TableCell className="text-muted-foreground whitespace-nowrap">{customer.phone}</TableCell>
      <TableCell className="font-medium text-foreground">{customer.company}</TableCell>
      <TableCell>
        <CustomerStatusBadge status={customer.status} />
      </TableCell>
      <TableCell className="text-muted-foreground">{formatDate(customer.lastContact)}</TableCell>
      <TableCell className="text-right">
        <CustomerActions
          customerId={customer.id}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </TableCell>
    </TableRow>
  );
});
CustomerRow.displayName = "CustomerRow";
