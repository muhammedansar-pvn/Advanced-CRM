import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface FilterBadgeProps {
  label: string;
  value: string;
  onRemove: () => void;
}

export const FilterBadge = React.memo(function FilterBadge({
  label,
  value,
  onRemove,
}: FilterBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className="pl-2.5 pr-1.5 py-1 text-xs flex items-center space-x-1 border border-muted-foreground/10 bg-muted/40 text-foreground hover:bg-muted/65 rounded-md select-none"
    >
      <span className="font-semibold text-muted-foreground">{label}:</span>
      <span className="font-medium truncate max-w-[120px]">{value}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="h-4 w-4 rounded-sm hover:bg-muted-foreground/15 flex items-center justify-center text-muted-foreground/85 hover:text-foreground focus:outline-none cursor-pointer"
        aria-label={`Remove ${label} filter`}
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  );
});
FilterBadge.displayName = "FilterBadge";
