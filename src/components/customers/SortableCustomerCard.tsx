import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerStatusBadge } from "./customer-status-badge";
import { CustomerActions } from "./customer-actions";
import { Customer } from "@/types";
import { Building2, Mail, Phone, Calendar, GripVertical } from "lucide-react";

interface SortableCustomerCardProps {
  customer: Customer;
  index?: number;
  isSelected?: boolean;
  onToggleSelect?: (id: string, index?: number, isShift?: boolean) => void;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const SortableCustomerCard = React.memo(function SortableCustomerCard({
  customer,
  index,
  isSelected = false,
  onToggleSelect,
  onView,
  onEdit,
  onDelete,
}: SortableCustomerCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: customer.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  const initials = React.useMemo(
    () =>
      customer.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase(),
    [customer.name]
  );

  const formattedDate = React.useMemo(() => {
    try {
      return new Date(customer.lastContact).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return customer.lastContact;
    }
  }, [customer.lastContact]);

  const handleView = React.useCallback(() => onView(customer), [customer, onView]);
  const handleEdit = React.useCallback(() => onEdit(customer), [customer, onEdit]);
  const handleDelete = React.useCallback(() => onDelete(customer), [customer, onDelete]);

  const handleCheckboxClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onToggleSelect) {
        onToggleSelect(customer.id, index, e.shiftKey);
      }
    },
    [customer.id, index, onToggleSelect]
  );

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        className={`card-hover overflow-hidden border-muted/60 relative group cursor-default ${
          isSelected ? "border-primary/40 bg-primary/5 dark:bg-primary/10" : ""
        } ${isDragging ? "shadow-lg border-primary/30" : ""}`}
      >
        {/* Accent bar on hover */}
        <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-primary to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardContent className="p-5">
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={isSelected}
                onClick={handleCheckboxClick}
                aria-label={`Select ${customer.name}`}
                className="mt-0.5"
              />
              {/* Drag handle */}
              <button
                type="button"
                className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground/30 hover:text-muted-foreground transition-colors duration-150 p-0.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring self-start mt-0.5"
                aria-label={`Drag to reorder ${customer.name}`}
                {...listeners}
                {...attributes}
              >
                <GripVertical className="h-4 w-4" aria-hidden="true" />
              </button>

              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 border shadow-sm transition-shadow duration-200 group-hover:shadow-md">
                  <AvatarImage src={customer.avatar} alt={customer.name} />
                  <AvatarFallback className="bg-primary/5 text-primary text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-sm leading-tight text-foreground truncate max-w-[140px]">
                    {customer.name}
                  </h3>
                  <div className="mt-1">
                    <CustomerStatusBadge status={customer.status} />
                  </div>
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

          {/* Details */}
          <div className="space-y-2.5 text-xs text-muted-foreground border-t pt-3.5">
            <div className="flex items-center space-x-2">
              <Building2 className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              <span className="truncate text-foreground font-medium">{customer.company}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              <span className="truncate">{customer.email}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70" aria-hidden="true" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] bg-muted/40 rounded-lg px-2.5 py-1.5 border border-muted/50">
              <span className="flex items-center text-muted-foreground">
                <Calendar className="h-3 w-3 mr-1 text-muted-foreground/70" aria-hidden="true" />
                Last Contact
              </span>
              <span className="font-semibold text-foreground">{formattedDate}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
SortableCustomerCard.displayName = "SortableCustomerCard";
