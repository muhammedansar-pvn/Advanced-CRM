import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { CustomerStatus } from "@/types";

interface StatusFilterProps {
  selectedStatus: CustomerStatus[];
  onChange: (status: CustomerStatus[]) => void;
}

export const StatusFilter = React.memo(function StatusFilter({
  selectedStatus,
  onChange,
}: StatusFilterProps) {
  const handleToggle = React.useCallback(
    (status: CustomerStatus) => {
      const next = selectedStatus.includes(status)
        ? selectedStatus.filter((s) => s !== status)
        : [...selectedStatus, status];
      onChange(next);
    },
    [selectedStatus, onChange]
  );

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Status
      </h4>
      <div className="space-y-2">
        <label className="flex items-center space-x-2.5 text-sm font-medium leading-none cursor-pointer select-none">
          <Checkbox
            checked={selectedStatus.includes("active")}
            onCheckedChange={() => handleToggle("active")}
          />
          <span className="text-foreground">Active</span>
        </label>
        <label className="flex items-center space-x-2.5 text-sm font-medium leading-none cursor-pointer select-none">
          <Checkbox
            checked={selectedStatus.includes("inactive")}
            onCheckedChange={() => handleToggle("inactive")}
          />
          <span className="text-foreground">Inactive</span>
        </label>
      </div>
    </div>
  );
});
StatusFilter.displayName = "StatusFilter";
