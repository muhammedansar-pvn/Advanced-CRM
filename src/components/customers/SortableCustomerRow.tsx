import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomerStatusBadge } from "./customer-status-badge";
import { CustomerActions } from "./customer-actions";
import { Customer } from "@/types";

interface SortableCustomerRowProps {
  customer: Customer;
  onView: (customer: Customer) => void;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export const SortableCustomerRow = React.memo(function SortableCustomerRow({
  customer,
  onView,
  onEdit,
  onDelete,
}: SortableCustomerRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: customer.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    zIndex: isDragging ? 10 : undefined,
    position: isDragging ? "relative" : undefined,
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

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={`group transition-colors duration-150 hover:bg-muted/30 ${isDragging ? "bg-muted/60 shadow-md" : ""}`}
    >
      <TableCell className="w-[36px] pr-0 pl-3">
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing touch-none text-muted-foreground/30 hover:text-muted-foreground transition-colors duration-150 p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Drag to reorder ${customer.name}`}
          {...listeners}
          {...attributes}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" />
          </svg>
        </button>
      </TableCell>
      <TableCell className="w-[80px]">
        <Avatar className="h-9 w-9 border shadow-sm ring-0 group-hover:ring-2 group-hover:ring-primary/10 transition-all duration-150">
          <AvatarImage src={customer.avatar} alt={customer.name} />
          <AvatarFallback className="bg-primary/5 text-primary text-[11px] font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-semibold text-foreground">{customer.name}</TableCell>
      <TableCell className="text-muted-foreground text-sm">{customer.email}</TableCell>
      <TableCell className="text-muted-foreground whitespace-nowrap text-sm">{customer.phone}</TableCell>
      <TableCell className="font-medium text-foreground text-sm">{customer.company}</TableCell>
      <TableCell>
        <CustomerStatusBadge status={customer.status} />
      </TableCell>
      <TableCell className="text-muted-foreground text-sm">{formattedDate}</TableCell>
      <TableCell className="text-right pr-4">
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
SortableCustomerRow.displayName = "SortableCustomerRow";
