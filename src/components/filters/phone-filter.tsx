import * as React from "react";
import { Input } from "@/components/ui/input";

interface PhoneFilterProps {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneFilter = React.memo(function PhoneFilter({
  value,
  onChange,
}: PhoneFilterProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Phone Number
      </h4>
      <Input
        type="text"
        placeholder="Filter by phone contains..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 text-xs placeholder:text-muted-foreground bg-muted/20"
      />
    </div>
  );
});
PhoneFilter.displayName = "PhoneFilter";
