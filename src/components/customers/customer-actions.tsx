import * as React from "react";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CustomerActionsProps {
  customerId: string;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CustomerActions = React.memo(function CustomerActions({
  customerId,
  onView,
  onEdit,
  onDelete,
}: CustomerActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-muted" aria-label="Open actions">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 bg-popover border p-1 shadow-md z-50">
        <DropdownMenuItem
          onClick={onView}
          className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer transition-colors duration-150"
        >
          <Eye className="h-4 w-4" />
          <span>View</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onEdit}
          className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer transition-colors duration-150"
        >
          <Edit className="h-4 w-4" />
          <span>Edit</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onDelete}
          className="flex items-center space-x-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive cursor-pointer transition-colors duration-150"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});
CustomerActions.displayName = "CustomerActions";

